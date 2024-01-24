import { IPropertyConverter } from "./converter";
export declare class DateConverter implements IPropertyConverter {
    serialize(property: Date | undefined): string;
    deserialize(value: string): Date | undefined;
}
