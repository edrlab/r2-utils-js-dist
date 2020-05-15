"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlConverter = void 0;
const object_definition_1 = require("../classes/object-definition");
function XmlConverter(converter) {
    return (target, key) => {
        const property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        if (typeof converter === "function") {
            property.converter = new converter();
        }
        else {
            property.converter = converter;
        }
    };
}
exports.XmlConverter = XmlConverter;
//# sourceMappingURL=xml-converter.js.map