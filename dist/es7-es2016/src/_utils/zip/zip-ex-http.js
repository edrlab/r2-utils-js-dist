"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipExplodedHTTP = void 0;
const tslib_1 = require("tslib");
const debug_ = require("debug");
const request = require("request");
const stream_1 = require("stream");
const url_1 = require("url");
const zip_1 = require("./zip");
const debug = debug_("r2:utils#zip/zip-ex-http");
class ZipExplodedHTTP extends zip_1.Zip {
    static loadPromise(urlStr) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(new ZipExplodedHTTP(urlStr));
        });
    }
    constructor(urlStr) {
        super();
        this.urlStr = urlStr;
        debug(`ZipExplodedHTTP: ${urlStr}`);
    }
    freeDestroy() {
        debug("freeDestroy: ZipExplodedHTTP -- " + this.urlStr);
    }
    entriesCount() {
        return 0;
    }
    hasEntries() {
        return true;
    }
    hasEntry(_entryPath) {
        return true;
    }
    hasEntryAsync(entryPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug(`hasEntryAsync: ${entryPath}`);
            const url = new url_1.URL(this.urlStr);
            url.pathname += entryPath;
            const urlStrEntry = url.toString();
            debug("urlStrEntry: ", urlStrEntry);
            return new Promise((topresolve, _topreject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const failure = (err) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    debug(err);
                    topresolve(false);
                });
                const success = (response) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
                        topresolve(false);
                        return;
                    }
                    topresolve(true);
                });
                const promise = new Promise((resolve, reject) => {
                    request.get({
                        headers: {},
                        method: "HEAD",
                        uri: urlStrEntry,
                    })
                        .on("response", (response) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            yield success(response);
                        }
                        catch (successError) {
                            yield failure(successError);
                            return;
                        }
                        resolve();
                    }))
                        .on("error", (err) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        yield failure(err);
                        reject();
                    }));
                });
                try {
                    yield promise;
                }
                catch (_err) {
                }
            }));
        });
    }
    getEntries() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((_resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                reject("Not implemented.");
            }));
        });
    }
    entryStreamPromise(entryPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debug(`entryStreamPromise: ${entryPath}`);
            const url = new url_1.URL(this.urlStr);
            url.pathname += entryPath;
            const urlStrEntry = url.toString();
            debug("urlStrEntry: ", urlStrEntry);
            return new Promise((topresolve, topreject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const failure = (err) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    debug(err);
                    topreject(err);
                });
                const success = (response) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
                        yield failure("HTTP CODE " + response.statusCode);
                        return;
                    }
                    let length = 0;
                    const lengthStr = response.headers["content-length"];
                    if (lengthStr) {
                        length = parseInt(lengthStr, 10);
                    }
                    const stream = new stream_1.PassThrough();
                    response.pipe(stream);
                    const streamAndLength = {
                        length,
                        reset: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            return this.entryStreamPromise(entryPath);
                        }),
                        stream,
                    };
                    topresolve(streamAndLength);
                });
                const promise = new Promise((resolve, reject) => {
                    request.get({
                        headers: {},
                        method: "GET",
                        uri: urlStrEntry,
                    })
                        .on("response", (response) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        try {
                            yield success(response);
                        }
                        catch (successError) {
                            yield failure(successError);
                            return;
                        }
                        resolve();
                    }))
                        .on("error", (err) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                        yield failure(err);
                        reject();
                    }));
                });
                try {
                    yield promise;
                }
                catch (_err) {
                }
            }));
        });
    }
}
exports.ZipExplodedHTTP = ZipExplodedHTTP;
//# sourceMappingURL=zip-ex-http.js.map