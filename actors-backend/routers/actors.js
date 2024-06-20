import url from "url";
import {verifyToken} from "../utils/authentication.js";

// dummy, de luat din database
const actors = [
    {id: 1, name: 'Robert Downey Jr.', age: 56, movies: ['Iron Man', 'Sherlock Holmes']},
    {id: 2, name: 'Chris Hemsworth', age: 38, movies: ['Thor', 'Extraction']}
];

export const actorsRouter = async (req, res) => {
    req.handled = true;

    if (req.fullUrl.pathname === '/' && req.method === 'GET') {
        console.log("GET /actors");
        // verifyToken(req);

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(actors));
    } else {
        req.handled = false;
    }
};


