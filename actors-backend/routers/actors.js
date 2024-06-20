import url from "url";
import {verifyToken} from "../utils/authentication.js";
import {getActors} from "../controllers/actors.js";


export const actorsRouter = async (req, res) => {
    req.handled = true;

    if (req.fullUrl.pathname === '/' && req.method === 'GET') {
        console.log("GET /actors");
        verifyToken(req);
        await getActors(req, res);
    } else {
        req.handled = false;
    }
};


