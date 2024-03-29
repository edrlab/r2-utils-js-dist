"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpReadableStream = void 0;
const tslib_1 = require("tslib");
const debug_ = require("debug");
const request = require("request");
const requestPromise = require("request-promise-native");
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
        const success = (res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
                failure("HTTP CODE " + res.statusCode);
                return;
            }
            let buffer;
            try {
                buffer = yield (0, BufferUtils_1.streamToBufferPromise)(res);
            }
            catch (err) {
                failure(err);
                return;
            }
            this.alreadyRead += buffer.length;
            this.push(buffer);
        });
        debug(`HTTP GET ${this.url}: ${this.byteStart}-${this.byteEnd} (${this.byteEnd - this.byteStart})`);
        const lastByteIndex = this.byteEnd - 1;
        const range = `${this.byteStart}-${lastByteIndex}`;
        const needsStreamingResponse = true;
        if (needsStreamingResponse) {
            request.get({
                headers: { Range: `bytes=${range}` },
                method: "GET",
                uri: this.url,
            })
                .on("response", (res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                try {
                    yield success(res);
                }
                catch (successError) {
                    failure(successError);
                    return;
                }
            }))
                .on("error", failure);
        }
        else {
            (() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                let res;
                try {
                    res = yield requestPromise({
                        headers: { Range: `bytes=${range}` },
                        method: "GET",
                        resolveWithFullResponse: true,
                        uri: this.url,
                    });
                }
                catch (err) {
                    failure(err);
                    return;
                }
                yield success(res);
            }))();
        }
    }
}
exports.HttpReadableStream = HttpReadableStream;
//# sourceMappingURL=HttpReadableStream.js.map