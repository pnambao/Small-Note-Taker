//Getting all the packages and stuff we need
const express = require('express');
const path = require('path');
const { uuid } = require('uuid');
const fs = require("fs");
const util = require("util");
const writeFile = util.promisify(fs.writeFile);
const db = require('./db.json');

// Setting up the express app and the port
const app = express();
const PORT = process.env.PORT || 3005;
 
// Sets up the Express app to handle data parsing (this is the middleware)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'))
// app.use('/assets', express.static('public/assets'))

// Routes

// Basic route that sends the user first to the AJAX Page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, '/public/notes.html')));

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => res.json(db));

// Receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuid();
    db.push(newNote);
    res.json(newNote);
    writeFile('db.json', JSON.stringify(db));
});

app.delete(`/api/notes/:id`, (req, res) => {
    const chosen = req.params.id;
    for (note of db) {
        if (chosen === note.id) {
            db.splice(note, 1);
            writeFile('db.json', JSON.stringify(db));
            res.json(db);
        };
    };
});
//listens when the server starts running.
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);
