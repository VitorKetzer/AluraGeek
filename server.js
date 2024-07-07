const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;


app.use(express.json());


let mangas = [];


app.get('/mangas', (req, res) => {
    res.json(mangas);
});


app.post('/mangas', (req, res) => {
    const { title, price, imageUrl } = req.body;
    const newManga = { id: generateId(), title, price, imageUrl };
    mangas.push(newManga);
    res.status(201).json(newManga);
});


app.delete('/mangas/:id', (req, res) => {
    const { id } = req.params;
    mangas = mangas.filter(manga => manga.id !== id);
    res.status(200).json({ message: `Mangá com ID ${id} removido.` });
});


function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});