const jwt = require("jsonwebtoken");

const SECRET_KEY = 'secret_key';

export const verifyToken = (req, res, callback) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        res.writeHead(403, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'No token provided'}));
        return;
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({message: 'Failed to authenticate token'}));
            return;
        }

        req.userId = decoded.id;
        callback();
    });
};
