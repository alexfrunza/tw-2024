const http = require('http');
const url = require('url');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'secret_key';
const PORT = 5001;

// dummy, de luat din database
const actors = [
    { id: 1, name: 'Robert Downey Jr.', age: 56, movies: ['Iron Man', 'Sherlock Holmes'] },
    { id: 2, name: 'Chris Hemsworth', age: 38, movies: ['Thor', 'Extraction'] }
];

const verifyToken = (req, res, callback) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'No token provided' }));
        return;
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Failed to authenticate token' }));
            return;
        }

        req.userId = decoded.id;
        callback();
    });
};

const requestHandler = (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-access-token');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === '/actors' && req.method === 'GET') {
        verifyToken(req, res, () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(actors));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Actors backend running on http://localhost:${PORT}`);
});
