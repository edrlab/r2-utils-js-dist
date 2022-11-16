"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = require("fs");
var path = require("path");
var BufferUtils_1 = require("./stream/BufferUtils");
var zip_ex_1 = require("./zip/zip-ex");
var zip1_1 = require("./zip/zip1");
var zip2_1 = require("./zip/zip2");
var zip3_1 = require("./zip/zip3");
console.log("process.cwd():");
console.log(process.cwd());
console.log("__dirname:");
console.log(__dirname);
var args = process.argv.slice(2);
console.log("args:");
console.log(args);
if (!args[0]) {
    console.log("FILEPATH ARGUMENT IS MISSING.");
    process.exit(1);
}
var argPath = args[0].trim();
var filePath = argPath;
console.log(filePath);
if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, argPath);
    console.log(filePath);
    if (!fs.existsSync(filePath)) {
        filePath = path.join(process.cwd(), argPath);
        console.log(filePath);
        if (!fs.existsSync(filePath)) {
            console.log("FILEPATH DOES NOT EXIST.");
            process.exit(1);
        }
    }
}
var stats = fs.lstatSync(filePath);
if (!stats.isFile() && !stats.isDirectory()) {
    console.log("FILEPATH MUST BE FILE OR DIRECTORY.");
    process.exit(1);
}
var fileName = path.basename(filePath);
var ext = path.extname(fileName);
if (stats.isDirectory()) {
    (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var zipExploded, entries, _i, entries_1, entryName, zipStream_, err_1, zipStream, zipData, err_2, str;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, zip_ex_1.ZipExploded.loadPromise(filePath)];
                case 1:
                    zipExploded = _a.sent();
                    return [4, zipExploded.getEntries()];
                case 2:
                    entries = _a.sent();
                    _i = 0, entries_1 = entries;
                    _a.label = 3;
                case 3:
                    if (!(_i < entries_1.length)) return [3, 13];
                    entryName = entries_1[_i];
                    console.log("############## " + entryName);
                    zipStream_ = void 0;
                    _a.label = 4;
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4, zipExploded.entryStreamPromise(entryName)];
                case 5:
                    zipStream_ = _a.sent();
                    return [3, 7];
                case 6:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2];
                case 7:
                    zipStream = zipStream_.stream;
                    zipData = void 0;
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 11]);
                    return [4, (0, BufferUtils_1.streamToBufferPromise)(zipStream)];
                case 9:
                    zipData = _a.sent();
                    return [3, 11];
                case 10:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [2];
                case 11:
                    if (/\.css$/i.test(entryName)) {
                        str = zipData.toString("utf8");
                        console.log(str);
                    }
                    _a.label = 12;
                case 12:
                    _i++;
                    return [3, 3];
                case 13: return [2];
            }
        });
    }); })();
}
else if (/((\.epub3?)|(\.cbz)|(\.zip))$/i.test(ext)) {
    (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var time3, zip3, diff3, time2, zip2, diff2, time1, zip1, diff1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    time3 = process.hrtime();
                    return [4, zip3_1.Zip3.loadPromise(filePath)];
                case 1:
                    zip3 = _a.sent();
                    diff3 = process.hrtime(time3);
                    console.log("Zip 3 (".concat(zip3.entriesCount(), "): ").concat(diff3[0], " seconds + ").concat(diff3[1], " nanoseconds"));
                    time2 = process.hrtime();
                    return [4, zip2_1.Zip2.loadPromise(filePath)];
                case 2:
                    zip2 = _a.sent();
                    diff2 = process.hrtime(time2);
                    console.log("Zip 2 (".concat(zip2.entriesCount(), "): ").concat(diff2[0], " seconds + ").concat(diff2[1], " nanoseconds"));
                    time1 = process.hrtime();
                    return [4, zip1_1.Zip1.loadPromise(filePath)];
                case 3:
                    zip1 = _a.sent();
                    diff1 = process.hrtime(time1);
                    console.log("Zip 1 (".concat(zip1.entriesCount(), "): ").concat(diff1[0], " seconds + ").concat(diff1[1], " nanoseconds"));
                    return [2];
            }
        });
    }); })();
}
//# sourceMappingURL=perf-cli.js.map