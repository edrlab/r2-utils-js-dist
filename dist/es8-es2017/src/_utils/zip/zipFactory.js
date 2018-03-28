"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const UrlUtils_1 = require("../http/UrlUtils");
const zip_ex_1 = require("./zip-ex");
const zip1_1 = require("./zip1");
const zip2_1 = require("./zip2");
async function zipLoadPromise(filePath) {
    if (UrlUtils_1.isHTTP(filePath)) {
        return zip2_1.Zip2.loadPromise(filePath);
    }
    const stats = fs.lstatSync(filePath);
    if (stats.isDirectory()) {
        return zip_ex_1.ZipExploded.loadPromise(filePath);
    }
    return zip1_1.Zip1.loadPromise(filePath);
}
exports.zipLoadPromise = zipLoadPromise;
//# sourceMappingURL=zipFactory.js.map