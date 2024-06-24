import {NotFoundError} from "./errors.js";

export function validateFilePath(pathname, ext) {
    const IMAGE_EXT = ["png", "jpg", "gif", "ico", "svg", "webp", "scss", "map"];
    const VALID_EXT = ['js', 'css', ...IMAGE_EXT];

    const filePathSplit = pathname.split("/");

    if (!VALID_EXT.includes(ext) && !pathname.endsWith('.css.map')) {
        throw new NotFoundError("Page not found.");
    }

    if (ext === 'map' && filePathSplit[1] !== 'css') {
        throw new NotFoundError("Page not found.");
    }

    if (ext === 'scss' && filePathSplit[1] !== 'scss') {
        throw new NotFoundError("Page not found.");
    }

    if (ext === 'css' && filePathSplit[1] !== 'css') {
        throw new NotFoundError("Page not found.");
    }

    if (ext === 'js' && filePathSplit[1] !== 'js') {
        throw new NotFoundError("Page not found.");
    }

    if (IMAGE_EXT.includes(ext) && filePathSplit[1] !== 'img') {
        throw new NotFoundError("Page not found.");
    }
}