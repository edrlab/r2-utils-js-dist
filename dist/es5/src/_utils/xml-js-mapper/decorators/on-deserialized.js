"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnDeserialized = OnDeserialized;
var object_definition_1 = require("../classes/object-definition");
function OnDeserialized() {
    return function (target, key) {
        var definition = (0, object_definition_1.getDefinition)(target.constructor);
        definition.onDeserialized = target[key];
    };
}
//# sourceMappingURL=on-deserialized.js.map