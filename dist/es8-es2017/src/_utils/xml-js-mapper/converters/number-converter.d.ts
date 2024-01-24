import { IPropertyConverter } from "./converter";
export declare class NumberConverter implements IPropertyConverter {
    serialize(property: number | string): string;
    deserialize(value: string): number;
}
