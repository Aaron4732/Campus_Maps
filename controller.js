const express = require('express');
const session = require('express-session');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = 3000;
const MapNode = require('./mapnode');
// const SessionHandler = require('./sessionhandler');
// const Session = require('./session');


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


app.get('/getRoute', (req, res) => {
  //res.send('route');
  //logik für berechnung mittels A* evt. outsourcen in anderes file (?)
  res.json({ message: 'route von a nach b' });

});

app.get('/initialize', (req, res) => {
  //res.send('standardmap');
  res.json({ message: 'init -> standardmap' }); 

});

// app.get('/setSession', (req, res) => {
//   SessionHandler.startSession(req, 'Test');
//   res.send('set session');
// });


app.get('/getJsonData', (req, res) => {
  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Fehler beim Lesen der Datei');
    } else {
      res.json( JSON.parse(data));
    }
  });
});

 // random letters a-f and random numbers 1-9
 app.get('/createNode', (req, res) => {
  const randomLetter = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F in ascii
  const randomNumber = Math.floor(Math.random() * 9) + 1; // 1-9
  const randomLettertmp = randomLetter + randomLetter;
  const newNode = new MapNode(randomLettertmp, randomNumber, null);
  res.json({ nodeId: newNode.id });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


