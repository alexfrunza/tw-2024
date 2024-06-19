const http = require('http');
const url = require('url');
const jwt = require('jsonwebtoken');
const {mainRouter} = require("./routers");

const PORT = 5001;

const server = http.createServer(mainRouter);

server.listen(PORT, () => {
    console.log(`Actors backend running on http://127.0.0.1:${PORT}`);
});
