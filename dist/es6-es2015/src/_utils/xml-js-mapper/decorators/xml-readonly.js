"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlReadonly = XmlReadonly;
const object_definition_1 = require("../classes/object-definition");
function XmlReadonly() {
    return (target, key) => {
        const property = (0, object_definition_1.getDefinition)(target.constructor).getProperty(key);
        property.readonly = true;
    };
}
//# sourceMappingURL=xml-readonly.js.map