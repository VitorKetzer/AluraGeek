const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const server = express();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(express.static(__dirname));

server.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.use(middlewares);

server.use('/api', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on port ${PORT}`);
});
