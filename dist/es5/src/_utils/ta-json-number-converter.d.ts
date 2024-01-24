import { IPropertyConverter, JsonValue } from "ta-json-x";
export declare class JsonNumberConverter implements IPropertyConverter {
    serialize(property: number | string): JsonValue;
    deserialize(value: JsonValue): number;
    collapseArrayWithSingleItem(): boolean;
}
