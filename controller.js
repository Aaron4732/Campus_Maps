const express = require('express');
const session = require('express-session');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const MapNode = require('./mapnode');
const routeCalculator = require('./routecalculator');
// const nodes = loadNodes();

app.use(express.static(path.join(__dirname, 'frontend')));

app.use(session({
  secret: 'TESTING',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false, //only for https
  }
}));
const cookieParser = require('cookie-parser');
app.use(cookieParser());  
app.use(express.json()) //für cookie von lastRoute


app.get('/initialize', (req, res) => {
  const filePath = path.join(__dirname, '..', 'Campus_Maps', 'Editor', 'circles.json');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          return res.status(500).send('Fehler beim Lesen der Datei');
      }
      
      try {
        const jsonData = JSON.parse(data);
        const mapNodes = {};

        for (const key in jsonData) {
            mapNodes[key] = new MapNode(jsonData[key]);
        }

        routeCalculator.setNodes(jsonData); // Nehmen wir an, du hast eine Funktion, die die Nodes setzt
      } catch (parseErr) {
          console.error('Error parsing JSON:', parseErr);
          res.status(500).send('Invalid JSON format');
      }
  });
});

app.get('/calculateRoute', (req, res) => {
  const startId = req.query.startId;  // Convert from "B.1.1" to a numeric ID
  const endId = req.query.endId;
  const isBarrierFree = req.query.isBarrierFree;
  const extrastops = req.query.extrastops; 
  try {
      console.log(startId, endId, isBarrierFree, extrastops)
      const path = routeCalculator.astar(startId, endId, isBarrierFree, extrastops); // Use numeric IDs for A* algorithm
      res.json({path});
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});

app.post('/saveRoute', (req, res) => {
  const { startId, endId, isBarrierFree, extrastops } = req.body;
  const newRoute = { startId, endId, isBarrierFree, extrastops };

  try {
    // Lesen des vorhandenen Cookies
    const existingRoutes = req.cookies.lastRoute ? JSON.parse(req.cookies.lastRoute) : [];
    
    // Hinzufügen der neuen Route zum Array
    existingRoutes.push(newRoute);

    // Aktualisieren des Cookies mit dem neuen Array von Routen
    res.cookie('lastRoute', JSON.stringify(existingRoutes), { maxAge: 86400000, httpOnly: true });
    res.json({ message: 'Route gespeichert' });
  } catch (error) {
    console.error('Fehler beim Speichern der Route:', error);
    res.status(500).json({ error: 'Fehler beim Speichern der Route' });
  }
});

app.get('/getLastRoute', (req, res) => {
  try {
      const lastRoutes = req.cookies.lastRoute;
      console.log(lastRoutes)
      if (!lastRoutes) {
          return res.status(404).json({ message: 'Keine gespeicherten Routen gefunden' });
      }

      const routes = JSON.parse(lastRoutes);
      res.json(routes);
  } catch (error) {
      console.error('Fehler beim Abrufen der letzten Routen:', error);
      res.status(500).json({ error: 'Serverfehler beim Abrufen der letzten Routen' });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


