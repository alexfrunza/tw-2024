import * as jwt from 'jsonwebtoken';
import {UnauthorizedError} from "./errors.js";

const SECRET_KEY = 'secret_key';

export const verifyToken = (req, res) => {
    const authHeader = req.headers['Authorization'];

    if (!authHeader) {
        throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.substring("Bearer ".length);

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            throw new UnauthorizedError("Failed to authenticate token");
        }

        req.jwtPayload = decoded;
    });
};
