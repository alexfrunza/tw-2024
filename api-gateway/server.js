const http = require('http');
const url = require('url');
const httpProxy = require('http-proxy');

const PORT = 8000; // port pentru gateway

const proxy = httpProxy.createProxyServer({});

const AUTH_BACKEND = 'http://localhost:5000';
const ACTORS_BACKEND = 'http://localhost:5001';

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

    if (
        pathname === '/login' ||
        pathname === '/register' ||
        pathname.startsWith('/user')
    ) {
        proxy.web(req, res, { target: AUTH_BACKEND });
    } else if (pathname.startsWith('/actors')) {
        proxy.web(req, res, { target: ACTORS_BACKEND });
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
});
