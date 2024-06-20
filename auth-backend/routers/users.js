import {pool} from "../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = 'secret_key';

export const usersRouter = async (req, res) => {

    if (req.fullUrl.pathname === '/users' && req.method === 'GET') {
        //
    } else if (req.fullUrl.pathname.startsWith('/users/') && req.method === 'GET') {
        // a single user
    } else if (req.fullUrl.pathname === '/' && req.method === 'POST') {
        const {username, email, firstName, lastName, password} = req.body;

        const hashedPassword = bcrypt.hashSync(password, 8);

        console.log(lastName, firstName);

        const result = await pool.query('INSERT INTO "user" (username, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5) RETURNING id', [username, email, firstName, lastName, hashedPassword]);

        const user = result.rows[0];
        console.log(user);

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: 86400});

        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({auth: true, token}));
    } else if (req.fullUrl.pathname.startsWith('/users/') && req.method === 'PUT') {
        //
    } else if (req.fullUrl.pathname.startsWith('/users/') && req.method === 'DELETE') {
        //
    } else {
        req.handled = false;
    }
};