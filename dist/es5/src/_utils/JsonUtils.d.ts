export declare function isNullOrUndefined<T>(val: T | undefined | null): val is T;
export declare function sortObject(obj: any): any;
export declare function traverseJsonObjects(obj: any, func: (item: any, parent: any, keyInParent: any) => void): void;
