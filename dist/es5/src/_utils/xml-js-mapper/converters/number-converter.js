"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberConverter = void 0;
var NumberConverter = (function () {
    function NumberConverter() {
    }
    NumberConverter.prototype.serialize = function (property) {
        return (typeof property === "string") ? property : property.toString();
    };
    NumberConverter.prototype.deserialize = function (value) {
        return Number(value);
    };
    return NumberConverter;
}());
exports.NumberConverter = NumberConverter;
//# sourceMappingURL=number-converter.js.map