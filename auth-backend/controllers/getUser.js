import jwt from "jsonwebtoken";
import {pool} from "../db.js";
import {NotFoundError, UnauthorizedError} from "../utils/errors.js";

const SECRET_KEY = 'secret_key';

export const getUser = async (req, res) => {
    const token = req.headers['x-access-token'];
    if (!token) {
        throw new UnauthorizedError();
    }

    let userId;
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            throw new UnauthorizedError();
        }
        userId = decoded.id;
    });

    console.log(`Fetching user with ID: ${userId}`);

    const result = await pool.query('SELECT * FROM "user" WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) {
        throw new NotFoundError();
    }

    res.jsonBody = {
        message: 'success',
        data: [user]
    };
    res.statusCode = 200;
    req.handled = true;
}