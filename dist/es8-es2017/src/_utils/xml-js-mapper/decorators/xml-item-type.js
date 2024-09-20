"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlItemType = XmlItemType;
const object_definition_1 = require("../classes/object-definition");
function XmlItemType(objectType) {
    return (target, key) => {
        const property = (0, object_definition_1.getDefinition)(target.constructor).getProperty(key);
        property.objectType = objectType;
    };
}
//# sourceMappingURL=xml-item-type.js.map