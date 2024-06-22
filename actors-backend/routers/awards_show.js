import {verifyToken} from "../utils/authentication.js";
import {
    createAwardShow,
    deleteAwardShow,
    getAwardShow,
    getAwardsShow,
    modifyAwardShow
} from "../controllers/awards_show.js";

export const awardsShowRouter = async (req, res) => {
    req.handled = true;

    let regexRouteWithId = /^\/(\d+)$/;

    if (req.fullUrl.pathname === '/' && req.method === 'GET') {
        console.log("GET /awardsShow");
        await getAwardsShow(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'GET') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`GET /awardsShow/${id}`);
        await getAwardShow(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'DELETE') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`DELETE /awardsShow/${id}`);
        verifyToken(req);
        await deleteAwardShow(req, res);
    } else if (req.fullUrl.pathname === '/' && req.method === 'POST') {
        console.log("POST /awardsShow");
        verifyToken(req);
        await createAwardShow(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'PUT') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`PUT /awardsShow/${id}`);
        verifyToken(req);
        await modifyAwardShow(req, res);
    } else {
        req.handled = false;
    }
};


