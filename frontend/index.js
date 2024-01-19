//const e = require("express");

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var img = new Image();
img.src = 'maps/E1.png'; // Setzen Sie die URL Ihres Bildes hier ein
var img1 = new Image();
img1.src = 'maps/E1.png'; // Pfad zu Ihrem ersten Bild
var img2 = new Image();
img2.src = 'maps/E2.png'; // Pfad zu Ihrem zweiten Bild
var img3 = new Image();
img3.src = 'maps/E3.png'; // Pfad zu Ihrem dritten Bild

let currentFlore = "E1";
let currentImage = img1;

var imgPosition = { x: 0, y: 0 };
var scale = 1/2;
var dragging = false;
var dragStart = { x: 0, y: 0 };

// Liste von Koordinaten für die Linie
var linePoints = [
    // {x: 361, y: 1318},
    // {x: 580, y: 1318},
    // {x: 580, y: 1275},
    // {x: 400, y: 300},
    // {x: 500, y: 200},
    // {x: 700, y: 700},
    // Weitere Koordinaten hier hinzufügen
];


canvas.addEventListener('mousedown', function(event) {
    dragging = true;
    dragStart.x = event.offsetX - imgPosition.x;
    dragStart.y = event.offsetY - imgPosition.y;
});

canvas.addEventListener('mouseup', function(event) {
    dragging = false;
});

canvas.addEventListener('mousemove', function(event) {
    if (dragging) {
        imgPosition.x = event.offsetX - dragStart.x;
        imgPosition.y = event.offsetY - dragStart.y;
        draw();
    }

    //console.log(imgPosition, "Mouse:", event.offsetX + imgPosition.x * -1, event.offsetY + imgPosition.y * -1)
});

canvas.addEventListener('wheel', function(event) {
    var zoomIntensity = 0.1;
    var delta = event.deltaY > 0 ? -zoomIntensity : zoomIntensity;
    var zoomFactor = 1 + delta;

    var currentScale = scale;

    scale *= zoomFactor;

    if (scale < 1/2) {
        scale = 1/2;
    }

    if (scale !== currentScale) {
        imgPosition.x -= (event.offsetX - imgPosition.x) * (zoomFactor - 1);
        imgPosition.y -= (event.offsetY - imgPosition.y) * (zoomFactor - 1);
    }

    draw();
    event.preventDefault(); // Verhindert das Scrollen der Seite
});

function draw() {
    if (!currentImage.complete) {
        setTimeout(draw, 50); // Warten, bis das Bild geladen ist
        return;
    }

    // Löschen des Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeichnen des Bildes an der aktuellen Position mit Zoom
    ctx.save();
    ctx.translate(imgPosition.x, imgPosition.y);
    ctx.scale(scale, scale);
    ctx.drawImage(currentImage, 0, 0);

    // Zeichnen der Linie basierend auf der Koordinatenliste
    ctx.strokeStyle = 'red'; // Farbe der Linie
    ctx.lineWidth = 2; // Dicke der Linie
    drawLine(linePoints);
    ctx.restore();
}

function drawLine(points) {
    if (points.length > 1) {
        ctx.beginPath();
        let startPointSet = false;

        for (var i = 0; i < points.length; i++) {
            if (points[i].floor != currentFlore) {
                continue;
            }
            if (!startPointSet) {
                ctx.moveTo(points[i].x, points[i].y);
                startPointSet = true;
            }
            else{
            ctx.lineTo(points[i].x, points[i].y);
        }
        }
        ctx.stroke();
}


// Global variable to store nodes
var nodes = {};

function getLastRoutes() {
    fetch('/getLastRoute')
        .then(response => response.json())
        .then(routes => {
            const previousRoutesContainer = document.getElementById('previousRoutes');
            previousRoutesContainer.innerHTML = '';

            routes.forEach(route => {
                const { startId, endId, isBarrierFree, extrastops, linePoints } = route;
                const routeElement = document.createElement('button');
                routeElement.textContent = `Von ${startId} nach ${endId}, barrierefrei: ${isBarrierFree} | extra stops: ${extrastops}`;
                routeElement.style.display = 'block';
                routeElement.onclick = () => loadRouteToForm(startId, endId, isBarrierFree, extrastops, linePoints);

                previousRoutesContainer.appendChild(routeElement);
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der letzten Routen:', error));
}

function loadRouteToForm(startId, endId, isBarrierFree, extrastops, xlinePoints) {
    const startNodeSelect = $('#startNode');
    const endNodeSelect = $('#endNode');
    const barrierFreeCheckbox = document.getElementById('barrierfree');
    const extraStopsSelect = $('#extrastops');

    startNodeSelect.val(startId).trigger('change');
    endNodeSelect.val(endId).trigger('change');
    barrierFreeCheckbox.checked = isBarrierFree === 'Ja';

    const extraStopsArray = extrastops.split(', ');
    extraStopsSelect.val(extraStopsArray).trigger('change');
    linePoints = xlinePoints;
    draw();
    linePoints = [];
}

window.onload = function() {
    getLastRoutes();
};


function saveRoute(startId, endId, isBarrierFree, extrastops, linePoints) {
    fetch('/saveRoute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Sets the Content-Type to application/json
        },
        body: JSON.stringify({ startId, endId, isBarrierFree, extrastops,linePoints }) // Converts the object to a JSON string
    })
}

function addRouteToPreviousRoutes(startNode, endNode, extrastops) {
    var routeList = document.getElementById('previousRoutes');
    var newRouteButton = document.createElement('button');
    var isBarrierFree = document.getElementById('barrierfree').checked ? 'Ja' : 'Nein';

    newRouteButton.textContent = `Von ${startNode} nach ${endNode}, barrierefrei: ${isBarrierFree} | extra stops: ${extrastops}`;
    newRouteButton.style.display = 'block';
    newRouteButton.onclick = () => loadRouteToForm(startNode, endNode, isBarrierFree, extrastops, linePoints);

    saveRoute(startNode, endNode, isBarrierFree, extrastops, linePoints);

    routeList.appendChild(newRouteButton);
}



window.calculateRoute = function() {
    let startOption = document.getElementById('startNode').value;
    let endOption = document.getElementById('endNode').value;
    var isBarrierFree = document.getElementById('barrierfree').checked ? 'Ja' : 'Nein';
    const selectedExtraStops = Array.from(document.getElementById('extrastops').selectedOptions)
        .map(option => option.value).join(', ');

    fetch(`/calculateRoute?startId=${startOption}&endId=${endOption}&isBarrierFree=${isBarrierFree}&extrastops=${selectedExtraStops}`)
        .then(response => response.json())
        .then(data => {
                data.path.forEach(node => {
                    console.log('X:', node.x, 'Y:', node.y);
                });
                linePoints = data.path
                draw();
                addRouteToPreviousRoutes(startOption, endOption, selectedExtraStops, linePoints);
            }
        )
        .catch(error => console.error('Error fetching route:', error));
};

}

// Event-Listener für die Ebenen Buttons
document.getElementById('button1').addEventListener('click', function() {
    currentFlore = "E1";
    currentImage = img1;
    draw();
});
document.getElementById('button2').addEventListener('click', function() {
    currentFlore = "E2";
    currentImage = img2;
    draw();
});
document.getElementById('button3').addEventListener('click', function() {
    currentFlore = "E3";
    currentImage = img3;
    draw();
});

img.onload = draw;


// *_*_*_*_*_*_* New *_*_*_*_*_*_*

var initialContent = document.getElementById('content-area').innerHTML;


document.getElementById('continue-btn').addEventListener('click', function() {
    // Content area leeren
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';

    // Zurück zu Startpunktauswahl Button
    const backButton = document.createElement('button');
    backButton.textContent = 'Zurück zur Startpunktauswahl';
    backButton.addEventListener('click', function() {
        resetContentArea();
    });

    function resetContentArea() {
        document.getElementById('content-area').innerHTML = initialContent;

        $('#startNode').select2();
        $('#endNode').select2();
        $('#extrastops').select2();
    }

    // Text für Ziel
    const endPointLabel = document.createElement('label');
    endPointLabel.textContent = 'Ziel: ';
    endPointLabel.setAttribute('for', 'endNode');

    // Dropdown-Menü für Endpunktauswahl
    const endPointSelect = document.createElement('select');
    endPointSelect.id = 'endNode';
    endPointSelect.innerHTML = `
             <select id="endNode">
             <div id="endNodeOptions" class="dropdown-container">
                 <option value="A.1.1a">A.1.1a</option> <!-- das wird erstmal nicht gehen, muss geändert werden-->
                 <option value="A.1.1b">A.1.1b</option> <!-- das wird erstmal nicht gehen, muss geändert werden-->
                 <option value="B.1.01">B.1.01</option>
                 <option value="B.1.02">B.1.02</option>
                 <option value="B.1.03">B.1.03</option>
                 <option value="B.1.04">B.1.04</option>
                 <option value="B.1.05">B.1.05</option>
                 <option value="B.1.06">B.1.06</option>
                 <option value="B.1.07">B.1.07</option>
                 <option value="B.1.08">B.1.08</option>
                 <option value="B.1.09">B.1.09</option>
                 <option value="B.1.10">B.1.10</option>
                 <option value="B.1.11">B.1.11</option>
                 <option value="B.1.12">B.1.12</option>
                 <option value="B.1.13">B.1.13</option>
                 <option value="B.1.14">B.1.14</option>
                 <option value="B.1.15">B.1.15</option>
                 <option value="B.1.16">B.1.16</option>
                 <option value="B.1.17">B.1.17</option>
                 <option value="B.1.18">B.1.18</option>
                 <option value="B.1.19">B.1.19</option>
                 <option value="B.1.20">B.1.20</option>
                 <option value="B.1.21">B.1.21</option>
                 <option value="B.1.22">B.1.22</option>
                 <option value="B.1.23">B.1.23</option>
                 <option value="B.1.24">B.1.24</option>
                 <option value="B.1.25">B.1.25</option>
                 <option value="B.1.26">B.1.26</option>
                 <option value="B.1.27">B.1.27</option>
                 <option value="B.1.28">B.1.28</option>
                 <option value="B.1.29">B.1.29</option>
                 <option value="B.1.30">B.1.30</option>
                 <option value="B.2.01">B.2.01</option>
                 <option value="B.2.02">B.2.02</option>
                 <option value="B.2.03">B.2.03</option>
                 <option value="B.2.04">B.2.04</option>
                 <option value="B.2.05">B.2.05</option>
                 <option value="B.2.06">B.2.06</option>
                 <option value="B.2.07">B.2.07</option>
                 <option value="B.2.08">B.2.08</option>
                 <option value="B.2.09">B.2.09</option>
                 <option value="B.2.10">B.2.10</option>
                 <option value="B.2.11">B.2.11</option>
                 <option value="B.2.12">B.2.12</option>
                 <option value="B.2.13">B.2.13</option>
                 <option value="B.2.14">B.2.14</option>
                 <option value="B.2.15">B.2.15</option>
                 <option value="B.2.16">B.2.16</option>
                 <option value="B.2.17">B.2.17</option>
                 <option value="B.2.18">B.2.18</option>
                 <option value="B.2.19">B.2.19</option>
                 <option value="B.2.20">B.2.20</option>
                 <option value="B.2.21">B.2.21</option>
                 <option value="B.2.22">B.2.22</option>
                 <option value="B.2.23">B.2.23</option>
                 <option value="B.2.24">B.2.24</option>
                 <option value="B.2.25">B.2.25</option>
                 <option value="B.2.26">B.2.26</option>
                 <option value="B.2.27">B.2.27</option>
                 <option value="B.2.28">B.2.28</option>
                 <option value="B.2.29">B.2.29</option>
                 <option value="B.2.30">B.2.30</option>
                 <option value="B.2.31">B.2.31</option>
                 <option value="B.2.32">B.2.32</option>
                 <option value="B.2.33">B.2.33</option>
                 <option value="B.2.34">B.2.34</option>
                 <option value="B.2.35">B.2.35</option>
                 <option value="B.2.36">B.2.36</option>
                 <option value="B.2.37">B.2.37</option>
                 <option value="B.2.38">B.2.38</option>
                 <option value="B.2.39">B.2.39</option>
                 <option value="B.3.01">B.3.01</option>
                 <option value="B.3.02">B.3.02</option>
                 <option value="B.3.03">B.3.03</option>
                 <option value="B.3.04">B.3.04</option>
                 <option value="B.3.05">B.3.05</option>
                 <option value="B.3.06">B.3.06</option>
                 <option value="B.3.7a">B.3.07a</option> <!-- das wird erstmal nicht gehen, muss geändert werden-->
                 <option value="B.3.7b">B.3.07b</option> <!-- das wird erstmal nicht gehen, muss geändert werden-->
                 <option value="B.3.08">B.3.08</option>
                 <option value="B.3.09">B.3.09</option>
                 <option value="B.3.10">B.3.10</option>
                 <option value="B.3.11">B.3.11</option>
                 <option value="B.3.12">B.3.12</option>
                 <option value="B.3.13">B.3.13</option>
                 <option value="B.3.14">B.3.14</option>
                 <option value="B.3.15">B.3.15</option>
                 <option value="B.3.16">B.3.16</option>
                 <option value="B.3.17">B.3.17</option>
                 <option value="B.3.18">B.3.18</option>
                 <option value="B.3.19">B.3.19</option>
                 <option value="B.3.20">B.3.20</option>
                 <option value="B.3.21a">B.3.21a</option> <!-- das wird erstmal nicht gehen, muss geändert werden-->
                 <option value="B.3.21b">B.3.21b</option> <!-- das wird erstmal nicht gehen, muss geändert werden-->
                 <option value="B.3.22">B.3.22</option>
                 <option value="B.3.23">B.3.23</option>
                 <option value="B.3.24">B.3.24</option>
                 <option value="B.3.25">B.3.25</option>
                 <option value="B.3.26">B.3.26</option>
                 <option value="B.3.27">B.3.27</option>
                 <option value="B.3.28">B.3.28</option>
                 <option value="B.3.29">B.3.29</option>
                 <option value="B.3.30a">B.3.30a</option> <!-- das wird erstmal nicht gehen, muss geändert werden-->
                 <option value="B.3.30b">B.3.30b</option> <!-- das wird erstmal nicht gehen, muss geändert werden-->
                 <option value="B.3.31">B.3.31</option>
                 <option value="B.3.32">B.3.32</option>
                 <option value="B.3.33">B.3.33</option>
                 <option value="B.3.34">B.3.34</option>
                 <option value="B.3.35">B.3.35</option>
                 <option value="B.3.36">B.3.37</option>
             </div>
             </select>
    `;

    const extrastopsLabel = document.createElement('label');
    extrastopsLabel.textContent = 'Zwischenstopp: ';
    extrastopsLabel.setAttribute('for', 'extrastops');

    const extraStopsSelect = document.createElement('select');
    extraStopsSelect.id = 'extrastops';
    extraStopsSelect.multiple = true; // For multiple selection
    const extraStopsOptions = ["Aufzug", "Snackautomat", "Kaffeeautomat", "WC"];
    extraStopsOptions.forEach(optionValue => {
        let option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        extraStopsSelect.appendChild(option);
    });


    // Barrierefreie Option Checkbox
    const barrierFreeCheckbox = document.createElement('input');
    barrierFreeCheckbox.type = 'checkbox';
    barrierFreeCheckbox.id = 'barrierfree';

    const barrierFreeLabel = document.createElement('label');
    barrierFreeLabel.textContent = ' Barrierefrei';


    // Route calculation Button
    const calcRouteButton = document.createElement('button');
    calcRouteButton.id = 'route-berechnen-btn';
    calcRouteButton.textContent = 'Route berechnen';
    calcRouteButton.addEventListener('click', function() {
        calculateRoute();
    });

    // Append der Elemente zur content area
    contentArea.appendChild(backButton);
    contentArea.appendChild(endPointLabel);
    contentArea.appendChild(endPointSelect);
    contentArea.appendChild(extrastopsLabel);
    contentArea.appendChild(extraStopsSelect);
    contentArea.appendChild(barrierFreeCheckbox);
    contentArea.appendChild(barrierFreeLabel);
    contentArea.appendChild(calcRouteButton);


    // Select2 für endNode dropdown und Zwischenstopps
    $(document).ready(function() {
        $('#endNode').select2();
        $('#extrastops').select2();
    });
});