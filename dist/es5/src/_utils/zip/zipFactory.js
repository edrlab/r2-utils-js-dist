"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = require("fs");
var UrlUtils_1 = require("../http/UrlUtils");
var zip_ex_1 = require("./zip-ex");
var zip1_1 = require("./zip1");
var zip2_1 = require("./zip2");
function zipLoadPromise(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var stats;
        return tslib_1.__generator(this, function (_a) {
            if (UrlUtils_1.isHTTP(filePath)) {
                return [2, zip2_1.Zip2.loadPromise(filePath)];
            }
            stats = fs.lstatSync(filePath);
            if (stats.isDirectory()) {
                return [2, zip_ex_1.ZipExploded.loadPromise(filePath)];
            }
            return [2, zip1_1.Zip1.loadPromise(filePath)];
        });
    });
}
exports.zipLoadPromise = zipLoadPromise;
//# sourceMappingURL=zipFactory.js.map