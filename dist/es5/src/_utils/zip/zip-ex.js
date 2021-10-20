"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZipExploded = void 0;
var tslib_1 = require("tslib");
var debug_ = require("debug");
var fs = require("fs");
var path = require("path");
var zip_1 = require("./zip");
var debug = debug_("r2:utils#zip/zip-ex");
var ZipExploded = (function (_super) {
    (0, tslib_1.__extends)(ZipExploded, _super);
    function ZipExploded(dirPath) {
        var _this = _super.call(this) || this;
        _this.dirPath = dirPath;
        return _this;
    }
    ZipExploded.loadPromise = function (dirPath) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2, Promise.resolve(new ZipExploded(dirPath))];
            });
        });
    };
    ZipExploded.prototype.freeDestroy = function () {
        debug("freeDestroy: ZipExploded -- " + this.dirPath);
    };
    ZipExploded.prototype.entriesCount = function () {
        return 0;
    };
    ZipExploded.prototype.hasEntries = function () {
        return true;
    };
    ZipExploded.prototype.hasEntry = function (entryPath) {
        return this.hasEntries()
            && fs.existsSync(path.join(this.dirPath, entryPath));
    };
    ZipExploded.prototype.getEntries = function () {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                return [2, new Promise(function (resolve, _reject) { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                        var dirPathNormalized, files, adjustedFiles;
                        var _this = this;
                        return (0, tslib_1.__generator)(this, function (_a) {
                            dirPathNormalized = fs.realpathSync(this.dirPath);
                            files = fs.readdirSync(this.dirPath, { withFileTypes: true }).
                                filter(function (f) { return f.isFile() &&
                                /\.(epub3?)|(zip)|(cbz)$/.test(f.name); }).map(function (f) { return path.join(_this.dirPath, f.name); });
                            adjustedFiles = files.map(function (file) {
                                var filePathNormalized = fs.realpathSync(file);
                                var relativeFilePath = filePathNormalized.replace(dirPathNormalized, "");
                                debug(relativeFilePath);
                                if (relativeFilePath.indexOf("/") === 0) {
                                    relativeFilePath = relativeFilePath.substr(1);
                                }
                                return relativeFilePath;
                            });
                            resolve(adjustedFiles);
                            return [2];
                        });
                    }); })];
            });
        });
    };
    ZipExploded.prototype.entryStreamPromise = function (entryPath) {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function () {
            var fullPath, stats, streamAndLength;
            var _this = this;
            return (0, tslib_1.__generator)(this, function (_a) {
                if (!this.hasEntries() || !this.hasEntry(entryPath)) {
                    return [2, Promise.reject("no such path in zip exploded: " + entryPath)];
                }
                fullPath = path.join(this.dirPath, entryPath);
                stats = fs.lstatSync(fullPath);
                streamAndLength = {
                    length: stats.size,
                    reset: function () { return (0, tslib_1.__awaiter)(_this, void 0, void 0, function () {
                        return (0, tslib_1.__generator)(this, function (_a) {
                            return [2, this.entryStreamPromise(entryPath)];
                        });
                    }); },
                    stream: fs.createReadStream(fullPath, { autoClose: false }),
                };
                return [2, Promise.resolve(streamAndLength)];
            });
        });
    };
    return ZipExploded;
}(zip_1.Zip));
exports.ZipExploded = ZipExploded;
//# sourceMappingURL=zip-ex.js.map