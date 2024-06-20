const url = require('url');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// dummy, de luat din database
const users = [
    {
        id: 1,
        username: 'user1',
        password: bcrypt.hashSync('password1', 8)
    }
];

const SECRET_KEY = 'secret_key';

const usersRouter = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const { pathname } = parsedUrl;

    if (pathname === '/users' && req.method === 'GET') {
        //
    } else if (pathname.startsWith('/users/') && req.method === 'GET') {
        // a single user
    } else if (pathname === '/users' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const { username, email, firstname, lastname, password } = JSON.parse(body);

            const hashedPassword = bcrypt.hashSync(password, 8);

            const result = await pool.query('INSERT INTO "user" (username, email, first_name, last_name, password) VALUES ($1, $2, $3, $4, $5) RETURNING id', [username, email, firstname, lastname, hashedPassword]);

            const user = result.rows[0];

            const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ auth: true, token }));
        });
    } else if (pathname.startsWith('/users/') && req.method === 'PUT') {
        //
    } else if (pathname.startsWith('/users/') && req.method === 'DELETE') {
        //
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
};

module.exports = usersRouter;