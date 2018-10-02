import { IPropertyConverter, JsonValue } from "ta-json-x";
export declare class JsonDateConverter implements IPropertyConverter {
    serialize(property: Date | undefined): JsonValue;
    deserialize(value: JsonValue): Date | undefined;
    collapseArrayWithSingleItem(): boolean;
}
