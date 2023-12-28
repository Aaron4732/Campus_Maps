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

    console.log(imgPosition, "Mouse:", event.offsetX + imgPosition.x * -1, event.offsetY + imgPosition.y * -1)
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

    
}

img.onload = draw;