"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zip2 = void 0;
const debug_ = require("debug");
const request = require("request");
const requestPromise = require("request-promise-native");
const yauzl = require("yauzl");
const UrlUtils_1 = require("../http/UrlUtils");
const BufferUtils_1 = require("../stream/BufferUtils");
const zip_1 = require("./zip");
const zip2RandomAccessReader_Http_1 = require("./zip2RandomAccessReader_Http");
const debug = debug_("r2:utils#zip/zip2");
class Zip2 extends zip_1.Zip {
    static async loadPromise(filePath) {
        if ((0, UrlUtils_1.isHTTP)(filePath)) {
            return Zip2.loadPromiseHTTP(filePath);
        }
        return new Promise((resolve, reject) => {
            yauzl.open(filePath, { lazyEntries: true, autoClose: false }, (err, zip) => {
                if (err || !zip) {
                    debug("yauzl init ERROR");
                    debug(err);
                    reject(err);
                    return;
                }
                const zip2 = new Zip2(filePath, zip);
                zip.on("error", (erro) => {
                    debug("yauzl ERROR");
                    debug(erro);
                    reject(erro);
                });
                zip.readEntry();
                zip.on("entry", (entry) => {
                    if (entry.fileName[entry.fileName.length - 1] === "/") {
                    }
                    else {
                        zip2.addEntry(entry);
                    }
                    zip.readEntry();
                });
                zip.on("end", () => {
                    debug("yauzl END");
                    resolve(zip2);
                });
                zip.on("close", () => {
                    debug("yauzl CLOSE");
                });
            });
        });
    }
    static async loadPromiseHTTP(filePath) {
        const needsStreamingResponse = true;
        return new Promise(async (resolve, reject) => {
            const failure = (err) => {
                debug(err);
                reject(err);
            };
            const success = async (res) => {
                if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
                    failure("HTTP CODE " + res.statusCode);
                    return;
                }
                debug(filePath);
                debug(res.headers);
                if (!res.headers["content-length"]) {
                    reject("content-length not supported!");
                    return;
                }
                const httpZipByteLength = parseInt(res.headers["content-length"], 10);
                debug(`Content-Length: ${httpZipByteLength}`);
                if (!res.headers["accept-ranges"]
                    || res.headers["accept-ranges"].indexOf("bytes") < 0) {
                    if (httpZipByteLength > (2 * 1024 * 1024)) {
                        reject("accept-ranges not supported, file too big to download: " + httpZipByteLength);
                        return;
                    }
                    debug("Downloading: " + filePath);
                    const failure_ = (err) => {
                        debug(err);
                        reject(err);
                    };
                    const success_ = async (ress) => {
                        if (ress.statusCode && (ress.statusCode < 200 || ress.statusCode >= 300)) {
                            failure_("HTTP CODE " + ress.statusCode);
                            return;
                        }
                        let buffer;
                        try {
                            buffer = await (0, BufferUtils_1.streamToBufferPromise)(ress);
                        }
                        catch (err) {
                            debug(err);
                            reject(err);
                            return;
                        }
                        yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zip) => {
                            if (err || !zip) {
                                debug("yauzl init ERROR");
                                debug(err);
                                reject(err);
                                return;
                            }
                            const zip2 = new Zip2(filePath, zip);
                            zip.on("error", (erro) => {
                                debug("yauzl ERROR");
                                debug(erro);
                                reject(erro);
                            });
                            zip.readEntry();
                            zip.on("entry", (entry) => {
                                if (entry.fileName[entry.fileName.length - 1] === "/") {
                                }
                                else {
                                    zip2.addEntry(entry);
                                }
                                zip.readEntry();
                            });
                            zip.on("end", () => {
                                debug("yauzl END");
                                resolve(zip2);
                            });
                            zip.on("close", () => {
                                debug("yauzl CLOSE");
                            });
                        });
                    };
                    if (needsStreamingResponse) {
                        request.get({
                            headers: {},
                            method: "GET",
                            uri: filePath,
                        })
                            .on("response", async (res) => {
                            try {
                                await success_(res);
                            }
                            catch (successError) {
                                failure_(successError);
                                return;
                            }
                        })
                            .on("error", failure_);
                    }
                    else {
                        let ress;
                        try {
                            ress = await requestPromise({
                                headers: {},
                                method: "GET",
                                resolveWithFullResponse: true,
                                uri: filePath,
                            });
                        }
                        catch (err) {
                            failure_(err);
                            return;
                        }
                        await success_(ress);
                    }
                    return;
                }
                const httpZipReader = new zip2RandomAccessReader_Http_1.HttpZipReader(filePath, httpZipByteLength);
                yauzl.fromRandomAccessReader(httpZipReader, httpZipByteLength, { lazyEntries: true, autoClose: false }, (err, zip) => {
                    if (err || !zip) {
                        debug("yauzl init ERROR");
                        debug(err);
                        reject(err);
                        return;
                    }
                    zip.httpZipReader = httpZipReader;
                    const zip2 = new Zip2(filePath, zip);
                    zip.on("error", (erro) => {
                        debug("yauzl ERROR");
                        debug(erro);
                        reject(erro);
                    });
                    zip.readEntry();
                    zip.on("entry", (entry) => {
                        if (entry.fileName[entry.fileName.length - 1] === "/") {
                        }
                        else {
                            zip2.addEntry(entry);
                        }
                        zip.readEntry();
                    });
                    zip.on("end", () => {
                        debug("yauzl END");
                        resolve(zip2);
                    });
                    zip.on("close", () => {
                        debug("yauzl CLOSE");
                    });
                });
            };
            if (needsStreamingResponse) {
                request.get({
                    headers: {},
                    method: "HEAD",
                    uri: filePath,
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
            else {
                let res;
                try {
                    res = await requestPromise({
                        headers: {},
                        method: "HEAD",
                        resolveWithFullResponse: true,
                        uri: filePath,
                    });
                }
                catch (err) {
                    failure(err);
                    return;
                }
                await success(res);
            }
        });
    }
    constructor(filePath, zip) {
        super();
        this.filePath = filePath;
        this.zip = zip;
        this.entries = {};
    }
    freeDestroy() {
        debug("freeDestroy: Zip2 -- " + this.filePath);
        if (this.zip) {
            this.zip.close();
        }
    }
    entriesCount() {
        return this.zip.entryCount;
    }
    hasEntries() {
        return this.entriesCount() > 0;
    }
    hasEntry(entryPath) {
        return this.hasEntries() && this.entries[entryPath];
    }
    async getEntries() {
        if (!this.hasEntries()) {
            return Promise.resolve([]);
        }
        return Promise.resolve(Object.keys(this.entries));
    }
    async entryStreamPromise(entryPath) {
        if (!this.hasEntries() || !this.hasEntry(entryPath)) {
            return Promise.reject("no such path in zip: " + entryPath);
        }
        const entry = this.entries[entryPath];
        return new Promise((resolve, reject) => {
            this.zip.openReadStream(entry, (err, stream) => {
                if (err) {
                    debug("yauzl openReadStream ERROR");
                    debug(err);
                    reject(err);
                    return;
                }
                const streamAndLength = {
                    length: entry.uncompressedSize,
                    reset: async () => {
                        return this.entryStreamPromise(entryPath);
                    },
                    stream,
                };
                resolve(streamAndLength);
            });
        });
    }
    addEntry(entry) {
        this.entries[entry.fileName] = entry;
    }
}
exports.Zip2 = Zip2;
//# sourceMappingURL=zip2.js.map