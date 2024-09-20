"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlDiscriminatorValue = XmlDiscriminatorValue;
var object_definition_1 = require("../classes/object-definition");
function XmlDiscriminatorValue(value) {
    return function (objectType) {
        (0, object_definition_1.getDefinition)(objectType).discriminatorValue = value;
    };
}
//# sourceMappingURL=xml-discriminator-value.js.map