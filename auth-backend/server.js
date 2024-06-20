const http = require('http');
const url = require('url');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const usersRouter = require('./routers/users');

const SECRET_KEY = 'secret_key';
const PORT = 5000;

// dummy, de luat din database
const users = [
    {
        id: 1,
        username: 'user1',
        password: bcrypt.hashSync('password1', 8)
    }
];

const requestHandler = (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
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

    if (pathname.startsWith('/users')) {
        usersRouter(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Auth backend running on http://localhost:${PORT}`);
});
