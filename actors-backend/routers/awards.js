import {verifyAdmin, verifyToken} from "../utils/authentication.js";
import {createAward, deleteAward, getAward, getAwards, modifyAward} from "../controllers/awards.js";

export const awardsRouter = async (req, res) => {
    req.handled = true;

    let regexRouteWithId = /^\/(\d+)$/;

    if (req.fullUrl.pathname === '/' && req.method === 'GET') {
        console.log("GET /awards");
        await getAwards(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'GET') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`GET /awards/${id}`);
        await getAward(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'DELETE') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`DELETE /awards/${id}`);
        verifyToken(req);
        verifyAdmin(req);
        await deleteAward(req, res);
    } else if (req.fullUrl.pathname === '/' && req.method === 'POST') {
        console.log("POST /awards");
        verifyToken(req);
        verifyAdmin(req);
        await createAward(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'PUT') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`PUT /awards/${id}`);
        verifyToken(req);
        verifyAdmin(req);
        await modifyAward(req, res);
    } else {
        req.handled = false;
    }
};


