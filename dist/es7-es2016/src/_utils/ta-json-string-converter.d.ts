import { IPropertyConverter, JsonValue } from "ta-json-x";
export declare class JsonStringConverter implements IPropertyConverter {
    serialize(property: string): JsonValue;
    deserialize(value: JsonValue): string;
    collapseArrayWithSingleItem(): boolean;
}
