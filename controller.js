const express = require('express');
const session = require('express-session');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const MapNode = require('./mapnode');
const routeCalculator = require('./routecalculator.js');

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
const mapNodes = {};
const filePath = path.join(__dirname, '..', 'Campus_Maps', 'Editor', 'circles.json');

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
    }
    try {
      const jsonData = JSON.parse(data);

      for (const key in jsonData) {
          mapNodes[key] = new MapNode(jsonData[key]);
      }

    } catch (parseErr) {
        console.error('Error parsing JSON:', parseErr);
    }
});


app.get('/initialize', (req, res) => {
  // const filePath = path.join(__dirname, '..', 'Campus_Maps', 'Editor', 'circles.json');
  
  // fs.readFile(filePath, 'utf8', (err, data) => {
  //     if (err) {
  //         console.error('Error reading file:', err);
  //         return res.status(500).send('Fehler beim Lesen der Datei');
  //     }
      
  //     try {
  //       const jsonData = JSON.parse(data);
  //       const mapNodes = {};

  //       for (const key in jsonData) {
  //           mapNodes[key] = new MapNode(jsonData[key]);
  //       }

  //       //routeCalculator.setNodes(jsonData); // Nehmen wir an, du hast eine Funktion, die die Nodes setzt
  //     } catch (parseErr) {
  //         console.error('Error parsing JSON:', parseErr);
  //         res.status(500).send('Invalid JSON format');
  //     }
  // });
});

//make /initalize read only delta

app.get('/calculateRoute', (req, res) => {
  const start_name = req.query.startId; 
  const end_name = req.query.endId;
  const isBarrierFree = req.query.isBarrierFree;
  const extrastops = req.query.extrastops; 
  try {
      console.log("test: " + start_name, end_name, isBarrierFree, extrastops)
      let calc = new routeCalculator.queue(mapNodes, start_name, end_name);
      let path = calc.find_solution();
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
      console.log("last route: " + lastRoutes)
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


