// Importing required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


// Created an express application
const app = express();
// Setting the port for the server to run on
const PORT = process.env.PORT || 3001;
// Defining the file path for the database
const dbFilePath = path.join(__dirname, 'db', 'db.json');


// Middleware to parse the JSON data in the request body
app.use(express.json());
// Middleware to serve static files from the public directory
app.use(express.static('public'));


// Route to get all of the notes from the database
app.get('/api/notes', (req, res) => {
    // Gets the existing notes, or starts it as an empty array
    const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')) || [];
    res.json(notes);
});


// Route to serve the notes.html
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


// Route to serve the index.html
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Route to handle the creation of a new note
app.post('/api/notes', (req, res) => {
    // Extracts the new note from the request body
    const newNote = req.body;
    let notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')) || [];
    // Assigns a unique ID to the new note
    newNote.id = uuidv4();
    // Adds the new note to the array of notes
    notes.push(newNote);
    // Writes the updated notes array back to the db file
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
    // Respond with the new note in JSON format and log it
    res.json(newNote);
    console.log('Note created successfully:', newNote);
});


// Route to handle deleting notes
app.delete('/api/notes/:id', (req, res) => {
    // Extracts the note ID
    const noteId = req.params.id;
    let notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')) || [];
    // Finds the note to be deleted and filters it out from the rest
    const deletedNote = notes.find((note) => note.id === noteId);
    notes = notes.filter((note) => note.id !== noteId);
    // Writes the updated notes array back to the db file and logs a success message
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
    res.json({ message: 'Note deleted successfully', deletedNote });
    console.log('Note deleted successfully:', deletedNote);
});


// Starts the server on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});