import {verifyAdmin, verifyToken} from "../utils/authentication.js";
import {
    createAwardActor,
    deleteAwardActor,
    getAwardActor, getAwardsActor,
    modifyAwardActor
} from "../controllers/awards_actor.js";

export const awardsActorRouter = async (req, res) => {
    req.handled = true;

    let regexRouteWithId = /^\/(\d+)$/;

    if (req.fullUrl.pathname === '/' && req.method === 'GET') {
        console.log("GET /awardsActor");
        await getAwardsActor(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'GET') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`GET /awardsActor/${id}`);
        await getAwardActor(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'DELETE') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`DELETE /awardsActor/${id}`);
        verifyToken(req);
        verifyAdmin(req);
        await deleteAwardActor(req, res);
    } else if (req.fullUrl.pathname === '/' && req.method === 'POST') {
        console.log("POST /awardsActor");
        verifyToken(req);
        verifyAdmin(req);
        await createAwardActor(req, res);
    } else if (regexRouteWithId.test(req.fullUrl.pathname) && req.method === 'PUT') {
        let id = parseInt(req.fullUrl.pathname.match(regexRouteWithId)[1], 10);
        req.params.id = id;
        console.log(`PUT /awardsActor/${id}`);
        verifyToken(req);
        verifyAdmin(req);
        await modifyAwardActor(req, res);
    } else {
        req.handled = false;
    }
};


