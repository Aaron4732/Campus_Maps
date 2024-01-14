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

let circle_radius = 5;

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

//Alle circles mit node_tpye room einfügen
var circles = [{'x': 1896.5429836766289,
'y': 1237.048312499866,
'node_type': 'Room',
'floor': 'E1',
'connections': [6],
'name': 'B.1.02',
'id': 27},
{'x': 1286.9656835810458,
'y': 1302.5845722720273,
'node_type': 'Room',
'floor': 'E1',
'connections': [5],
'name': 'B.1.10',
'id': 28},
{'x': 1317.8936120810154,
'y': 1239.9848107657983,
'node_type': 'Room',
'floor': 'E1',
'connections': [5],
'name': 'B.1.09',
'id': 29},
{'x': 1167.4400832958393,
'y': 1297.546656415967,
'node_type': 'Room',
'floor': 'E1',
'connections': [4],
'name': 'B.1.11',
'id': 30},
{'x': 924.7319716106007,
'y': 1248.1210623470274,
'node_type': 'Room',
'floor': 'E1',
'connections': [2],
'name': 'B.1.15',
'id': 31},
{'x': 895.2385574031978,
'y': 1298.0459048409045,
'node_type': 'Room',
'floor': 'E1',
'connections': [1],
'name': 'B.1.11',
'id': 32},
{'x': 395.0227377460285,
'y': 1198.1401893361958,
'node_type': 'Room',
'floor': 'E2',
'connections': [61],
'name': 'B.2.37',
'id': 68},
{'x': 451.67731460697166,
'y': 1150.8178120664093,
'node_type': 'Room',
'floor': 'E2',
'connections': [60],
'name': 'B.2.35',
'id': 69},
{'x': 414.25410787313757,
'y': 1239.22225311986,
'node_type': 'Room',
'floor': 'E2',
'connections': [61],
'name': 'B.2.36',
'id': 70},
{'x': 484.94238725926846,
'y': 1240.7823314913944,
'node_type': 'Room',
'floor': 'E2',
'connections': [63],
'name': 'B.2.34',
'id': 71},
{'x': 570.1841359307804,
'y': 1149.2577336948732,
'node_type': 'Room',
'floor': 'E2',
'connections': [62],
'name': 'B.2.33',
'id': 72},
{'x': 568.1050688900114,
'y': 1239.22225311986,
'node_type': 'Room',
'floor': 'E2',
'connections': [62],
'name': 'B.2.32',
'id': 73},
{'x': 741.707166794187,
'y': 1013.0108892477897,
'node_type': 'Room',
'floor': 'E2',
'connections': [59],
'name': 'B.2.29',
'id': 74},
{'x': 2291.5392483723667,
'y': 1182.4607224701147,
'node_type': 'Room',
'floor': 'E2',
'connections': [64],
'name': 'B.2.02',
'id': 75},
{'x': 397.4096267217206,
'y': 1196.757932155515,
'node_type': 'Room',
'floor': 'E3',
'connections': [17],
'name': 'B.3.34',
'id': 96},
{'x': 2297.150694768465,
'y': 1243.4902880264344,
'node_type': 'Room',
'floor': 'E3',
'connections': [18],
'name': 'B.3.02',
'id': 97}]

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

canvas.addEventListener('click', function(event) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;    // Verhältnis der tatsächlichen Größe zur Anzeigegröße
    var scaleY = canvas.height / rect.height;  // Verhältnis der tatsächlichen Größe zur Anzeigegröße

    var canvasX = (event.clientX - rect.left) * scaleX;
    var canvasY = (event.clientY - rect.top) * scaleY;

    var worldX = (canvasX - imgPosition.x) / scale;
    var worldY = (canvasY - imgPosition.y) / scale;

    var clickedNode = return_clicket_node(worldX, worldY);

    if (clickedNode) {
        console.log("Koordinaten im Bild: X =", worldX, ", Y =", worldY, "Node:", clickedNode);
    }
    
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


    // Zeichne Raumpunkte
    ctx.fillStyle = 'blue';
    drawPoints();
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
}

function drawPoints() {
    circles.forEach(function(room) {
        if (room.floor != currentFlore) {
            return;
        }
        ctx.beginPath();
        ctx.arc(room.x, room.y, circle_radius *2, 0, 2 * Math.PI); // Kreis für jeden Punkt
        ctx.fill();
    });
}

function return_clicket_node(x, y) {
    var node = circles.find(function(room) {
        if (room.floor != currentFlore) {
            return false;
        }
        return Math.sqrt(Math.pow(room.x - x, 2) + Math.pow(room.y - y, 2)) < circle_radius*2;
    });
    return node;
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