"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlReadonly = void 0;
var object_definition_1 = require("../classes/object-definition");
function XmlReadonly() {
    return function (target, key) {
        var property = object_definition_1.getDefinition(target.constructor).getProperty(key);
        property.readonly = true;
    };
}
exports.XmlReadonly = XmlReadonly;
//# sourceMappingURL=xml-readonly.js.map