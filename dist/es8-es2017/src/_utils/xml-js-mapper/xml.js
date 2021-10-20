"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XML = void 0;
const deserialize_1 = require("./methods/deserialize");
class XML {
    static deserialize(objectInstance, objectType, options) {
        if (objectInstance.nodeType === 9) {
            objectInstance = objectInstance.documentElement;
        }
        return (0, deserialize_1.deserialize)(objectInstance, objectType, options);
    }
}
exports.XML = XML;
//# sourceMappingURL=xml.js.map