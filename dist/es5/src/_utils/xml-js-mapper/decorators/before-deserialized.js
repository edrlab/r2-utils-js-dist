"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeforeDeserialized = BeforeDeserialized;
var object_definition_1 = require("../classes/object-definition");
function BeforeDeserialized() {
    return function (target, key) {
        var definition = (0, object_definition_1.getDefinition)(target.constructor);
        definition.beforeDeserialized = target[key];
    };
}
//# sourceMappingURL=before-deserialized.js.map