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

function startButtonClick() {
    document.getElementById('content-area').innerHTML = `
        <button id="back-btn">Zurück</button>
        <label for="start-point-instruction">Wählen Sie einen Startpunkt entweder durch Eingabe des nächsten Raumes, oder durch Auswählen eines Punktes auf der Karte.</label>
        <label for="start-point">Startpunkt:</label>
        <input type="text" id="start-point" name="start-point">
        <div id="map-container">
                <img id="map-image" src="maps/05 Stammhaus E1-Bestandsplan B-1.png" alt="Campus Map">
        </div>
        <button id="continue-btn">Weiter</button>
    `;

    document.getElementById('back-btn').addEventListener('click', function() {
        resetContentArea();
    });

    document.getElementById('continue-btn').addEventListener('click', function() {
        proceedToEndpoint();
    });
}

function resetContentArea() {
    document.getElementById('content-area').innerHTML = `
        <p>Willkommen auf CampusMaps, das Navigationssystem für den Bauteil B der FH Campus Wien. Starten Sie gleich mit dem Auswählen Ihrer Route.</p>
        <button id="confirm-btn">Start</button>
    `;
    document.getElementById('confirm-btn').addEventListener('click', startButtonClick);
}

function proceedToEndpoint() {
    var startPoint = document.getElementById('start-point').value;
    document.getElementById('content-area').innerHTML = `
        <button id="back-btn">Zurück</button>
        <p>Startpunkt: ${startPoint}</p>
        <button id="add-stop-btn">+ Zwischenstopp</button>
        <button id="remove-stop-btn">- Zwischenstopp</button>
        <div id="stop-points"></div>
        <label for="end-point">Endpunkt:</label>
        <input type="text" id="end-point" name="end-point">
        <label><input type="checkbox" id="accessible-route"> Barrierefreie Route wählen</label>
    `;

    document.getElementById('back-btn').addEventListener('click', function() {
        startButtonClick(); // Go back to the start point selection
    });

    document.getElementById('add-stop-btn').addEventListener('click', function() {
        addStopPoint();
    });

    document.getElementById('remove-stop-btn').addEventListener('click', function() {
        removeStopPoint();
    });
}

function addStopPoint() {
    var stopPointsDiv = document.getElementById('stop-points');
    var newStopPoint = document.createElement('div');
    newStopPoint.className = "stop-point-div";
    newStopPoint.innerHTML = `
        <select class="stop-type">
            <option value="-">-</option>
            <option value="kaffeemaschine">Kaffeemaschine</option>
            <option value="snackautomat">Snackautomat</option>
            <option value="toilette">Toilette</option>
            <option value="drucker">Drucker</option>
        </select>
        <input type="text" class="stop-point" style="display: inline;"> <!-- Changed from 'none' to 'inline' -->
    `;
    stopPointsDiv.appendChild(newStopPoint);

    var selectElement = newStopPoint.querySelector('.stop-type');
    selectElement.addEventListener('change', function() {
        toggleStopPointTextField(this);
    });
}


function removeStopPoint() {
    var stopPointsDiv = document.getElementById('stop-points');
    if (stopPointsDiv.children.length > 0) {
        stopPointsDiv.removeChild(stopPointsDiv.lastChild);
    }
}

function toggleStopPointTextField(selectElement) {
    var textField = selectElement.nextElementSibling;
    textField.style.display = selectElement.value === '-' ? 'inline' : 'none';
}

// Initial event listener attachment for the "Start" button
document.getElementById('confirm-btn').addEventListener('click', startButtonClick);


