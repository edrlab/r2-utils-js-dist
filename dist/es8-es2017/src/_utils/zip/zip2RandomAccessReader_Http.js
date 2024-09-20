"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpZipReader = void 0;
const debug_ = require("debug");
const request = require("request");
const stream_1 = require("stream");
const yauzl = require("yauzl");
const BufferUtils_1 = require("../stream/BufferUtils");
const debug = debug_("r2:utils#zip/zip2RandomAccessReader_Http");
class HttpZipReader extends yauzl.RandomAccessReader {
    constructor(url, byteLength) {
        super();
        this.url = url;
        this.byteLength = byteLength;
        this.firstBuffer = undefined;
        this.firstBufferStart = 0;
        this.firstBufferEnd = 0;
    }
    _readStreamForRange(start, end) {
        if (this.firstBuffer && start >= this.firstBufferStart && end <= this.firstBufferEnd) {
            const begin = start - this.firstBufferStart;
            const stop = end - this.firstBufferStart;
            return (0, BufferUtils_1.bufferToStream)(this.firstBuffer.slice(begin, stop));
        }
        const stream = new stream_1.PassThrough();
        const lastByteIndex = end - 1;
        const range = `${start}-${lastByteIndex}`;
        const failure = (err) => {
            debug(err);
        };
        const success = async (res) => {
            if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
                failure("HTTP CODE " + res.statusCode);
                return;
            }
            if (this.firstBuffer) {
                res.pipe(stream);
            }
            else {
                let buffer;
                try {
                    buffer = await (0, BufferUtils_1.streamToBufferPromise)(res);
                }
                catch (err) {
                    debug(err);
                    stream.end();
                    return;
                }
                debug(`streamToBufferPromise: ${buffer.length}`);
                this.firstBuffer = buffer;
                this.firstBufferStart = start;
                this.firstBufferEnd = end;
                stream.write(buffer);
                stream.end();
            }
        };
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
        return stream;
    }
}
exports.HttpZipReader = HttpZipReader;
//# sourceMappingURL=zip2RandomAccessReader_Http.js.map