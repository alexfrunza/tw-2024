import * as fs from "node:fs";
import * as http from "node:http";
import * as path from "node:path";
import {NotFoundError} from "./src/errors.js";
import {validateFilePath} from "./src/validations.js";

const PORT = 3000;

const MIME_TYPES = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
};

const DIR_PATH = process.cwd();

const toBool = [() => true, () => false];

const prepareFile = async (url) => {
        if (url.pathname === "/") {
            url.pathname = "/index.html";
        }

        const splitPath = url.pathname.split("/");

        if (!splitPath[splitPath.length - 1].includes(".")) {
            url.pathname += ".html";
        }

        const ext = path.extname(url.pathname).substring(1).toLowerCase();

        let filePath = DIR_PATH;

        if (ext === 'html') {
            filePath += "/pages" + url.pathname;
        } else {
            validateFilePath(url.pathname, ext);
            filePath = DIR_PATH + url.pathname;
        }

        const exists = await fs.promises.access(filePath).then(...toBool);
        if (!exists) throw new NotFoundError("Page not found.");

        const stream = fs.createReadStream(filePath);
        return {ext, stream};
    }
;

http
    .createServer(async (req, res) => {
        try {
            const url = new URL(req.url, `http://${req.headers.host}`);
            const file = await prepareFile(url);
            const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
            res.writeHead(200, {"Content-Type": mimeType});
            file.stream.pipe(res);
            console.log(`${req.method} ${req.url} ${200}`);
        } catch (err) {
            if (err instanceof NotFoundError) {
                res.writeHead(err.statusCode, {"Content-Type": MIME_TYPES.html});
                const notFoundPageStream = fs.createReadStream(DIR_PATH + "/pages/error404.html");
                notFoundPageStream.pipe(res);
            }
        }
    })
    .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);