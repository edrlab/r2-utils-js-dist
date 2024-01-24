"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDateConverter = void 0;
class JsonDateConverter {
    serialize(property) {
        return property ? property.toISOString() : "Invalid Date";
    }
    deserialize(value) {
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
    }
    collapseArrayWithSingleItem() {
        return false;
    }
}
exports.JsonDateConverter = JsonDateConverter;
//# sourceMappingURL=ta-json-date-converter.js.map