"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlConverter = XmlConverter;
var object_definition_1 = require("../classes/object-definition");
function XmlConverter(converter) {
    return function (target, key) {
        var property = (0, object_definition_1.getDefinition)(target.constructor).getProperty(key);
        if (typeof converter === "function") {
            property.converter = new converter();
        }
        else {
            property.converter = converter;
        }
    };
}
//# sourceMappingURL=xml-converter.js.map