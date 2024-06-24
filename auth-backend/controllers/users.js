import bcrypt from "bcryptjs";
import {pool} from "../db.js";
import jwt from "jsonwebtoken";
import {validateRegisterInput} from "../utils/validations.js";

const SECRET_KEY = 'secret_key';

export const createUser = async (req, res) => {
    const {username, email, firstName, lastName, password} = req.body;

    const errors = validateRegisterInput(username, email, firstName, lastName, password);

    if (errors.length > 0) {
        res.jsonBody = {
            errors: errors
        }
        res.statusCode = 400;
        return;
    }

    const usernameCheck = await pool.query('SELECT * FROM "user" WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
        res.jsonBody = {
            errors: ['Username already in use.']
        }
        res.statusCode = 400;
        return;
    }

    const emailCheck = await pool.query('SELECT * FROM "user" WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
        res.jsonBody = {
            errors: ['Email already in use.']
        }
        res.statusCode = 400;
        return;
    }

    console.log(req.body)

    const hashedPassword = bcrypt.hashSync(password, 8);

    const result = await pool.query('INSERT INTO "user" (username, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5) RETURNING id', [username, email, firstName, lastName, hashedPassword]);

    const user = result.rows[0];

    const token = jwt.sign({id: user.id, admin: user.admin}, SECRET_KEY, {expiresIn: 86400});

    res.jsonBody = {
        auth: true,
        token
    }
    res.statusCode = 200;
}