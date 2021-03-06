"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypedInheritanceChain = exports.getInheritanceChain = exports.getDefinition = exports.objectDefinitions = exports.ObjectDefinition = void 0;
var property_definition_1 = require("./property-definition");
var ObjectDefinition = (function () {
    function ObjectDefinition() {
        this.discriminatorProperty = undefined;
        this.discriminatorValue = undefined;
        this.ctr = function () { return undefined; };
        this.beforeDeserialized = function () { return undefined; };
        this.onDeserialized = function () { return undefined; };
        this.properties = new Map();
    }
    ObjectDefinition.prototype.getProperty = function (key) {
        var property = this.properties.get(key);
        if (!property) {
            property = new property_definition_1.PropertyDefinition();
            this.properties.set(key, property);
        }
        return property;
    };
    return ObjectDefinition;
}());
exports.ObjectDefinition = ObjectDefinition;
exports.objectDefinitions = new Map();
function getDefinition(objectType) {
    var definition = exports.objectDefinitions.get(objectType);
    if (!definition) {
        definition = new ObjectDefinition();
        exports.objectDefinitions.set(objectType, definition);
    }
    return definition;
}
exports.getDefinition = getDefinition;
function getInheritanceChain(objectType) {
    if (!objectType) {
        return [];
    }
    var parent = Object.getPrototypeOf(objectType);
    return [objectType.constructor].concat(getInheritanceChain(parent));
}
exports.getInheritanceChain = getInheritanceChain;
function getChildObjectTypeDefinitions(parentObjectType) {
    var childDefs = [];
    exports.objectDefinitions.forEach(function (def, objectType) {
        var superObjectType = Object.getPrototypeOf(objectType.prototype).constructor;
        if (superObjectType === parentObjectType) {
            childDefs.push({ functionType: objectType, objectDefinition: def });
        }
    });
    return childDefs;
}
function getTypedInheritanceChain(objectType, objectInstance) {
    var parentDef = exports.objectDefinitions.get(objectType);
    var childDefs = [];
    if (objectInstance && parentDef && parentDef.discriminatorProperty) {
        childDefs = childDefs.concat(getChildObjectTypeDefinitions(objectType));
    }
    var actualObjectType;
    while (childDefs.length !== 0 && !actualObjectType) {
        var ifo = childDefs.shift();
        var objectType2 = ifo ? ifo.functionType : undefined;
        var def = ifo ? ifo.objectDefinition : undefined;
        if (def && def.hasOwnProperty("discriminatorValue")) {
            if (objectInstance
                && parentDef
                && parentDef.discriminatorProperty
                && def.discriminatorValue === objectInstance[parentDef.discriminatorProperty]) {
                if (def.hasOwnProperty("discriminatorProperty")) {
                    return getTypedInheritanceChain(objectType2, objectInstance);
                }
                actualObjectType = objectType2;
            }
        }
        else {
            childDefs = childDefs.concat(getChildObjectTypeDefinitions(objectType2));
        }
    }
    if (!actualObjectType) {
        actualObjectType = objectType;
    }
    var inheritanceChain = new Set(getInheritanceChain(Object.create(actualObjectType.prototype)));
    return Array.from(inheritanceChain).filter(function (t) { return exports.objectDefinitions.has(t); });
}
exports.getTypedInheritanceChain = getTypedInheritanceChain;
//# sourceMappingURL=object-definition.js.map