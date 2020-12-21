"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateConverter = void 0;
class DateConverter {
    serialize(property) {
        return property ? property.toISOString() : "Invalid Date";
    }
    deserialize(value) {
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
    }
}
exports.DateConverter = DateConverter;
//# sourceMappingURL=date-converter.js.map