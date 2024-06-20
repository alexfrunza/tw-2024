import {APIError, NotFoundError, ServerError} from "../utils/errors.js";
import {login} from "../controllers/user_session.js";

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

        res.jsonBody = null;
        req.handled = false;
        req.fullUrl = new URL(req.url, `http://${req.headers.host}`);

        let body = [];
        req.on('data', chunk => {
            body.push(chunk);
        });

        await new Promise((resolve, reject) => {
            req.on('end', () => {
                let parsedBody;

                if (req.headers['content-type'] === 'application/json') {
                    parsedBody = JSON.parse(Buffer.concat(body).toString());
                } else if (req.headers['content-type'] === 'application/x-www-form-urlencoded') {
                    parsedBody = new URLSearchParams(Buffer.concat(body).toString());
                } else {
                    // Handle other content types as needed
                }
                // console.log(parsedBody);
                req.body = parsedBody;
                resolve();
            });
        });

        if (req.fullUrl.pathname === '/login' && req.method === 'POST') {
            req.fullUrl = new URL(req.url.substring('/login'.length), `http://${req.headers.host}`);
            await login(req, res);
        }

        if (!req.handled) {
            throw new NotFoundError("Not Found");
        }

        if (!res.jsonBody) {
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
