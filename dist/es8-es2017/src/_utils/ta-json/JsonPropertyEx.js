"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPropertyEx = JsonPropertyEx;
require("reflect-metadata");
const debug_ = require("debug");
const ta_json_x_1 = require("ta-json-x");
const object_definition_1 = require("ta-json-x/dist/cjs/classes/object-definition");
const util = require("util");
const debug = debug_("r2:utils#ta-json-x/JsonPropertyEx");
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
        const objDef = (0, object_definition_1.getDefinition)(target.constructor);
        inspect(objDef);
        debug("objDef.getProperty(key)");
        const property = objDef.getProperty(key);
        inspect(property);
        return (0, ta_json_x_1.JsonProperty)(propertyName)(target, key);
    };
}
//# sourceMappingURL=JsonPropertyEx.js.map