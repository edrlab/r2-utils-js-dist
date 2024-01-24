"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XML = void 0;
var deserialize_1 = require("./methods/deserialize");
var XML = (function () {
    function XML() {
    }
    XML.deserialize = function (objectInstance, objectType, options) {
        if (objectInstance.nodeType === 9) {
            objectInstance = objectInstance.documentElement;
        }
        return (0, deserialize_1.deserialize)(objectInstance, objectType, options);
    };
    return XML;
}());
exports.XML = XML;
//# sourceMappingURL=xml.js.map