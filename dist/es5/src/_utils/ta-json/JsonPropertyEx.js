"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var util = require("util");
var debug_ = require("debug");
var ta_json_1 = require("ta-json");
var object_definition_1 = require("ta-json/classes/object-definition");
var debug = debug_("r2:utils#ta-json/JsonPropertyEx");
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
        var objDef = object_definition_1.getDefinition(target.constructor);
        inspect(objDef);
        debug("objDef.getProperty(key)");
        var property = objDef.getProperty(key);
        inspect(property);
        return ta_json_1.JsonProperty(propertyName)(target, key);
    };
}
exports.JsonPropertyEx = JsonPropertyEx;
//# sourceMappingURL=JsonPropertyEx.js.map