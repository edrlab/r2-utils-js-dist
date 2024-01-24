"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonNumberConverter = void 0;
class JsonNumberConverter {
    serialize(property) {
        return (typeof property === "string") ? Number(property) : property;
    }
    deserialize(value) {
        return Number(value);
    }
    collapseArrayWithSingleItem() {
        return false;
    }
}
exports.JsonNumberConverter = JsonNumberConverter;
//# sourceMappingURL=ta-json-number-converter.js.map