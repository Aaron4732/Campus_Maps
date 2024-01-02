const express = require('express');
const session = require('express-session');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const MapNode = require('./mapnode');
const { convertToNumericId, convertToFormattedId, aStar, loadNodes } = require('./routecalculator');
const nodes = loadNodes();

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

        res.json(mapNodes);
      } catch (parseErr) {
          console.error('Error parsing JSON:', parseErr);
          res.status(500).send('Invalid JSON format');
      }
  });
});

app.get('/calculateRoute', (req, res) => {
  const startId = convertToNumericId(req.query.startId);  // Convert from "B.1.1" to a numeric ID
  const endId = convertToNumericId(req.query.endId);
  try {
      console.log("Es kommt hier hin");
      console.log(startId, endId)
      //hier crash
      const path = aStar(startId, endId, nodes); // Use numeric IDs for A* algorithm
      const formattedPath = path.map(convertToFormattedId); // Convert back to formatted IDs for frontend
      res.json({ path: formattedPath });
      console.log("Es kommt hier hin 22")
      
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
  }
});

app.post('/saveRoute', (req, res) => {
  const { startId, endId } = req.body;
  const route = { startId, endId };

  // Cookie setzen
  res.cookie('lastRoute', JSON.stringify(route), { maxAge: 86400000, httpOnly: true });
  console.log("ROUTE SPEICHERN")
  res.json({ message: 'Route gespeichert' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


