"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipExplodedHTTP = void 0;
const debug_ = require("debug");
const request = require("request");
const stream_1 = require("stream");
const url_1 = require("url");
const zip_1 = require("./zip");
const debug = debug_("r2:utils#zip/zip-ex-http");
class ZipExplodedHTTP extends zip_1.Zip {
    static async loadPromise(urlStr) {
        return Promise.resolve(new ZipExplodedHTTP(urlStr));
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
    async hasEntryAsync(entryPath) {
        debug(`hasEntryAsync: ${entryPath}`);
        const url = new url_1.URL(this.urlStr);
        url.pathname += entryPath;
        const urlStrEntry = url.toString();
        debug("urlStrEntry: ", urlStrEntry);
        return new Promise(async (topresolve, _topreject) => {
            const failure = async (err) => {
                debug(err);
                topresolve(false);
            };
            const success = async (response) => {
                if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
                    topresolve(false);
                    return;
                }
                topresolve(true);
            };
            const promise = new Promise((resolve, reject) => {
                request.get({
                    headers: {},
                    method: "HEAD",
                    uri: urlStrEntry,
                })
                    .on("response", async (response) => {
                    try {
                        await success(response);
                    }
                    catch (successError) {
                        await failure(successError);
                        return;
                    }
                    resolve();
                })
                    .on("error", async (err) => {
                    await failure(err);
                    reject();
                });
            });
            try {
                await promise;
            }
            catch (_err) {
            }
        });
    }
    async getEntries() {
        return new Promise(async (_resolve, reject) => {
            reject("Not implemented.");
        });
    }
    async entryStreamPromise(entryPath) {
        debug(`entryStreamPromise: ${entryPath}`);
        const url = new url_1.URL(this.urlStr);
        url.pathname += entryPath;
        const urlStrEntry = url.toString();
        debug("urlStrEntry: ", urlStrEntry);
        return new Promise(async (topresolve, topreject) => {
            const failure = async (err) => {
                debug(err);
                topreject(err);
            };
            const success = async (response) => {
                if (response.statusCode && (response.statusCode < 200 || response.statusCode >= 300)) {
                    await failure("HTTP CODE " + response.statusCode);
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
                    reset: async () => {
                        return this.entryStreamPromise(entryPath);
                    },
                    stream,
                };
                topresolve(streamAndLength);
            };
            const promise = new Promise((resolve, reject) => {
                request.get({
                    headers: {},
                    method: "GET",
                    uri: urlStrEntry,
                })
                    .on("response", async (response) => {
                    try {
                        await success(response);
                    }
                    catch (successError) {
                        await failure(successError);
                        return;
                    }
                    resolve();
                })
                    .on("error", async (err) => {
                    await failure(err);
                    reject();
                });
            });
            try {
                await promise;
            }
            catch (_err) {
            }
        });
    }
}
exports.ZipExplodedHTTP = ZipExplodedHTTP;
//# sourceMappingURL=zip-ex-http.js.map