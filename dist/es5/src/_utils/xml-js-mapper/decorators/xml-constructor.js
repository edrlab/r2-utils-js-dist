"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlConstructor = XmlConstructor;
var object_definition_1 = require("../classes/object-definition");
function XmlConstructor() {
    return function (target, key) {
        var definition = (0, object_definition_1.getDefinition)(target.constructor);
        definition.ctr = target[key];
    };
}
//# sourceMappingURL=xml-constructor.js.map