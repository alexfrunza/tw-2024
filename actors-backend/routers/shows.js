import {verifyToken} from "../utils/authentication.js";
import {createShow, deleteShow, getShow, getShows, modifyShow} from "../controllers/shows.js";

export const showsRouter = async (req, res) => {
    req.handled = true;

    let regexRouteWithId = /^\/(\d+)$/;

    if (req.fullUrl.pathname === '/' && req.method === 'GET') {
        console.log("GET /shows");
        await getShows(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'GET') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`GET /shows/${id}`);
        await getShow(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'DELETE') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`DELETE /shows/${id}`);
        verifyToken(req);
        await deleteShow(req, res);
    } else if (req.fullUrl.pathname === '/' && req.method === 'POST') {
        console.log("POST /shows");
        verifyToken(req);
        await createShow(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'PUT') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`PUT /shows/${id}`);
        verifyToken(req);
        await modifyShow(req, res);
    } else {
        req.handled = false;
    }
};


