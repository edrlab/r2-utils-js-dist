"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpReadableStream = void 0;
const debug_ = require("debug");
const request = require("request");
const stream_1 = require("stream");
const BufferUtils_1 = require("../stream/BufferUtils");
const debug = debug_("r2:utils#http/HttpReadableStream");
class HttpReadableStream extends stream_1.Readable {
    constructor(url, byteLength, byteStart, byteEnd) {
        super();
        this.url = url;
        this.byteLength = byteLength;
        this.byteStart = byteStart;
        this.byteEnd = byteEnd;
        this.alreadyRead = 0;
    }
    _read(_size) {
        const length = this.byteEnd - this.byteStart;
        if (this.alreadyRead >= length) {
            this.push(null);
            return;
        }
        const failure = (err) => {
            debug(err);
            this.push(null);
        };
        const success = async (res) => {
            if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
                failure("HTTP CODE " + res.statusCode);
                return;
            }
            let buffer;
            try {
                buffer = await (0, BufferUtils_1.streamToBufferPromise)(res);
            }
            catch (err) {
                failure(err);
                return;
            }
            this.alreadyRead += buffer.length;
            this.push(buffer);
        };
        debug(`HTTP GET ${this.url}: ${this.byteStart}-${this.byteEnd} (${this.byteEnd - this.byteStart})`);
        const lastByteIndex = this.byteEnd - 1;
        const range = `${this.byteStart}-${lastByteIndex}`;
        request.get({
            headers: { Range: `bytes=${range}` },
            method: "GET",
            uri: this.url,
        })
            .on("response", async (res) => {
            try {
                await success(res);
            }
            catch (successError) {
                failure(successError);
                return;
            }
        })
            .on("error", failure);
    }
}
exports.HttpReadableStream = HttpReadableStream;
//# sourceMappingURL=HttpReadableStream.js.map