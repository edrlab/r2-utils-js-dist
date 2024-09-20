"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlWriteonly = XmlWriteonly;
const object_definition_1 = require("../classes/object-definition");
function XmlWriteonly() {
    return (target, key) => {
        const property = (0, object_definition_1.getDefinition)(target.constructor).getProperty(key);
        property.writeonly = true;
    };
}
//# sourceMappingURL=xml-writeonly.js.map