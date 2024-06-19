import url from "url";
import {verifyToken} from "../utils/authentication.js";

// dummy, de luat din database
const actors = [
    {id: 1, name: 'Robert Downey Jr.', age: 56, movies: ['Iron Man', 'Sherlock Holmes']},
    {id: 2, name: 'Chris Hemsworth', age: 38, movies: ['Thor', 'Extraction']}
];

export const mainRouter = async (req, res) => {
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

    req.fullUrl = new URL(req.url, `http://${req.headers.host}`);

    const parsedUrl = url.parse(req.url, true);
    const {pathname} = parsedUrl;

    if(req.fullUrl.pathname.startsWith('/actors')) {
        console.log("Not implemented");
    } else if (req.fullUrl.pathname.startsWith('/awards')) {
        console.log("Not implemented");
    } else {
        console.log("Not implemented");
    }

    if (pathname === '/actors' && req.method === 'GET') {
        verifyToken(req, res, () => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(actors));
        });
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'Not Found'}));
    }
};


