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
let currentImage = img1

var imgPosition = { x: 0, y: 0 };
var scale = 1;
var dragging = false;
var dragStart = { x: 0, y: 0 };

// Liste von Koordinaten für die Linie
var linePoints = [
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

function getLastRoutes() { //no need to call up controller anymore as client saves the last route
    const routes = JSON.parse(localStorage.getItem('lastRoute')) || [];
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
}

window.onload = function() {
    getLastRoutes();
};

function saveRoute(startId, endId, isBarrierFree, extrastops, linePoints) { //no need to call up controller anymore as client saves the last route
    const newRoute = { startId, endId, isBarrierFree, extrastops, linePoints };
    const existingRoutes = JSON.parse(localStorage.getItem('lastRoute')) || [];
    existingRoutes.push(newRoute);
    localStorage.setItem('lastRoute', JSON.stringify(existingRoutes));
}

function addRouteToPreviousRoutes(startNode, endNode, extrastops, linePoints) {
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
                linePoints = data.path
                draw();
                addRouteToPreviousRoutes(startOption, endOption, selectedExtraStops, linePoints);
            } 
        )
        .catch(error => console.error('Error fetching route:', error));
};

}

// Event-Listener für die Schaltflächen
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