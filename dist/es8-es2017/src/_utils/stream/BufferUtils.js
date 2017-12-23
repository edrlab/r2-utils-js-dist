"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BufferReadableStream_1 = require("./BufferReadableStream");
function bufferToStream(buffer) {
    return new BufferReadableStream_1.BufferReadableStream(buffer);
}
exports.bufferToStream = bufferToStream;
async function streamToBufferPromise_READABLE(readStream) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        readStream.on("error", reject);
        readStream.on("readable", () => {
            let chunk;
            do {
                chunk = readStream.read();
                if (chunk) {
                    buffers.push(chunk);
                }
            } while (chunk);
        });
        readStream.on("end", () => {
            resolve(Buffer.concat(buffers));
        });
    });
}
exports.streamToBufferPromise_READABLE = streamToBufferPromise_READABLE;
async function streamToBufferPromise(readStream) {
    return new Promise((resolve, reject) => {
        const buffers = [];
        readStream.on("error", reject);
        readStream.on("data", (data) => {
            buffers.push(data);
        });
        readStream.on("end", () => {
            resolve(Buffer.concat(buffers));
        });
    });
}
exports.streamToBufferPromise = streamToBufferPromise;
//# sourceMappingURL=BufferUtils.js.map