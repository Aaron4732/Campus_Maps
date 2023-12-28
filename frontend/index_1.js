function getRoute() {
    fetch('/getRoute')
        .then(response => response.json())
        .then(data => alert(JSON.stringify(data)));
}

function initialize() {
    fetch('/initialize')
        .then(response => response.json())
        .then(data => alert(JSON.stringify(data)));
}

function getJsonData() {
    fetch('/getJsonData')
        .then(response => response.json())
        .then(data => alert("DATA AUS FILE: " + JSON.stringify(data)));
}

async function createAndShowAllNodeIds() {
            for (let i = 0; i < 10000; i++) {
                const response = await fetch('/createNode');
                const data = await response.json();
                console.log(data.nodeId, data.randomType);
            }
        }

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// Einstellungen für die Linie
ctx.lineWidth = 1; // Dicke der Linie
ctx.strokeStyle = 'red'; // Farbe der Linie
ctx.lineCap = 'round' // Ende der Linie
ctx.globalAlpha = 1; // Transperenz
ctx.lineJoin = 'bevel'

// Einstellungen für die Kreise
var circleRadius = 10; // Radius der Kreise
ctx.fillStyle = 'blue'; // Farbe der Kreise

var points = [
    {x: 50, y: 70},
    {x: 200, y: 250},
    {x: 400, y: 100},
    {x: 400, y: 300},
    {x: 500, y: 200},
    {x: 700, y: 700},
    // Fügen Sie hier weitere Punkte hinzu
];

var currentIndex = 0;
var progress = 0;
var speed = 0.02; // Anpassen, um die Geschwindigkeit zu ändern

function draw() {
    if (currentIndex < points.length - 1) {
        var startPoint = points[currentIndex];
        var endPoint = points[currentIndex + 1];

        var dx = endPoint.x - startPoint.x;
        var dy = endPoint.y - startPoint.y;

        var nextX = startPoint.x + dx * progress;
        var nextY = startPoint.y + dy * progress;

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();


        if (progress >= 1) {
           //drawCircle(nextX, nextY);

            progress = 0;
            currentIndex++;
        }

        progress += speed;
    }

    requestAnimationFrame(draw);
}

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2);
    ctx.fill();
}

draw();
