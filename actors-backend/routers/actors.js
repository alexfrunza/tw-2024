import {verifyToken} from "../utils/authentication.js";
import {deleteActor, getActor, getActors} from "../controllers/actors.js";

export const actorsRouter = async (req, res) => {
    req.handled = true;

    let regexRouteWithId = /^\/(\d+)$/;

    if (req.fullUrl.pathname === '/' && req.method === 'GET') {
        console.log("GET /actors");
        verifyToken(req);
        await getActors(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'GET') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`GET /actors/${id}`);
        verifyToken(req);
        await getActor(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'DELETE') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`DELETE /actors/${id}`);
        verifyToken(req);
        await deleteActor(req, res);
    } else {
        req.handled = false;
    }
};


