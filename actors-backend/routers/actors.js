import {verifyAdmin, verifyToken} from "../utils/authentication.js";
import {createActor, deleteActor, getActor, getActors, modifyActor} from "../controllers/actors.js";

export const actorsRouter = async (req, res) => {
    req.handled = true;

    let regexRouteWithId = /^\/(\d+)$/;

    if (req.fullUrl.pathname === '/' && req.method === 'GET') {
        console.log("GET /actors");
        await getActors(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'GET') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`GET /actors/${id}`);
        await getActor(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'DELETE') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`DELETE /actors/${id}`);
        verifyToken(req);
        verifyAdmin(req);
        await deleteActor(req, res);
    } else if (req.fullUrl.pathname === '/' && req.method === 'POST') {
        console.log("POST /actors");
        verifyToken(req);
        verifyAdmin(req);
        await createActor(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'PUT') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`PUT /actors/${id}`);
        verifyToken(req);
        verifyAdmin(req);
        await modifyActor(req, res);
    } else {
        req.handled = false;
    }
};


