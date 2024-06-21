import {createUser} from "../controllers/users.js";
import {getUser} from "../controllers/getUser.js";
import {updateUser} from "../controllers/updateUser.js";

export const usersRouter = async (req, res) => {
    req.handled = true;

    if (req.fullUrl.pathname === '/users' && req.method === 'GET') {
        req.handled = false;
        //
    } else if (req.fullUrl.pathname.startsWith('/') && req.method === 'GET') {
        console.log("GET /users/id");
        await getUser(req, res);
    } else if (req.fullUrl.pathname === '/' && req.method === 'POST') {
        console.log("POST /users");
        await createUser(req, res);
    } else if (req.fullUrl.pathname.startsWith('/') && req.method === 'PUT') {
        console.log("PUT /users/id");
        await updateUser(req, res);
    } else if (req.fullUrl.pathname.startsWith('/users/') && req.method === 'DELETE') {
        req.handled = false;
        //
    } else {
        req.handled = false;
    }
};