"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Zip = void 0;
const RangeStream_1 = require("../stream/RangeStream");
class Zip {
    async entryStreamRangePromise(entryPath, begin, end) {
        let streamAndLength;
        try {
            streamAndLength = await this.entryStreamPromise(entryPath);
        }
        catch (err) {
            console.log(err);
            return Promise.reject(err);
        }
        const b = begin < 0 ? 0 : begin;
        const e = end < 0 ? (streamAndLength.length - 1) : end;
        const stream = new RangeStream_1.RangeStream(b, e, streamAndLength.length);
        streamAndLength.stream.pipe(stream);
        const sal = {
            length: streamAndLength.length,
            reset: async () => {
                return this.entryStreamRangePromise(entryPath, begin, end);
            },
            stream,
        };
        return sal;
    }
}
exports.Zip = Zip;
//# sourceMappingURL=zip.js.map