"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlType = XmlType;
const object_definition_1 = require("../classes/object-definition");
function XmlType(objectType) {
    return (target, key) => {
        const property = (0, object_definition_1.getDefinition)(target.constructor).getProperty(key);
        property.objectType = objectType;
    };
}
//# sourceMappingURL=xml-type.js.map