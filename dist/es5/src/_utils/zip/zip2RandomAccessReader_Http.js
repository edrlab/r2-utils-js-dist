"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpZipReader = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var request = require("request");
var stream_1 = require("stream");
var yauzl = require("yauzl");
var BufferUtils_1 = require("../stream/BufferUtils");
var debug = debug_("r2:utils#zip/zip2RandomAccessReader_Http");
var HttpZipReader = (function (_super) {
    tslib_1.__extends(HttpZipReader, _super);
    function HttpZipReader(url, byteLength) {
        var _this = _super.call(this) || this;
        _this.url = url;
        _this.byteLength = byteLength;
        _this.firstBuffer = undefined;
        _this.firstBufferStart = 0;
        _this.firstBufferEnd = 0;
        return _this;
    }
    HttpZipReader.prototype._readStreamForRange = function (start, end) {
        var _this = this;
        if (this.firstBuffer && start >= this.firstBufferStart && end <= this.firstBufferEnd) {
            var begin = start - this.firstBufferStart;
            var stop_1 = end - this.firstBufferStart;
            return (0, BufferUtils_1.bufferToStream)(this.firstBuffer.slice(begin, stop_1));
        }
        var stream = new stream_1.PassThrough();
        var lastByteIndex = end - 1;
        var range = "".concat(start, "-").concat(lastByteIndex);
        var failure = function (err) {
            debug(err);
        };
        var success = function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var buffer, err_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
                            failure("HTTP CODE " + res.statusCode);
                            return [2];
                        }
                        if (!this.firstBuffer) return [3, 1];
                        res.pipe(stream);
                        return [3, 6];
                    case 1:
                        buffer = void 0;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4, (0, BufferUtils_1.streamToBufferPromise)(res)];
                    case 3:
                        buffer = _a.sent();
                        return [3, 5];
                    case 4:
                        err_1 = _a.sent();
                        debug(err_1);
                        stream.end();
                        return [2];
                    case 5:
                        debug("streamToBufferPromise: ".concat(buffer.length));
                        this.firstBuffer = buffer;
                        this.firstBufferStart = start;
                        this.firstBufferEnd = end;
                        stream.write(buffer);
                        stream.end();
                        _a.label = 6;
                    case 6: return [2];
                }
            });
        }); };
        request.get({
            headers: { Range: "bytes=".concat(range) },
            method: "GET",
            uri: this.url,
        })
            .on("response", function (res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var successError_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, success(res)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        successError_1 = _a.sent();
                        failure(successError_1);
                        return [2];
                    case 3: return [2];
                }
            });
        }); })
            .on("error", failure);
        return stream;
    };
    return HttpZipReader;
}(yauzl.RandomAccessReader));
exports.HttpZipReader = HttpZipReader;
//# sourceMappingURL=zip2RandomAccessReader_Http.js.map