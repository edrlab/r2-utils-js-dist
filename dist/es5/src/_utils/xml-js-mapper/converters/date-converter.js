"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DateConverter = (function () {
    function DateConverter() {
    }
    DateConverter.prototype.serialize = function (property) {
        return property ? property.toISOString() : "Invalid Date";
    };
    DateConverter.prototype.deserialize = function (value) {
        var date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
    };
    DateConverter.prototype.collapseArrayWithSingleItem = function () {
        return false;
    };
    return DateConverter;
}());
exports.DateConverter = DateConverter;
//# sourceMappingURL=date-converter.js.map