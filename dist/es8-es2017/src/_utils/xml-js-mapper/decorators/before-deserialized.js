"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeDeserialized = BeforeDeserialized;
const object_definition_1 = require("../classes/object-definition");
function BeforeDeserialized() {
    return (target, key) => {
        const definition = (0, object_definition_1.getDefinition)(target.constructor);
        definition.beforeDeserialized = target[key];
    };
}
//# sourceMappingURL=before-deserialized.js.map