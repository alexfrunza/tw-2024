import stream from "stream";

export function createStringStream(str) {
    return new stream.Readable({
        read(size) {
            this.push(str);
            this.push(null);
        }
    });
}

export function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}