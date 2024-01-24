"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToBufferPromise = exports.streamToBufferPromise_READABLE = exports.bufferToStream = void 0;
const BufferReadableStream_1 = require("./BufferReadableStream");
function bufferToStream(buffer) {
    return new BufferReadableStream_1.BufferReadableStream(buffer);
}
exports.bufferToStream = bufferToStream;
async function streamToBufferPromise_READABLE(readStream) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        const cleanup = () => {
            readStream.removeListener("readable", handleReadable);
            readStream.removeListener("error", handleError);
        };
        const handleError = (e) => {
            console.log(e);
            cleanup();
            reject(e);
        };
        readStream.on("error", handleError);
        const handleReadable = () => {
            let chunk;
            do {
                chunk = readStream.read();
                if (chunk) {
                    buffers.push(chunk);
                }
            } while (chunk);
            finish();
        };
        readStream.on("readable", handleReadable);
        let finished = false;
        const finish = () => {
            if (finished) {
                return;
            }
            finished = true;
            cleanup();
            resolve(Buffer.concat(buffers));
        };
    });
}
exports.streamToBufferPromise_READABLE = streamToBufferPromise_READABLE;
async function streamToBufferPromise(readStream) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        const cleanup = () => {
            readStream.removeListener("data", handleData);
            readStream.removeListener("error", handleError);
            readStream.removeListener("end", handleEnd);
        };
        const handleError = (e) => {
            console.log(e);
            cleanup();
            reject(e);
        };
        readStream.on("error", handleError);
        const handleData = (data) => {
            buffers.push(data);
        };
        readStream.on("data", handleData);
        const handleEnd = () => {
            cleanup();
            resolve(Buffer.concat(buffers));
        };
        readStream.on("end", handleEnd);
    });
}
exports.streamToBufferPromise = streamToBufferPromise;
//# sourceMappingURL=BufferUtils.js.map