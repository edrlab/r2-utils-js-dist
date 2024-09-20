"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnDeserialized = OnDeserialized;
const object_definition_1 = require("../classes/object-definition");
function OnDeserialized() {
    return (target, key) => {
        const definition = (0, object_definition_1.getDefinition)(target.constructor);
        definition.onDeserialized = target[key];
    };
}
//# sourceMappingURL=on-deserialized.js.map