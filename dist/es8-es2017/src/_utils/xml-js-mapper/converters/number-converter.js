"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberConverter = void 0;
class NumberConverter {
    serialize(property) {
        return (typeof property === "string") ? property : property.toString();
    }
    deserialize(value) {
        return Number(value);
    }
}
exports.NumberConverter = NumberConverter;
//# sourceMappingURL=number-converter.js.map