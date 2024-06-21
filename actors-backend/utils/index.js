import stream from "stream";

export function createStringStream(str) {
    return new stream.Readable({
        read(size) {
            this.push(str);
            this.push(null);
        }
    });
}