import {createUser} from "../controllers/users.js";

export const usersRouter = async (req, res) => {
    req.handled = true;

    if (req.fullUrl.pathname === '/users' && req.method === 'GET') {
        req.handled = false;
        //
    } else if (req.fullUrl.pathname.startsWith('/users/') && req.method === 'GET') {
        req.handled = false;
        // a single user
    } else if (req.fullUrl.pathname === '/' && req.method === 'POST') {
        console.log("POST /users");
        await createUser(req, res);
    } else if (req.fullUrl.pathname.startsWith('/users/') && req.method === 'PUT') {
        req.handled = false;
        //
    } else if (req.fullUrl.pathname.startsWith('/users/') && req.method === 'DELETE') {
        req.handled = false;
        //
    } else {
        req.handled = false;
    }
};