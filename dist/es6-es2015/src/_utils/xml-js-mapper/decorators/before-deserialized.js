"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeDeserialized = void 0;
const object_definition_1 = require("../classes/object-definition");
function BeforeDeserialized() {
    return (target, key) => {
        const definition = object_definition_1.getDefinition(target.constructor);
        definition.beforeDeserialized = target[key];
    };
}
exports.BeforeDeserialized = BeforeDeserialized;
//# sourceMappingURL=before-deserialized.js.map