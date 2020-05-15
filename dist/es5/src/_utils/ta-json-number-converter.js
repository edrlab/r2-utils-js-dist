"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonNumberConverter = void 0;
var JsonNumberConverter = (function () {
    function JsonNumberConverter() {
    }
    JsonNumberConverter.prototype.serialize = function (property) {
        return (typeof property === "string") ? Number(property) : property;
    };
    JsonNumberConverter.prototype.deserialize = function (value) {
        return Number(value);
    };
    JsonNumberConverter.prototype.collapseArrayWithSingleItem = function () {
        return false;
    };
    return JsonNumberConverter;
}());
exports.JsonNumberConverter = JsonNumberConverter;
//# sourceMappingURL=ta-json-number-converter.js.map