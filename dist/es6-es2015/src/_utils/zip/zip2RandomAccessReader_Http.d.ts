import { PassThrough } from "stream";
import * as yauzl from "yauzl";
export declare class HttpZipReader extends yauzl.RandomAccessReader {
    readonly url: string;
    readonly byteLength: number;
    private firstBuffer;
    private firstBufferStart;
    private firstBufferEnd;
    constructor(url: string, byteLength: number);
    _readStreamForRange(start: number, end: number): NodeJS.ReadableStream | PassThrough;
}
