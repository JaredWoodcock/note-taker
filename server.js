const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');


const app = express();
const PORT = process.env.PORT || 3001;
const dbFilePath = path.join(__dirname, 'db', 'db.json');


app.use(express.json());
app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')) || [];
    res.json(notes);
});


app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});


app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    let notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')) || [];

    newNote.id = uuidv4();

    notes.push(newNote);
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));

    res.json(newNote);
    console.log('Note created successfully:', newNote);
});


app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    let notes = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8')) || [];
    const deletedNote = notes.find((note) => note.id === noteId);
    notes = notes.filter((note) => note.id !== noteId);
    fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
    res.json({ message: 'Note deleted successfully', deletedNote });
    console.log('Note deleted successfully:', deletedNote);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});