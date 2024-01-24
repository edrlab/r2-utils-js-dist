"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fs = require("fs");
var path = require("path");
var StreamZip = require("node-stream-zip");
var yauzl = require("yauzl");
var unzipper = require("unzipper");
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
var VERBOSE = process.env.DEBUG || false;
var argIterations = args[1] ? args[1].trim() : undefined;
var N_ITERATIONS = argIterations ? parseInt(argIterations, 10) : 5;
var argExtra = args[2] ? args[2].trim() : undefined;
var CHECK_ONLY_ZIP3 = argExtra === "1";
var zip1 = function (file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) {
                var zip = new StreamZip({
                    file: file,
                    storeEntries: true,
                });
                zip.on("error", function (err) {
                    console.log("--ZIP error: " + filePath);
                    console.log(err);
                    reject(err);
                });
                zip.on("entry", function (_entry) {
                });
                zip.on("extract", function (entry, f) {
                    console.log("--ZIP extract:");
                    console.log(entry.name);
                    console.log(f);
                });
                zip.on("ready", function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                    var zipEntries, _loop_1, _i, zipEntries_1, zipEntry;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                zipEntries = Object.values(zip.entries());
                                if (VERBOSE) {
                                    process.stdout.write("## 1 ##\n");
                                }
                                _loop_1 = function (zipEntry) {
                                    var promize, size;
                                    return tslib_1.__generator(this, function (_b) {
                                        switch (_b.label) {
                                            case 0:
                                                if (zipEntry.isDirectory) {
                                                    return [2, "continue"];
                                                }
                                                promize = new Promise(function (res, rej) {
                                                    zip.stream(zipEntry.name, function (err, stream) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                                                        var totalBytes;
                                                        return tslib_1.__generator(this, function (_a) {
                                                            if (err) {
                                                                console.log(err);
                                                                rej(err);
                                                                return [2];
                                                            }
                                                            totalBytes = streamReadAll(stream);
                                                            process.nextTick(function () {
                                                                res(totalBytes);
                                                            });
                                                            return [2];
                                                        });
                                                    }); });
                                                });
                                                return [4, promize];
                                            case 1:
                                                size = _b.sent();
                                                if (zipEntry.size !== size) {
                                                    console.log("1 SIZE MISMATCH? ".concat(zipEntry.name, " ").concat(zipEntry.size, " != ").concat(size));
                                                }
                                                if (VERBOSE) {
                                                    process.stdout.write(" ".concat(zipEntry.name, " "));
                                                }
                                                else {
                                                    process.stdout.write(".");
                                                }
                                                return [2];
                                        }
                                    });
                                };
                                _i = 0, zipEntries_1 = zipEntries;
                                _a.label = 1;
                            case 1:
                                if (!(_i < zipEntries_1.length)) return [3, 4];
                                zipEntry = zipEntries_1[_i];
                                return [5, _loop_1(zipEntry)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                _i++;
                                return [3, 1];
                            case 4:
                                process.stdout.write("\n");
                                process.nextTick(function () {
                                    zip.close();
                                    process.nextTick(function () {
                                        resolve();
                                    });
                                });
                                return [2];
                        }
                    });
                }); });
            })];
    });
}); };
zip1.zipName = "node-stream-zip";
var zip2 = function (file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) {
                yauzl.open(file, { lazyEntries: true, autoClose: false }, function (error, zip) {
                    if (error || !zip) {
                        console.log("yauzl init ERROR");
                        console.log(error);
                        reject(error);
                        return;
                    }
                    zip.on("error", function (erro) {
                        console.log("yauzl ERROR");
                        console.log(erro);
                        reject(erro);
                    });
                    if (VERBOSE) {
                        process.stdout.write("## 2 ##\n");
                    }
                    zip.readEntry();
                    zip.on("entry", function (zipEntry) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                        var promize, size;
                        return tslib_1.__generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(zipEntry.fileName[zipEntry.fileName.length - 1] === "/")) return [3, 1];
                                    return [3, 3];
                                case 1:
                                    promize = new Promise(function (res, rej) {
                                        zip.openReadStream(zipEntry, function (err, stream) {
                                            if (err || !stream) {
                                                console.log(err);
                                                rej(err);
                                                return;
                                            }
                                            var totalBytes = streamReadAll(stream);
                                            process.nextTick(function () {
                                                res(totalBytes);
                                            });
                                        });
                                    });
                                    return [4, promize];
                                case 2:
                                    size = _a.sent();
                                    if (zipEntry.uncompressedSize !== size) {
                                        console.log("2 SIZE MISMATCH? ".concat(zipEntry.fileName, " ").concat(zipEntry.uncompressedSize, " != ").concat(size));
                                    }
                                    if (VERBOSE) {
                                        process.stdout.write(" ".concat(zipEntry.fileName, " "));
                                    }
                                    else {
                                        process.stdout.write(".");
                                    }
                                    _a.label = 3;
                                case 3:
                                    zip.readEntry();
                                    return [2];
                            }
                        });
                    }); });
                    zip.on("end", function () {
                        process.stdout.write("\n");
                        process.nextTick(function () {
                            zip.close();
                            process.nextTick(function () {
                                resolve();
                            });
                        });
                    });
                    zip.on("close", function () {
                    });
                });
            })];
    });
}); };
zip2.zipName = "yauzl";
var zip3 = function (file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var zip, err_1, _i, _a, zipEntry, stream, promize, size, err_2;
                return tslib_1.__generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4, unzipper.Open.file(file)];
                        case 1:
                            zip = _b.sent();
                            return [3, 3];
                        case 2:
                            err_1 = _b.sent();
                            console.log(err_1);
                            reject(err_1);
                            return [2];
                        case 3:
                            if (VERBOSE) {
                                process.stdout.write("## 3 ##\n");
                            }
                            _i = 0, _a = zip.files;
                            _b.label = 4;
                        case 4:
                            if (!(_i < _a.length)) return [3, 10];
                            zipEntry = _a[_i];
                            if (zipEntry.type === "Directory") {
                                return [3, 9];
                            }
                            stream = zipEntry.stream();
                            stream.on("error", function (err) {
                                console.log("err1");
                                console.log(err);
                            });
                            promize = streamReadAll(stream);
                            size = void 0;
                            _b.label = 5;
                        case 5:
                            _b.trys.push([5, 7, , 8]);
                            return [4, promize];
                        case 6:
                            size = _b.sent();
                            return [3, 8];
                        case 7:
                            err_2 = _b.sent();
                            console.log("err2");
                            console.log(err_2);
                            reject(err_2);
                            return [2];
                        case 8:
                            if (zipEntry.uncompressedSize !== size) {
                                console.log("3 SIZE MISMATCH? ".concat(zipEntry.path, " ").concat(zipEntry.uncompressedSize, " != ").concat(size));
                            }
                            if (VERBOSE) {
                                process.stdout.write(" ".concat(zipEntry.path, " "));
                            }
                            else {
                                process.stdout.write(".");
                            }
                            _b.label = 9;
                        case 9:
                            _i++;
                            return [3, 4];
                        case 10:
                            process.stdout.write("\n");
                            resolve();
                            return [2];
                    }
                });
            }); })];
    });
}); };
zip3.zipName = "unzipper";
var zips = CHECK_ONLY_ZIP3 ? [zip3] : [zip1, zip2, zip3];
function processFile(file) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var winner, minNanoOverall, iZip, _i, zips_1, zip, i, time, diffTime, nanos, _a, zips_2, zip, won;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("-------------------------------");
                    console.log("".concat(file));
                    console.log("-------------------------------");
                    winner = 0;
                    minNanoOverall = Number.MAX_SAFE_INTEGER;
                    iZip = 0;
                    _i = 0, zips_1 = zips;
                    _b.label = 1;
                case 1:
                    if (!(_i < zips_1.length)) return [3, 6];
                    zip = zips_1[_i];
                    iZip++;
                    if (VERBOSE) {
                        console.log("-------------------------------");
                    }
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < N_ITERATIONS)) return [3, 5];
                    process.stdout.write("".concat(i + 1, "/").concat(N_ITERATIONS, " "));
                    time = process.hrtime();
                    return [4, zip(file)];
                case 3:
                    _b.sent();
                    diffTime = process.hrtime(time);
                    nanos = diffTime[0] * 1e9 + diffTime[1];
                    zip.minNano = nanos;
                    if (nanos < minNanoOverall) {
                        minNanoOverall = nanos;
                        winner = iZip;
                    }
                    if (VERBOSE) {
                        console.log("Zip ".concat(iZip, ": ").concat(diffTime[0], " seconds + ").concat(diffTime[1], " nanoseconds"));
                    }
                    _b.label = 4;
                case 4:
                    i++;
                    return [3, 2];
                case 5:
                    _i++;
                    return [3, 1];
                case 6:
                    if (VERBOSE) {
                        console.log("-------------------------------");
                    }
                    iZip = 0;
                    for (_a = 0, zips_2 = zips; _a < zips_2.length; _a++) {
                        zip = zips_2[_a];
                        iZip++;
                        won = iZip === winner;
                        console.log("".concat(won ? ">>" : "--", " Zip ").concat(iZip, " (").concat(zip.zipName, ") => ").concat(zip.minNano.toLocaleString(), " nanoseconds ").concat(won ? " [ WINNER ]" : "[ +".concat((zip.minNano - minNanoOverall).toLocaleString(), " ]")));
                    }
                    return [2];
            }
        });
    });
}
if (stats.isDirectory()) {
    (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var files, _i, files_1, file;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = fs.readdirSync(filePath, { withFileTypes: true }).
                        filter(function (f) { return f.isFile() &&
                        /((\.epub3?)|(\.zip)|(\.cbz))$/i.test(f.name); }).
                        map(function (f) { return path.join(filePath, f.name); });
                    _i = 0, files_1 = files;
                    _a.label = 1;
                case 1:
                    if (!(_i < files_1.length)) return [3, 4];
                    file = files_1[_i];
                    return [4, processFile(file)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    }); })();
}
else if (/((\.epub3?)|(\.zip)|(\.cbz))$/i.test(ext)) {
    (function () { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, processFile(filePath)];
                case 1:
                    _a.sent();
                    return [2];
            }
        });
    }); })();
}
function streamReadAll(readStream) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        return tslib_1.__generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var totalBytes = 0;
                    var cleanup = function () {
                        readStream.removeListener("data", handleData);
                        readStream.removeListener("error", handleError);
                        readStream.removeListener("end", handleEnd);
                    };
                    var handleError = function (err) {
                        cleanup();
                        reject(err);
                    };
                    readStream.on("error", handleError);
                    var handleData = function (data) {
                        totalBytes += data.length;
                    };
                    readStream.on("data", handleData);
                    var handleEnd = function () {
                        cleanup();
                        resolve(totalBytes);
                    };
                    readStream.on("end", handleEnd);
                })];
        });
    });
}
//# sourceMappingURL=perf-zip-cli.js.map