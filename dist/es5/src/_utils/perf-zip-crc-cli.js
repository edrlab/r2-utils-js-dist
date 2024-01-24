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
var argExtra = args[1] ? args[1].trim() : undefined;
var READ_ZIP_STREAMS = argExtra === "1";
var UNVERBOSE = false;
var VERBOSE = process.env.DEBUG || false;
var N_ITERATIONS = (READ_ZIP_STREAMS && VERBOSE) ? 1 : (READ_ZIP_STREAMS ? 5 : 10);
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
                    var zipEntries, crcs, _loop_1, _i, zipEntries_1, zipEntry;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                zipEntries = Object.values(zip.entries());
                                crcs = zipEntries.map(function (zipEntry) {
                                    if (zipEntry.isDirectory) {
                                        return 0;
                                    }
                                    else {
                                        if (!zipEntry.crc && zipEntry.size) {
                                            console.log("1 CRC zero? ".concat(zipEntry.name, " (").concat(zipEntry.size, " bytes) => ").concat(zipEntry.crc));
                                        }
                                        return zipEntry.crc;
                                    }
                                }).filter(function (val) {
                                    return val;
                                });
                                if (!READ_ZIP_STREAMS) return [3, 5];
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
                                                else if (!UNVERBOSE) {
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
                                if (!UNVERBOSE) {
                                    process.stdout.write("\n");
                                }
                                _a.label = 5;
                            case 5:
                                process.nextTick(function () {
                                    zip.close();
                                    process.nextTick(function () {
                                        resolve(crcs);
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
                var crcs;
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
                    if (READ_ZIP_STREAMS && VERBOSE) {
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
                                    if (!zipEntry.crc32 && zipEntry.uncompressedSize) {
                                        console.log("2 CRC zero? ".concat(zipEntry.fileName, " (").concat(zipEntry.uncompressedSize, " bytes) => ").concat(zipEntry.crc32));
                                    }
                                    if (!crcs) {
                                        crcs = [];
                                    }
                                    crcs.push(zipEntry.crc32);
                                    if (!READ_ZIP_STREAMS) return [3, 3];
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
                                    else if (!UNVERBOSE) {
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
                        if (READ_ZIP_STREAMS && !UNVERBOSE) {
                            process.stdout.write("\n");
                        }
                        process.nextTick(function () {
                            zip.close();
                            process.nextTick(function () {
                                if (!crcs) {
                                    reject(crcs);
                                    return;
                                }
                                resolve(crcs.filter(function (val) {
                                    return val;
                                }));
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
var streams = {};
var zip3 = function (file) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
    return tslib_1.__generator(this, function (_a) {
        return [2, new Promise(function (resolve, reject) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var zip, err_1, crcs, _loop_2, _i, _a, zipEntry, state_1;
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
                            crcs = zip.files.map(function (zipEntry) {
                                if (zipEntry.type === "Directory") {
                                    return 0;
                                }
                                else {
                                    if (!zipEntry.crc32 && zipEntry.uncompressedSize) {
                                        console.log("3 CRC zero? ".concat(zipEntry.path, " (").concat(zipEntry.uncompressedSize, " bytes) => ").concat(zipEntry.crc32));
                                    }
                                    return zipEntry.crc32;
                                }
                            }).filter(function (val) {
                                return val;
                            });
                            if (!READ_ZIP_STREAMS) return [3, 8];
                            if (VERBOSE) {
                                process.stdout.write("## 3 ##\n");
                            }
                            _loop_2 = function (zipEntry) {
                                var stream, promize, size, err_2;
                                return tslib_1.__generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            if (zipEntry.type === "Directory") {
                                                return [2, "continue"];
                                            }
                                            stream = zipEntry.stream();
                                            stream.on("error", function (err) {
                                                console.log("err1");
                                                console.log(err);
                                            });
                                            stream.__ZIP_FILE_PATH = file;
                                            stream.__ZIP_RESOURCE_PATH = zipEntry.path;
                                            if (!streams[file]) {
                                                streams[file] = {};
                                            }
                                            streams[file][zipEntry.path] = stream;
                                            stream.on("end", function () {
                                                process.nextTick(function () {
                                                    delete streams[stream.__ZIP_FILE_PATH][stream.__ZIP_RESOURCE_PATH];
                                                });
                                            });
                                            promize = streamReadAll(stream);
                                            size = void 0;
                                            _c.label = 1;
                                        case 1:
                                            _c.trys.push([1, 3, , 4]);
                                            return [4, promize];
                                        case 2:
                                            size = _c.sent();
                                            return [3, 4];
                                        case 3:
                                            err_2 = _c.sent();
                                            console.log("err2");
                                            console.log(err_2);
                                            reject(err_2);
                                            return [2, { value: void 0 }];
                                        case 4:
                                            if (zipEntry.uncompressedSize !== size) {
                                                console.log("3 SIZE MISMATCH? ".concat(zipEntry.path, " ").concat(zipEntry.uncompressedSize, " != ").concat(size));
                                            }
                                            if (VERBOSE) {
                                                process.stdout.write(" ".concat(zipEntry.path, " "));
                                            }
                                            else if (!UNVERBOSE) {
                                                process.stdout.write(".");
                                            }
                                            return [2];
                                    }
                                });
                            };
                            _i = 0, _a = zip.files;
                            _b.label = 4;
                        case 4:
                            if (!(_i < _a.length)) return [3, 7];
                            zipEntry = _a[_i];
                            return [5, _loop_2(zipEntry)];
                        case 5:
                            state_1 = _b.sent();
                            if (typeof state_1 === "object")
                                return [2, state_1.value];
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3, 4];
                        case 7:
                            if (!UNVERBOSE) {
                                process.stdout.write("\n");
                            }
                            process.nextTick(function () {
                                delete streams[file];
                            });
                            _b.label = 8;
                        case 8:
                            resolve(crcs);
                            return [2];
                    }
                });
            }); })];
    });
}); };
zip3.zipName = "unzipper";
var zips = READ_ZIP_STREAMS ? [zip1, zip2] :
    [zip1, zip2, zip3];
function processFile(file) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var winner, minNanoOverall, iZip, _i, zips_1, zip, crcsPreviousIteration, i, time, crcs, diffTime, nanos, crcsPreviousZip, isDiff, _a, zips_2, zip, _b, zips_3, zip, j, zip, nDiffs, k, zip_, _c, zips_4, zip, won;
        return tslib_1.__generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("=====================================");
                    if (!UNVERBOSE) {
                        console.log("".concat(file));
                        console.log("=====================================");
                    }
                    winner = 0;
                    minNanoOverall = Number.MAX_SAFE_INTEGER;
                    iZip = 0;
                    _i = 0, zips_1 = zips;
                    _d.label = 1;
                case 1:
                    if (!(_i < zips_1.length)) return [3, 7];
                    zip = zips_1[_i];
                    iZip++;
                    zip.minNano = Number.MAX_SAFE_INTEGER;
                    if (VERBOSE) {
                        console.log("-------------------------------");
                    }
                    crcsPreviousIteration = void 0;
                    i = 0;
                    _d.label = 2;
                case 2:
                    if (!(i < N_ITERATIONS)) return [3, 5];
                    process.stdout.write("".concat(i + 1, "/").concat(N_ITERATIONS, " "));
                    time = process.hrtime();
                    return [4, zip(file)];
                case 3:
                    crcs = _d.sent();
                    diffTime = process.hrtime(time);
                    nanos = diffTime[0] * 1e9 + diffTime[1];
                    if (nanos < zip.minNano) {
                        zip.minNano = nanos;
                    }
                    if (nanos < minNanoOverall) {
                        minNanoOverall = nanos;
                        winner = iZip;
                    }
                    if (VERBOSE) {
                        console.log("Zip ".concat(iZip, " (").concat(crcs.length, "): ").concat(diffTime[0], " seconds + ").concat(diffTime[1], " nanoseconds"));
                    }
                    if (crcsPreviousIteration) {
                        if (!sameArrays(crcsPreviousIteration, crcs)) {
                            console.log("++++ Zip ".concat(iZip, " (ITERATION ").concat(i, ") CRC DIFF!?"));
                            console.log("-- ".concat(crcsPreviousIteration.length, ":"));
                            console.log(JSON.stringify(crcsPreviousIteration, null, 2));
                            console.log("-- ".concat(crcs.length, ":"));
                            console.log(JSON.stringify(crcs, null, 2));
                            process.exit(1);
                        }
                    }
                    crcsPreviousIteration = crcs;
                    _d.label = 4;
                case 4:
                    i++;
                    return [3, 2];
                case 5:
                    zip.CRCs = crcsPreviousIteration;
                    if (!VERBOSE) {
                        console.log("\n");
                    }
                    _d.label = 6;
                case 6:
                    _i++;
                    return [3, 1];
                case 7:
                    isDiff = false;
                    for (_a = 0, zips_2 = zips; _a < zips_2.length; _a++) {
                        zip = zips_2[_a];
                        if (crcsPreviousZip && zip.CRCs) {
                            isDiff = !sameArrays(crcsPreviousZip, zip.CRCs);
                            if (isDiff) {
                                break;
                            }
                        }
                        crcsPreviousZip = zip.CRCs;
                    }
                    if (isDiff) {
                        console.log("CRC DIFF! ##############################################");
                        iZip = 0;
                        for (_b = 0, zips_3 = zips; _b < zips_3.length; _b++) {
                            zip = zips_3[_b];
                            iZip++;
                            console.log("==========================");
                            console.log("++++ Zip ".concat(iZip, " CRC:"));
                            console.log("-- ".concat(zip.CRCs.length, ":"));
                            console.log(JSON.stringify(zip.CRCs));
                        }
                        for (j = 0; j < zips.length; j++) {
                            zip = zips[j];
                            nDiffs = 0;
                            for (k = 0; k < zips.length; k++) {
                                if (j === k) {
                                    continue;
                                }
                                zip_ = zips[k];
                                if (!sameArrays(zip.CRCs, zip_.CRCs)) {
                                    nDiffs++;
                                }
                            }
                            if (nDiffs === (zips.length - 1)) {
                                console.log("####################################");
                                console.log("####################################");
                                console.log("SUSPECT ====> Zip ".concat(j + 1, " (").concat(zip.zipName, ")"));
                                console.log("####################################");
                                console.log("####################################");
                            }
                        }
                        process.exit(1);
                    }
                    if (VERBOSE) {
                        console.log("=====================================");
                    }
                    iZip = 0;
                    for (_c = 0, zips_4 = zips; _c < zips_4.length; _c++) {
                        zip = zips_4[_c];
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
else if (/((\.epub3?)|(\.cbz)|(\.zip))$/i.test(ext)) {
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
function sameArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var j = 0; j < arr1.length; j++) {
        if (arr1[j] !== arr2[j]) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=perf-zip-crc-cli.js.map