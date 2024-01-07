var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var img = new Image();
img.src = 'maps\\05 Stammhaus E1-Bestandsplan B-1.png'; // Setzen Sie die URL Ihres Bildes hier ein

var imgPosition = { x: 0, y: 0 };
var scale = 1;
var dragging = false;
var dragStart = { x: 0, y: 0 };

// Liste von Koordinaten für die Linie
var linePoints = [
    {x: 361, y: 1318},
    {x: 580, y: 1318},
    {x: 580, y: 1275},
    {x: 400, y: 300},
    {x: 500, y: 200},
    {x: 700, y: 700},
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

    scale *= zoomFactor;
    imgPosition.x -= (event.offsetX - imgPosition.x) * (zoomFactor - 1);
    imgPosition.y -= (event.offsetY - imgPosition.y) * (zoomFactor - 1);

    draw();
    event.preventDefault(); // Verhindert das Scrollen der Seite
});

function draw() {
    if (!img.complete) {
        setTimeout(draw, 50); // Warten, bis das Bild geladen ist
        return;
    }

    // Löschen des Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Zeichnen des Bildes an der aktuellen Position mit Zoom
    ctx.save();
    ctx.translate(imgPosition.x, imgPosition.y);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);

    // Zeichnen der Linie basierend auf der Koordinatenliste
    ctx.strokeStyle = 'red'; // Farbe der Linie
    ctx.lineWidth = 2; // Dicke der Linie
    drawLine(linePoints);
    ctx.restore();
}

function drawLine(points) {
    if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
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
                const { startId, endId, isBarrierFree, extrastops } = route;
                const routeElement = document.createElement('button');
                routeElement.textContent = `Von ${startId} nach ${endId}, barrierefrei: ${isBarrierFree} | extra stops: ${extrastops}`;
                routeElement.style.display = 'block';
                routeElement.onclick = () => loadRouteToForm(startId, endId, isBarrierFree, extrastops);

                previousRoutesContainer.appendChild(routeElement);
            });
        })
        .catch(error => console.error('Fehler beim Abrufen der letzten Routen:', error));
}

function loadRouteToForm(startId, endId, isBarrierFree, extrastops) {
    const startNodeSelect = $('#startNode');
    const endNodeSelect = $('#endNode');
    const barrierFreeCheckbox = document.getElementById('barrierfree');
    const extraStopsSelect = $('#extrastops');

    if (startNodeSelect && endNodeSelect && barrierFreeCheckbox && extraStopsSelect) {
        startNodeSelect.val(startId).trigger('change');
        endNodeSelect.val(endId).trigger('change');
        barrierFreeCheckbox.checked = isBarrierFree === 'Ja';

        // Vorbelegen der Extrastops
        const extraStopsArray = extrastops.split(', ');
        extraStopsSelect.val(extraStopsArray).trigger('change');
    } else {
        console.error('Eines oder mehrere Elemente wurden im DOM nicht gefunden');
    }
}

// Function to load nodes initially
function loadNodes() {
    fetch('/initialize')
        .then(response => response.json())
        .then(data => {
            nodes = data; // Store the nodes globally
            console.log("Nodes loaded:", nodes);
        })
        .catch(error => console.error('Error loading nodes:', error));
}


window.onload = function() {
    loadNodes();
    getLastRoutes();
};


function saveRoute(startId, endId, isBarrierFree, extrastops) {
    fetch('/saveRoute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Sets the Content-Type to application/json
        },
        body: JSON.stringify({ startId, endId, isBarrierFree, extrastops }) // Converts the object to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // addRouteToPreviousRoutes
        console.log("Route successfully saved:", body);
    })
    .catch(error => {
        console.error("Error saving the route:", error);
    });
}


    function addRouteToPreviousRoutes(startNode, endNode, extrastops) {
        var routeList = document.getElementById('previousRoutes');
        var newRouteButton = document.createElement('button'); // Verwenden Sie 'button' anstatt 'li'
        var isBarrierFree = document.getElementById('barrierfree').checked ? 'Ja' : 'Nein';
    
        newRouteButton.textContent = `Von ${startNode} nach ${endNode}, barrierefrei: ${isBarrierFree} | extra stops: ${extrastops}`;
        newRouteButton.style.display = 'block'; // Stellen Sie sicher, dass es in einer neuen Zeile angezeigt wird
        newRouteButton.onclick = () => loadRouteToForm(startNode, endNode, isBarrierFree, extrastops); // Verwenden Sie die gleiche Funktion zum Laden der Route in das Formular
    
        saveRoute(startNode, endNode, isBarrierFree, extrastops); // Speichern der Route im Backend
    
        routeList.appendChild(newRouteButton); // Fügen Sie den Button zur Liste hinzu
    }
    


window.calculateRoute = function() {
    let startOption = document.getElementById('startNode').value; // B.1.1.3
    let endOption = document.getElementById('endNode').value;     // B.1.1.13
    var isBarrierFree = document.getElementById('barrierfree').checked ? 'Ja' : 'Nein';
    const selectedExtraStops = Array.from(document.getElementById('extrastops').selectedOptions)
    .map(option => option.value).join(', ');
    addRouteToPreviousRoutes(startOption, endOption, selectedExtraStops);

    fetch(`/calculateRoute?startId=${startOption}&endId=${endOption}&isBarrierFree=${isBarrierFree}&extrastops=${selectedExtraStops}`) 
        .then(response => response.json())
        .then(data => {
            console.log('Calculated Path:', data.path);
            console.log("START: " + startOption)
            console.log("START: " + endOption)
            console.log("START: " + isBarrierFree)
            console.log("START: " + selectedExtraStops)
            //hier a star aufrufen und dann die route berechnen

        })
        .catch(error => console.error('Error fetching route:', error));
};

}
img.onload = draw;