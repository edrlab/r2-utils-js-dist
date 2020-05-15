"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnDeserialized = void 0;
const object_definition_1 = require("../classes/object-definition");
function OnDeserialized() {
    return (target, key) => {
        const definition = object_definition_1.getDefinition(target.constructor);
        definition.onDeserialized = target[key];
    };
}
exports.OnDeserialized = OnDeserialized;
//# sourceMappingURL=on-deserialized.js.map