import {pool} from "../db.js";
import {UnauthorizedError, NotFoundError} from "../utils/errors.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = 'secret_key';

export const updateUser = async (req, res) => {
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

    const user = req.body;

    if (user.password && user.password.trim() !== '') {
        const result = await pool.query('SELECT password FROM "user" WHERE id = $1', [userId]);
        const currentPassword = result.rows[0].password;

        if (!bcrypt.compareSync(user.oldPassword, currentPassword)) {
            throw new UnauthorizedError('Current password is incorrect');
        }

        user.password = bcrypt.hashSync(user.password, 8);
    }

    let query = 'UPDATE "user" SET username = $1, email = $2, first_name = $3, last_name = $4';
    let values = [user.username, user.email, user.first_name, user.last_name];

    if (user.password && user.password.trim() !== '') {
        query += ', password = $5';
        console.log(user.password);
        const hashedPassword = bcrypt.hashSync(user.password, 8);
        values.push(hashedPassword);
        query += ' WHERE id = $6 RETURNING *';
        values.push(userId);
    } else {
        query += ' WHERE id = $5 RETURNING *';
        values.push(userId);
    }

    const result = await pool.query(query, values);
    const updatedUser = result.rows[0];

    if (!updatedUser) {
        throw new NotFoundError();
    }

    console.log(values);

    res.jsonBody = {
        message: 'success',
        data: [updatedUser]
    };
    res.statusCode = 200;
    req.handled = true;
}