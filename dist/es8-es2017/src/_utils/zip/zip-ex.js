"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_ = require("debug");
const filehound = require("filehound");
const fs = require("fs");
const path = require("path");
const zip_1 = require("./zip");
const debug = debug_("r2:utils#zip/zip-ex");
class ZipExploded extends zip_1.Zip {
    constructor(dirPath) {
        super();
        this.dirPath = dirPath;
    }
    static async loadPromise(dirPath) {
        return Promise.resolve(new ZipExploded(dirPath));
    }
    freeDestroy() {
        debug("freeDestroy: ZipExploded -- " + this.dirPath);
    }
    entriesCount() {
        return 0;
    }
    hasEntries() {
        return true;
    }
    hasEntry(entryPath) {
        return this.hasEntries()
            && fs.existsSync(path.join(this.dirPath, entryPath));
    }
    async getEntries() {
        return new Promise(async (resolve, _reject) => {
            const dirPathNormalized = fs.realpathSync(this.dirPath);
            const files = await filehound.create()
                .paths(this.dirPath)
                .find();
            const adjustedFiles = files.map((file) => {
                const filePathNormalized = fs.realpathSync(file);
                let relativeFilePath = filePathNormalized.replace(dirPathNormalized, "");
                debug(relativeFilePath);
                if (relativeFilePath.indexOf("/") === 0) {
                    relativeFilePath = relativeFilePath.substr(1);
                }
                return relativeFilePath;
            });
            resolve(adjustedFiles);
        });
    }
    async entryStreamPromise(entryPath) {
        if (!this.hasEntries() || !this.hasEntry(entryPath)) {
            return Promise.reject("no such path in zip exploded: " + entryPath);
        }
        const fullPath = path.join(this.dirPath, entryPath);
        const stats = fs.lstatSync(fullPath);
        const streamAndLength = {
            length: stats.size,
            reset: async () => {
                return this.entryStreamPromise(entryPath);
            },
            stream: fs.createReadStream(fullPath, { autoClose: false }),
        };
        return Promise.resolve(streamAndLength);
    }
}
exports.ZipExploded = ZipExploded;
//# sourceMappingURL=zip-ex.js.map