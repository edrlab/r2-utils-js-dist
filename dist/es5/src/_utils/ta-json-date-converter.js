"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonDateConverter = void 0;
var JsonDateConverter = (function () {
    function JsonDateConverter() {
    }
    JsonDateConverter.prototype.serialize = function (property) {
        return property ? property.toISOString() : "Invalid Date";
    };
    JsonDateConverter.prototype.deserialize = function (value) {
        var date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
    };
    JsonDateConverter.prototype.collapseArrayWithSingleItem = function () {
        return false;
    };
    return JsonDateConverter;
}());
exports.JsonDateConverter = JsonDateConverter;
//# sourceMappingURL=ta-json-date-converter.js.map