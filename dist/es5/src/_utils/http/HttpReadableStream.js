"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpReadableStream = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var request = require("request");
var stream_1 = require("stream");
var BufferUtils_1 = require("../stream/BufferUtils");
var debug = debug_("r2:utils#http/HttpReadableStream");
var HttpReadableStream = (function (_super) {
    tslib_1.__extends(HttpReadableStream, _super);
    function HttpReadableStream(url, byteLength, byteStart, byteEnd) {
        var _this = _super.call(this) || this;
        _this.url = url;
        _this.byteLength = byteLength;
        _this.byteStart = byteStart;
        _this.byteEnd = byteEnd;
        _this.alreadyRead = 0;
        return _this;
    }
    HttpReadableStream.prototype._read = function (_size) {
        var _this = this;
        var length = this.byteEnd - this.byteStart;
        if (this.alreadyRead >= length) {
            this.push(null);
            return;
        }
        var failure = function (err) {
            debug(err);
            _this.push(null);
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
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4, (0, BufferUtils_1.streamToBufferPromise)(res)];
                    case 2:
                        buffer = _a.sent();
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        failure(err_1);
                        return [2];
                    case 4:
                        this.alreadyRead += buffer.length;
                        this.push(buffer);
                        return [2];
                }
            });
        }); };
        debug("HTTP GET ".concat(this.url, ": ").concat(this.byteStart, "-").concat(this.byteEnd, " (").concat(this.byteEnd - this.byteStart, ")"));
        var lastByteIndex = this.byteEnd - 1;
        var range = "".concat(this.byteStart, "-").concat(lastByteIndex);
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
    };
    return HttpReadableStream;
}(stream_1.Readable));
exports.HttpReadableStream = HttpReadableStream;
//# sourceMappingURL=HttpReadableStream.js.map