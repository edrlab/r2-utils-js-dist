/// <reference types="node" />
export interface IStreamAndLength {
    stream: NodeJS.ReadableStream;
    length: number;
    reset: () => Promise<IStreamAndLength>;
}
export interface IZip {
    hasEntries: () => boolean;
    entriesCount: () => number;
    hasEntry: (entryPath: string) => boolean;
    forEachEntry: (callback: (entryName: string) => void) => void;
    entryStreamPromise: (entryPath: string) => Promise<IStreamAndLength>;
    entryStreamRangePromise: (entryPath: string, begin: number, end: number) => Promise<IStreamAndLength>;
    freeDestroy: () => void;
}
export declare abstract class Zip implements IZip {
    abstract hasEntries(): boolean;
    abstract entriesCount(): number;
    abstract hasEntry(entryPath: string): boolean;
    abstract forEachEntry(callback: (entryName: string) => void): void;
    abstract entryStreamPromise(entryPath: string): Promise<IStreamAndLength>;
    abstract freeDestroy(): void;
    entryStreamRangePromise(entryPath: string, begin: number, end: number): Promise<IStreamAndLength>;
}
