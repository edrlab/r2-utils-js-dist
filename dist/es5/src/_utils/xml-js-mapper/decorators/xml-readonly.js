"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlReadonly = XmlReadonly;
var object_definition_1 = require("../classes/object-definition");
function XmlReadonly() {
    return function (target, key) {
        var property = (0, object_definition_1.getDefinition)(target.constructor).getProperty(key);
        property.readonly = true;
    };
}
//# sourceMappingURL=xml-readonly.js.map