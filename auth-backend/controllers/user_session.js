import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {pool} from "../db.js";
import {InvalidPasswordError, UserNotFoundError} from "../utils/errors.js";

const SECRET_KEY = 'secret_key';

export const login = async (req, res) => {
    const {username, password} = req.body;
    const result = await pool.query('SELECT * FROM "user" WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
        throw new UserNotFoundError();
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
        throw new InvalidPasswordError();
    }

    const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: 86401});

    res.jsonBody = {
        auth: true,
        token
    }
    res.statusCode = 200;
    req.handled = true;
}