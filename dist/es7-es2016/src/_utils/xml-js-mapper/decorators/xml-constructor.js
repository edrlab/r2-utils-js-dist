"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlConstructor = void 0;
const object_definition_1 = require("../classes/object-definition");
function XmlConstructor() {
    return (target, key) => {
        const definition = object_definition_1.getDefinition(target.constructor);
        definition.ctr = target[key];
    };
}
exports.XmlConstructor = XmlConstructor;
//# sourceMappingURL=xml-constructor.js.map