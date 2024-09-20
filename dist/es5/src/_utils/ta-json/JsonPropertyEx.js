"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonPropertyEx = JsonPropertyEx;
require("reflect-metadata");
var debug_ = require("debug");
var ta_json_x_1 = require("ta-json-x");
var object_definition_1 = require("ta-json-x/dist/cjs/classes/object-definition");
var util = require("util");
var debug = debug_("r2:utils#ta-json-x/JsonPropertyEx");
function inspect(obj) {
    console.log(util.inspect(obj, { showHidden: false, depth: 1000, colors: true, customInspect: true }));
}
function JsonPropertyEx(propertyName) {
    debug("JsonPropertyEx");
    debug("propertyName");
    debug(propertyName);
    return function (target, key) {
        debug("target");
        inspect(target);
        debug("key");
        debug(key);
        debug("Reflect.getMetadata('design:type', target, key)");
        var objectType = Reflect.getMetadata("design:type", target, key);
        inspect(objectType);
        debug(objectType.name);
        debug("target.constructor");
        inspect(target.constructor);
        debug("getDefinition(target.constructor)");
        var objDef = (0, object_definition_1.getDefinition)(target.constructor);
        inspect(objDef);
        debug("objDef.getProperty(key)");
        var property = objDef.getProperty(key);
        inspect(property);
        return (0, ta_json_x_1.JsonProperty)(propertyName)(target, key);
    };
}
//# sourceMappingURL=JsonPropertyEx.js.map