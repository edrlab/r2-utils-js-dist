"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const util = require("util");
const debug_ = require("debug");
const ta_json_1 = require("ta-json");
const object_definition_1 = require("ta-json/classes/object-definition");
const debug = debug_("r2:utils#ta-json/JsonPropertyEx");
function inspect(obj) {
    console.log(util.inspect(obj, { showHidden: false, depth: 1000, colors: true, customInspect: true }));
}
function JsonPropertyEx(propertyName) {
    debug("JsonPropertyEx");
    debug("propertyName");
    debug(propertyName);
    return (target, key) => {
        debug("target");
        inspect(target);
        debug("key");
        debug(key);
        debug("Reflect.getMetadata('design:type', target, key)");
        const objectType = Reflect.getMetadata("design:type", target, key);
        inspect(objectType);
        debug(objectType.name);
        debug("target.constructor");
        inspect(target.constructor);
        debug("getDefinition(target.constructor)");
        const objDef = object_definition_1.getDefinition(target.constructor);
        inspect(objDef);
        debug("objDef.getProperty(key)");
        const property = objDef.getProperty(key);
        inspect(property);
        return ta_json_1.JsonProperty(propertyName)(target, key);
    };
}
exports.JsonPropertyEx = JsonPropertyEx;
//# sourceMappingURL=JsonPropertyEx.js.map