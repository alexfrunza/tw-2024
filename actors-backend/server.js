import * as http from "node:http";
import {mainRouter} from "./routers/index.js";

const PORT = 5001;

const server = http.createServer(mainRouter);

server.listen(PORT, () => {
    console.log(`Actors backend running on http://127.0.0.1:${PORT}`);
});
