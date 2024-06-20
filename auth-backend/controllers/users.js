import bcrypt from "bcryptjs";
import {pool} from "../db.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = 'secret_key';

export const createUser = async (req, res) => {
    const {username, email, firstName, lastName, password} = req.body;
    console.log(req.body)

    const hashedPassword = bcrypt.hashSync(password, 8);

    const result = await pool.query('INSERT INTO "user" (username, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5) RETURNING id', [username, email, firstName, lastName, hashedPassword]);

    const user = result.rows[0];

    const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: 86400});

    res.jsonBody = {
        auth: true,
        token
    }
    res.statusCode = 200;
}