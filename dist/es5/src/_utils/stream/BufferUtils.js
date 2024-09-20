"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferToStream = bufferToStream;
exports.streamToBufferPromise_READABLE = streamToBufferPromise_READABLE;
exports.streamToBufferPromise = streamToBufferPromise;
var tslib_1 = require("tslib");
var BufferReadableStream_1 = require("./BufferReadableStream");
function bufferToStream(buffer) {
    return new BufferReadableStream_1.BufferReadableStream(buffer);
}
function streamToBufferPromise_READABLE(readStream) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var buffers = [];
                    var cleanup = function () {
                        readStream.removeListener("readable", handleReadable);
                        readStream.removeListener("error", handleError);
                    };
                    var handleError = function (e) {
                        console.log(e);
                        cleanup();
                        reject(e);
                    };
                    readStream.on("error", handleError);
                    var handleReadable = function () {
                        var chunk;
                        do {
                            chunk = readStream.read();
                            if (chunk) {
                                buffers.push(chunk);
                            }
                        } while (chunk);
                        finish();
                    };
                    readStream.on("readable", handleReadable);
                    var finished = false;
                    var finish = function () {
                        if (finished) {
                            return;
                        }
                        finished = true;
                        cleanup();
                        resolve(Buffer.concat(buffers));
                    };
                })];
        });
    });
}
function streamToBufferPromise(readStream) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var buffers = [];
                    var cleanup = function () {
                        readStream.removeListener("data", handleData);
                        readStream.removeListener("error", handleError);
                        readStream.removeListener("end", handleEnd);
                    };
                    var handleError = function (e) {
                        console.log(e);
                        cleanup();
                        reject(e);
                    };
                    readStream.on("error", handleError);
                    var handleData = function (data) {
                        buffers.push(data);
                    };
                    readStream.on("data", handleData);
                    var handleEnd = function () {
                        cleanup();
                        resolve(Buffer.concat(buffers));
                    };
                    readStream.on("end", handleEnd);
                })];
        });
    });
}
//# sourceMappingURL=BufferUtils.js.map