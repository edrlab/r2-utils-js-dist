"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const UrlUtils_1 = require("../http/UrlUtils");
const zip_ex_1 = require("./zip-ex");
const zip1_1 = require("./zip1");
const zip2_1 = require("./zip2");
function zipLoadPromise(filePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (UrlUtils_1.isHTTP(filePath)) {
            return zip2_1.Zip2.loadPromise(filePath);
        }
        const stats = fs.lstatSync(filePath);
        if (stats.isDirectory()) {
            return zip_ex_1.ZipExploded.loadPromise(filePath);
        }
        return zip1_1.Zip1.loadPromise(filePath);
    });
}
exports.zipLoadPromise = zipLoadPromise;
//# sourceMappingURL=zipFactory.js.map