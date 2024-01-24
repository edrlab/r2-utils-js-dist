import { IStreamAndLength, IZip, Zip } from "./zip";
export declare class ZipExplodedHTTP extends Zip {
    readonly urlStr: string;
    static loadPromise(urlStr: string): Promise<IZip>;
    private constructor();
    freeDestroy(): void;
    entriesCount(): number;
    hasEntries(): boolean;
    hasEntry(_entryPath: string): boolean;
    hasEntryAsync(entryPath: string): Promise<boolean>;
    getEntries(): Promise<string[]>;
    entryStreamPromise(entryPath: string): Promise<IStreamAndLength>;
}
