// Einbindung der erforderlichen Module
const express = require('express');
const session = require('express-session');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const MapNode = require('./mapnode');
const routeCalculator = require('./routecalculator.js');

// Konfiguration des statischen Dateiservers für das Frontend
app.use(express.static(path.join(__dirname, 'frontend')));

app.use(session({
  secret: 'TESTING',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, // nur für HTTPS erforderlich
  }
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Einbindung von JSON-Parser-Middleware für eingehende JSON-Anfragen
app.use(express.json());

const mapNodes = {};

// Definieren des Pfads zur JSON-Datei, die die Kartenknoten enthält
const filePath = path.join(__dirname, '..', 'Campus_Maps', 'Editor', 'circles.json');

// Lesen der Kartenknotendaten aus einer Datei
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
      const jsonData = JSON.parse(data);

      // Erstellen von MapNode-Objekten aus den gelesenen Daten
      for (const key in jsonData) {
          mapNodes[key] = new MapNode(jsonData[key]);
      }

    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});

// Route für das Berechnen einer Strecke
app.get('/calculateRoute', (req, res) => {
  const start_name = req.query.startId; 
  const end_name = req.query.endId;
  const isBarrierFree = req.query.isBarrierFree;
  const extrastops = req.query.extrastops; 

  try {
      // Erstellung eines neuen RouteCalculator-Objekts und Suche nach einer Lösung
      let calc = new routeCalculator.queue(mapNodes, start_name, end_name, isBarrierFree, extrastops);
      let path = calc.find_solution();
      res.json({path});
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
