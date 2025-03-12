"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipExploded = void 0;
const tslib_1 = require("tslib");
const debug_ = require("debug");
const fs = require("fs");
const path = require("path");
const zip_1 = require("./zip");
const debug = debug_("r2:utils#zip/zip-ex");
const scanDir = (rootDir, subRootDir) => {
    const dirPathNormalized = fs.realpathSync(rootDir);
    const files = fs.readdirSync(subRootDir, { withFileTypes: true }).
        filter((f) => f.isFile()).map((f) => path.join(subRootDir, f.name));
    let adjustedFiles = files.map((file) => {
        const filePathNormalized = fs.realpathSync(file);
        let relativeFilePath = filePathNormalized.replace(dirPathNormalized, "");
        if (relativeFilePath.indexOf("/") === 0 || relativeFilePath.indexOf("\\") === 0) {
            relativeFilePath = relativeFilePath.substr(1);
        }
        return relativeFilePath;
    });
    const folders = fs.readdirSync(subRootDir, { withFileTypes: true }).
        filter((f) => f.isDirectory()).map((f) => path.join(subRootDir, f.name));
    for (const folder of folders) {
        const subFiles = scanDir(rootDir, folder);
        adjustedFiles = adjustedFiles.concat(subFiles);
    }
    return adjustedFiles;
};
class ZipExploded extends zip_1.Zip {
    static loadPromise(dirPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(new ZipExploded(dirPath));
        });
    }
    constructor(dirPath) {
        super();
        this.dirPath = dirPath;
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
    getEntries() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, _reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const deepFiles = scanDir(this.dirPath, this.dirPath);
                resolve(deepFiles);
            }));
        });
    }
    entryStreamPromise(entryPath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.hasEntries() || !this.hasEntry(entryPath)) {
                return Promise.reject("no such path in zip exploded: " + entryPath);
            }
            const fullPath = path.join(this.dirPath, entryPath);
            const stats = fs.lstatSync(fullPath);
            const streamAndLength = {
                length: stats.size,
                reset: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    return this.entryStreamPromise(entryPath);
                }),
                stream: fs.createReadStream(fullPath, { autoClose: false }),
            };
            return Promise.resolve(streamAndLength);
        });
    }
}
exports.ZipExploded = ZipExploded;
//# sourceMappingURL=zip-ex.js.map