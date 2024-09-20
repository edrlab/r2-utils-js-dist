"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlDiscriminatorProperty = XmlDiscriminatorProperty;
var object_definition_1 = require("../classes/object-definition");
function XmlDiscriminatorProperty(property) {
    return function (objectType) {
        (0, object_definition_1.getDefinition)(objectType).discriminatorProperty = property;
    };
}
//# sourceMappingURL=xml-discriminator-property.js.map