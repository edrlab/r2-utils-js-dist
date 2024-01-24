"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const StreamZip = require("node-stream-zip");
const yauzl = require("yauzl");
const unzipper = require("unzipper");
console.log("process.cwd():");
console.log(process.cwd());
console.log("__dirname:");
console.log(__dirname);
const args = process.argv.slice(2);
console.log("args:");
console.log(args);
if (!args[0]) {
    console.log("FILEPATH ARGUMENT IS MISSING.");
    process.exit(1);
}
const argPath = args[0].trim();
let filePath = argPath;
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
const stats = fs.lstatSync(filePath);
if (!stats.isFile() && !stats.isDirectory()) {
    console.log("FILEPATH MUST BE FILE OR DIRECTORY.");
    process.exit(1);
}
const fileName = path.basename(filePath);
const ext = path.extname(fileName);
const argExtra = args[1] ? args[1].trim() : undefined;
const READ_ZIP_STREAMS = argExtra === "1";
const UNVERBOSE = false;
const VERBOSE = process.env.DEBUG || false;
const N_ITERATIONS = (READ_ZIP_STREAMS && VERBOSE) ? 1 : (READ_ZIP_STREAMS ? 5 : 10);
function streamReadAll(readStream) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let totalBytes = 0;
            const cleanup = () => {
                readStream.removeListener("data", handleData);
                readStream.removeListener("error", handleError);
                readStream.removeListener("end", handleEnd);
            };
            const handleError = (err) => {
                cleanup();
                reject(err);
            };
            readStream.on("error", handleError);
            const handleData = (data) => {
                totalBytes += data.length;
            };
            readStream.on("data", handleData);
            const handleEnd = () => {
                cleanup();
                resolve(totalBytes);
            };
            readStream.on("end", handleEnd);
        });
    });
}
const zip1 = (file) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({
            file,
            storeEntries: true,
        });
        zip.on("error", (err) => {
            console.log("--ZIP error: " + filePath);
            console.log(err);
            reject(err);
        });
        zip.on("entry", (_entry) => {
        });
        zip.on("extract", (entry, f) => {
            console.log("--ZIP extract:");
            console.log(entry.name);
            console.log(f);
        });
        zip.on("ready", () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            const zipEntries = Object.values(zip.entries());
            const crcs = zipEntries.map((zipEntry) => {
                if (zipEntry.isDirectory) {
                    return 0;
                }
                else {
                    if (!zipEntry.crc && zipEntry.size) {
                        console.log(`1 CRC zero? ${zipEntry.name} (${zipEntry.size} bytes) => ${zipEntry.crc}`);
                    }
                    return zipEntry.crc;
                }
            }).filter((val) => {
                return val;
            });
            if (READ_ZIP_STREAMS) {
                if (VERBOSE) {
                    process.stdout.write("## 1 ##\n");
                }
                for (const zipEntry of zipEntries) {
                    if (zipEntry.isDirectory) {
                        continue;
                    }
                    const promize = new Promise((res, rej) => {
                        zip.stream(zipEntry.name, (err, stream) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                            if (err) {
                                console.log(err);
                                rej(err);
                                return;
                            }
                            const totalBytes = streamReadAll(stream);
                            process.nextTick(() => {
                                res(totalBytes);
                            });
                        }));
                    });
                    const size = yield promize;
                    if (zipEntry.size !== size) {
                        console.log(`1 SIZE MISMATCH? ${zipEntry.name} ${zipEntry.size} != ${size}`);
                    }
                    if (VERBOSE) {
                        process.stdout.write(` ${zipEntry.name} `);
                    }
                    else if (!UNVERBOSE) {
                        process.stdout.write(".");
                    }
                }
                if (!UNVERBOSE) {
                    process.stdout.write("\n");
                }
            }
            process.nextTick(() => {
                zip.close();
                process.nextTick(() => {
                    resolve(crcs);
                });
            });
        }));
    });
});
zip1.zipName = "node-stream-zip";
const zip2 = (file) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        let crcs;
        yauzl.open(file, { lazyEntries: true, autoClose: false }, (error, zip) => {
            if (error || !zip) {
                console.log("yauzl init ERROR");
                console.log(error);
                reject(error);
                return;
            }
            zip.on("error", (erro) => {
                console.log("yauzl ERROR");
                console.log(erro);
                reject(erro);
            });
            if (READ_ZIP_STREAMS && VERBOSE) {
                process.stdout.write("## 2 ##\n");
            }
            zip.readEntry();
            zip.on("entry", (zipEntry) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
                if (zipEntry.fileName[zipEntry.fileName.length - 1] === "/") {
                }
                else {
                    if (!zipEntry.crc32 && zipEntry.uncompressedSize) {
                        console.log(`2 CRC zero? ${zipEntry.fileName} (${zipEntry.uncompressedSize} bytes) => ${zipEntry.crc32}`);
                    }
                    if (!crcs) {
                        crcs = [];
                    }
                    crcs.push(zipEntry.crc32);
                    if (READ_ZIP_STREAMS) {
                        const promize = new Promise((res, rej) => {
                            zip.openReadStream(zipEntry, (err, stream) => {
                                if (err || !stream) {
                                    console.log(err);
                                    rej(err);
                                    return;
                                }
                                const totalBytes = streamReadAll(stream);
                                process.nextTick(() => {
                                    res(totalBytes);
                                });
                            });
                        });
                        const size = yield promize;
                        if (zipEntry.uncompressedSize !== size) {
                            console.log(`2 SIZE MISMATCH? ${zipEntry.fileName} ${zipEntry.uncompressedSize} != ${size}`);
                        }
                        if (VERBOSE) {
                            process.stdout.write(` ${zipEntry.fileName} `);
                        }
                        else if (!UNVERBOSE) {
                            process.stdout.write(".");
                        }
                    }
                }
                zip.readEntry();
            }));
            zip.on("end", () => {
                if (READ_ZIP_STREAMS && !UNVERBOSE) {
                    process.stdout.write("\n");
                }
                process.nextTick(() => {
                    zip.close();
                    process.nextTick(() => {
                        if (!crcs) {
                            reject(crcs);
                            return;
                        }
                        resolve(crcs.filter((val) => {
                            return val;
                        }));
                    });
                });
            });
            zip.on("close", () => {
            });
        });
    });
});
zip2.zipName = "yauzl";
const streams = {};
const zip3 = (file) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        let zip;
        try {
            zip = yield unzipper.Open.file(file);
        }
        catch (err) {
            console.log(err);
            reject(err);
            return;
        }
        const crcs = zip.files.map((zipEntry) => {
            if (zipEntry.type === "Directory") {
                return 0;
            }
            else {
                if (!zipEntry.crc32 && zipEntry.uncompressedSize) {
                    console.log(`3 CRC zero? ${zipEntry.path} (${zipEntry.uncompressedSize} bytes) => ${zipEntry.crc32}`);
                }
                return zipEntry.crc32;
            }
        }).filter((val) => {
            return val;
        });
        if (READ_ZIP_STREAMS) {
            if (VERBOSE) {
                process.stdout.write("## 3 ##\n");
            }
            for (const zipEntry of zip.files) {
                if (zipEntry.type === "Directory") {
                    continue;
                }
                const stream = zipEntry.stream();
                stream.on("error", (err) => {
                    console.log("err1");
                    console.log(err);
                });
                stream.__ZIP_FILE_PATH = file;
                stream.__ZIP_RESOURCE_PATH = zipEntry.path;
                if (!streams[file]) {
                    streams[file] = {};
                }
                streams[file][zipEntry.path] = stream;
                stream.on("end", () => {
                    process.nextTick(() => {
                        delete streams[stream.__ZIP_FILE_PATH][stream.__ZIP_RESOURCE_PATH];
                    });
                });
                const promize = streamReadAll(stream);
                let size;
                try {
                    size = yield promize;
                }
                catch (err) {
                    console.log("err2");
                    console.log(err);
                    reject(err);
                    return;
                }
                if (zipEntry.uncompressedSize !== size) {
                    console.log(`3 SIZE MISMATCH? ${zipEntry.path} ${zipEntry.uncompressedSize} != ${size}`);
                }
                if (VERBOSE) {
                    process.stdout.write(` ${zipEntry.path} `);
                }
                else if (!UNVERBOSE) {
                    process.stdout.write(".");
                }
            }
            if (!UNVERBOSE) {
                process.stdout.write("\n");
            }
            process.nextTick(() => {
                delete streams[file];
            });
        }
        resolve(crcs);
    }));
});
zip3.zipName = "unzipper";
const zips = READ_ZIP_STREAMS ? [zip1, zip2] :
    [zip1, zip2, zip3];
function processFile(file) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log("=====================================");
        if (!UNVERBOSE) {
            console.log(`${file}`);
            console.log("=====================================");
        }
        let winner = 0;
        let minNanoOverall = Number.MAX_SAFE_INTEGER;
        let iZip = 0;
        for (const zip of zips) {
            iZip++;
            zip.minNano = Number.MAX_SAFE_INTEGER;
            if (VERBOSE) {
                console.log("-------------------------------");
            }
            let crcsPreviousIteration;
            for (let i = 0; i < N_ITERATIONS; i++) {
                process.stdout.write(`${i + 1}/${N_ITERATIONS} `);
                const time = process.hrtime();
                const crcs = yield zip(file);
                const diffTime = process.hrtime(time);
                const nanos = diffTime[0] * 1e9 + diffTime[1];
                if (nanos < zip.minNano) {
                    zip.minNano = nanos;
                }
                if (nanos < minNanoOverall) {
                    minNanoOverall = nanos;
                    winner = iZip;
                }
                if (VERBOSE) {
                    console.log(`Zip ${iZip} (${crcs.length}): ${diffTime[0]} seconds + ${diffTime[1]} nanoseconds`);
                }
                if (crcsPreviousIteration) {
                    if (!sameArrays(crcsPreviousIteration, crcs)) {
                        console.log(`++++ Zip ${iZip} (ITERATION ${i}) CRC DIFF!?`);
                        console.log(`-- ${crcsPreviousIteration.length}:`);
                        console.log(JSON.stringify(crcsPreviousIteration, null, 2));
                        console.log(`-- ${crcs.length}:`);
                        console.log(JSON.stringify(crcs, null, 2));
                        process.exit(1);
                    }
                }
                crcsPreviousIteration = crcs;
            }
            zip.CRCs = crcsPreviousIteration;
            if (!VERBOSE) {
                console.log("\n");
            }
        }
        let crcsPreviousZip;
        let isDiff = false;
        for (const zip of zips) {
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
            for (const zip of zips) {
                iZip++;
                console.log("==========================");
                console.log(`++++ Zip ${iZip} CRC:`);
                console.log(`-- ${zip.CRCs.length}:`);
                console.log(JSON.stringify(zip.CRCs));
            }
            for (let j = 0; j < zips.length; j++) {
                const zip = zips[j];
                let nDiffs = 0;
                for (let k = 0; k < zips.length; k++) {
                    if (j === k) {
                        continue;
                    }
                    const zip_ = zips[k];
                    if (!sameArrays(zip.CRCs, zip_.CRCs)) {
                        nDiffs++;
                    }
                }
                if (nDiffs === (zips.length - 1)) {
                    console.log("####################################");
                    console.log("####################################");
                    console.log(`SUSPECT ====> Zip ${j + 1} (${zip.zipName})`);
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
        for (const zip of zips) {
            iZip++;
            const won = iZip === winner;
            console.log(`${won ? ">>" : "--"} Zip ${iZip} (${zip.zipName}) => ${zip.minNano.toLocaleString()} nanoseconds ${won ? " [ WINNER ]" : `[ +${(zip.minNano - minNanoOverall).toLocaleString()} ]`}`);
        }
    });
}
if (stats.isDirectory()) {
    (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const files = fs.readdirSync(filePath, { withFileTypes: true }).
            filter((f) => f.isFile() &&
            /((\.epub3?)|(\.zip)|(\.cbz))$/i.test(f.name)).
            map((f) => path.join(filePath, f.name));
        for (const file of files) {
            yield processFile(file);
        }
    }))();
}
else if (/((\.epub3?)|(\.cbz)|(\.zip))$/i.test(ext)) {
    (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        yield processFile(filePath);
    }))();
}
function sameArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let j = 0; j < arr1.length; j++) {
        if (arr1[j] !== arr2[j]) {
            return false;
        }
    }
    return true;
}
//# sourceMappingURL=perf-zip-crc-cli.js.map