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

// Call the loadNodes function on page load
window.onload = function() {
    loadNodes();
};

function saveRoute(startId, endId) {
    $.post('/saveRoute', { startId, endId }, function(response) {
        console.log(response.message);
    });
}
function addRouteToPreviousRoutes(startNode, endNode) {
    var routeList = document.getElementById('previousRoutes');
    var newRoute = document.createElement('li');
    newRoute.textContent = 'Von ' + startNode + ' nach ' + endNode;

    newRoute.addEventListener('click', function() {
        $('#startNode').val(startNode).trigger('change');
        $('#endNode').val(endNode).trigger('change');
    });
    saveRoute(startNode, endNode);
    routeList.appendChild(newRoute);
}


// Funktion zum Berechnen der Route
window.calculateRoute = function() {
    let startOption = document.getElementById('startNode').value; // B.1.1.3
    let endOption = document.getElementById('endNode').value;     // B.1.1.13

    fetch(`/calculateRoute?startId=${startOption}&endId=${endOption}`)
        .then(response => response.json())
        .then(data => {
            console.log('Calculated Path:', data.path);
            // berechnet schonmal was aber nicht wirklich richtig, muss man sich anschauen
            // drawRoute(data.path); // Zeichnet die Route
            // drawLine(PUNKTE); braucht die punkte, die der algo durchgelaufen ist --> dann zeichnen der punkte
            addRouteToPreviousRoutes(startOption, endOption);

        })
        .catch(error => console.error('Error fetching route:', error));
};

// function drawRoute(path) {
//     if (!path || path.length === 0) return; // Check if path is valid

//     var ctx = canvas.getContext('2d');

//     ctx.beginPath();
//     ctx.lineWidth = 2;
//     ctx.strokeStyle = 'blue'; // Color of the route

//     path.forEach((nodeId, index) => {
//         const node = getNodeDetailsById(nodeId);
//         if (index === 0) {
//             ctx.moveTo(node.x, node.y);
//         } else {
//             ctx.lineTo(node.x, node.y);
//         }
//     });

//     ctx.stroke(); // Zeichnen der Route
//     draw();       // Dann das Bild neu zeichnen
// }
// function getNodeDetailsById(nodeId, nodes) {
//     // Convert the nodeId from "B.1.1.x" format to numeric ID
//     var numericId = parseInt(nodeId.split('.').pop());
//     return nodes[numericId];
// }


}
img.onload = draw;