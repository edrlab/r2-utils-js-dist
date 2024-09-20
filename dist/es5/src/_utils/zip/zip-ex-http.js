"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipExplodedHTTP = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var request = require("request");
var stream_1 = require("stream");
var url_1 = require("url");
var zip_1 = require("./zip");
var debug = debug_("r2:utils#zip/zip-ex-http");
var ZipExplodedHTTP = (function (_super) {
    tslib_1.__extends(ZipExplodedHTTP, _super);
    function ZipExplodedHTTP(urlStr) {
        var _this = _super.call(this) || this;
        _this.urlStr = urlStr;
        debug("ZipExplodedHTTP: ".concat(urlStr));
        return _this;
    }
    ZipExplodedHTTP.loadPromise = function (urlStr) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                return [2, Promise.resolve(new ZipExplodedHTTP(urlStr))];
            });
        });
    };
    ZipExplodedHTTP.prototype.freeDestroy = function () {
        debug("freeDestroy: ZipExplodedHTTP -- " + this.urlStr);
    };
    ZipExplodedHTTP.prototype.entriesCount = function () {
        return 0;
    };
    ZipExplodedHTTP.prototype.hasEntries = function () {
        return true;
    };
    ZipExplodedHTTP.prototype.hasEntry = function (_entryPath) {
        return true;
    };
    ZipExplodedHTTP.prototype.hasEntryAsync = function (entryPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, urlStrEntry;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                debug("hasEntryAsync: ".concat(entryPath));
                url = new url_1.URL(this.urlStr);
                url.pathname += entryPath;
                urlStrEntry = url.toString();
                debug("urlStrEntry: ", urlStrEntry);
                return [2, new Promise(function (topresolve, _topreject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var failure, success, promise, _err_1;
                        var _this = this;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    failure = function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            debug(err);
                                            topresolve(false);
                                            return [2];
                                        });
                                    }); };
                                    success = function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
                                                topresolve(false);
                                                return [2];
                                            }
                                            topresolve(true);
                                            return [2];
                                        });
                                    }); };
                                    promise = new Promise(function (resolve, reject) {
                                        request.get({
                                            headers: {},
                                            method: "HEAD",
                                            uri: urlStrEntry,
                                        })
                                            .on("response", function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            var successError_1;
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 2, , 4]);
                                                        return [4, success(response)];
                                                    case 1:
                                                        _a.sent();
                                                        return [3, 4];
                                                    case 2:
                                                        successError_1 = _a.sent();
                                                        return [4, failure(successError_1)];
                                                    case 3:
                                                        _a.sent();
                                                        return [2];
                                                    case 4:
                                                        resolve();
                                                        return [2];
                                                }
                                            });
                                        }); })
                                            .on("error", function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4, failure(err)];
                                                    case 1:
                                                        _a.sent();
                                                        reject();
                                                        return [2];
                                                }
                                            });
                                        }); });
                                    });
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4, promise];
                                case 2:
                                    _a.sent();
                                    return [3, 4];
                                case 3:
                                    _err_1 = _a.sent();
                                    return [3, 4];
                                case 4: return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    ZipExplodedHTTP.prototype.getEntries = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2, new Promise(function (_resolve, reject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        return tslib_1.__generator(this, function (_a) {
                            reject("Not implemented.");
                            return [2];
                        });
                    }); })];
            });
        });
    };
    ZipExplodedHTTP.prototype.entryStreamPromise = function (entryPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, urlStrEntry;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                debug("entryStreamPromise: ".concat(entryPath));
                url = new url_1.URL(this.urlStr);
                url.pathname += entryPath;
                urlStrEntry = url.toString();
                debug("urlStrEntry: ", urlStrEntry);
                return [2, new Promise(function (topresolve, topreject) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                        var failure, success, promise, _err_2;
                        var _this = this;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    failure = function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        return tslib_1.__generator(this, function (_a) {
                                            debug(err);
                                            topreject(err);
                                            return [2];
                                        });
                                    }); };
                                    success = function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                        var length, lengthStr, stream, streamAndLength;
                                        var _this = this;
                                        return tslib_1.__generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    if (!(response.statusCode && (response.statusCode < 200 || response.statusCode >= 300))) return [3, 2];
                                                    return [4, failure("HTTP CODE " + response.statusCode)];
                                                case 1:
                                                    _a.sent();
                                                    return [2];
                                                case 2:
                                                    length = 0;
                                                    lengthStr = response.headers["content-length"];
                                                    if (lengthStr) {
                                                        length = parseInt(lengthStr, 10);
                                                    }
                                                    stream = new stream_1.PassThrough();
                                                    response.pipe(stream);
                                                    streamAndLength = {
                                                        length: length,
                                                        reset: function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                                            return tslib_1.__generator(this, function (_a) {
                                                                return [2, this.entryStreamPromise(entryPath)];
                                                            });
                                                        }); },
                                                        stream: stream,
                                                    };
                                                    topresolve(streamAndLength);
                                                    return [2];
                                            }
                                        });
                                    }); };
                                    promise = new Promise(function (resolve, reject) {
                                        request.get({
                                            headers: {},
                                            method: "GET",
                                            uri: urlStrEntry,
                                        })
                                            .on("response", function (response) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            var successError_2;
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        _a.trys.push([0, 2, , 4]);
                                                        return [4, success(response)];
                                                    case 1:
                                                        _a.sent();
                                                        return [3, 4];
                                                    case 2:
                                                        successError_2 = _a.sent();
                                                        return [4, failure(successError_2)];
                                                    case 3:
                                                        _a.sent();
                                                        return [2];
                                                    case 4:
                                                        resolve();
                                                        return [2];
                                                }
                                            });
                                        }); })
                                            .on("error", function (err) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                            return tslib_1.__generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4, failure(err)];
                                                    case 1:
                                                        _a.sent();
                                                        reject();
                                                        return [2];
                                                }
                                            });
                                        }); });
                                    });
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4, promise];
                                case 2:
                                    _a.sent();
                                    return [3, 4];
                                case 3:
                                    _err_2 = _a.sent();
                                    return [3, 4];
                                case 4: return [2];
                            }
                        });
                    }); })];
            });
        });
    };
    return ZipExplodedHTTP;
}(zip_1.Zip));
exports.ZipExplodedHTTP = ZipExplodedHTTP;
//# sourceMappingURL=zip-ex-http.js.map