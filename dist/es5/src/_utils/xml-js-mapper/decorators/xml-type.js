"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlType = void 0;
var object_definition_1 = require("../classes/object-definition");
function XmlType(objectType) {
    return function (target, key) {
        var property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        property.objectType = objectType;
    };
}
exports.XmlType = XmlType;
//# sourceMappingURL=xml-type.js.map