import url from "url";
import {verifyToken} from "../utils/authentication.js";
import {actorsRouter} from "./actors.js";
import {APIError, NotFoundError, ServerError} from "../utils/errors.js";

// dummy, de luat din database
const actors = [
    {id: 1, name: 'Robert Downey Jr.', age: 56, movies: ['Iron Man', 'Sherlock Holmes']},
    {id: 2, name: 'Chris Hemsworth', age: 38, movies: ['Thor', 'Extraction']}
];

export const mainRouter = async (req, res) => {
    try {
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

        req.handled = false;
        req.fullUrl = new URL(req.url, `http://${req.headers.host}`);

        const parsedUrl = url.parse(req.url, true);
        const {pathname} = parsedUrl;

        if (req.fullUrl.pathname.startsWith('/actors')) {
            req.fullUrl = new URL(req.url.substring('/actors'.length), `http://${req.headers.host}`);
            await actorsRouter(req, res);
        } else if (req.fullUrl.pathname.startsWith('/awards')) {
            console.log("Not implemented");
        }

        if (!req.handled) {
            throw new NotFoundError("Not Found");
        }

        if (!res.jsonBody) {
            console.log(res);
            throw new ServerError("Internal server error");
        }

        res.setHeader('Content-Type', 'application/json');
        res.writeHead(res.statusCode);
        res.end(JSON.stringify(res.jsonBody));
    } catch (err) {
        if (err instanceof APIError) {
            res.writeHead(err.statusCode, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                errors: [{
                    message: err.message, name: err.name
                }]
            }));
        } else {
            console.error(err);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                errors: [{
                    message: "Internal server error", name: 'UnknownError'
                }]
            }));
        }
    }
};


