"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
const BufferUtils_1 = require("./stream/BufferUtils");
const zip_ex_1 = require("./zip/zip-ex");
const zip1_1 = require("./zip/zip1");
const zip2_1 = require("./zip/zip2");
const zip3_1 = require("./zip/zip3");
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
if (stats.isDirectory()) {
    (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const zipExploded = yield zip_ex_1.ZipExploded.loadPromise(filePath);
        const entries = yield zipExploded.getEntries();
        for (const entryName of entries) {
            console.log("############## " + entryName);
            let zipStream_;
            try {
                zipStream_ = yield zipExploded.entryStreamPromise(entryName);
            }
            catch (err) {
                console.log(err);
                return;
            }
            const zipStream = zipStream_.stream;
            let zipData;
            try {
                zipData = yield (0, BufferUtils_1.streamToBufferPromise)(zipStream);
            }
            catch (err) {
                console.log(err);
                return;
            }
            if (/\.css$/i.test(entryName)) {
                const str = zipData.toString("utf8");
                console.log(str);
            }
        }
    }))();
}
else if (/((\.epub3?)|(\.cbz)|(\.zip))$/i.test(ext)) {
    (() => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
        const time3 = process.hrtime();
        const zip3 = yield zip3_1.Zip3.loadPromise(filePath);
        const diff3 = process.hrtime(time3);
        console.log(`Zip 3 (${zip3.entriesCount()}): ${diff3[0]} seconds + ${diff3[1]} nanoseconds`);
        const time2 = process.hrtime();
        const zip2 = yield zip2_1.Zip2.loadPromise(filePath);
        const diff2 = process.hrtime(time2);
        console.log(`Zip 2 (${zip2.entriesCount()}): ${diff2[0]} seconds + ${diff2[1]} nanoseconds`);
        const time1 = process.hrtime();
        const zip1 = yield zip1_1.Zip1.loadPromise(filePath);
        const diff1 = process.hrtime(time1);
        console.log(`Zip 1 (${zip1.entriesCount()}): ${diff1[0]} seconds + ${diff1[1]} nanoseconds`);
    }))();
}
//# sourceMappingURL=perf-cli.js.map