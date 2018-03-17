import { IStreamAndLength, IZip, Zip } from "./zip";
export declare class ZipExploded extends Zip {
    readonly dirPath: string;
    static loadPromise(dirPath: string): Promise<IZip>;
    private constructor();
    freeDestroy(): void;
    entriesCount(): number;
    hasEntries(): boolean;
    hasEntry(entryPath: string): boolean;
    getEntries(): Promise<string[]>;
    entryStreamPromise(entryPath: string): Promise<IStreamAndLength>;
}
