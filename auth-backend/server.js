import * as http from "node:http";
import {mainRouter} from "./routers/index.js";

const PORT = 5000;

const server = http.createServer(mainRouter);

server.listen(PORT, () => {
    console.log(`Auth backend running on http://localhost:${PORT}`);
});
