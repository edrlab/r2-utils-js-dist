import { IPropertyConverter, JsonValue } from "ta-json";
export declare class JsonDateConverter implements IPropertyConverter {
    serialize(property: Date | undefined): JsonValue;
    deserialize(value: JsonValue): Date | undefined;
    collapseArrayWithSingleItem(): boolean;
}
