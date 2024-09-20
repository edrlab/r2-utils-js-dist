"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = deserialize;
var tslib_1 = require("tslib");
var xpath = require("xpath");
var object_definition_1 = require("../classes/object-definition");
var converter_1 = require("../converters/converter");
function deserialize(objectInstance, objectType, options) {
    if (options === void 0) { options = { runConstructor: false }; }
    return deserializeRootObject(objectInstance, objectType, options);
}
function deserializeRootObject(objectInstance, objectType, options) {
    if (objectType === void 0) { objectType = Object; }
    if (!object_definition_1.objectDefinitions.has(objectType)) {
        return undefined;
    }
    var _a = (0, object_definition_1.getTypedInheritanceChain)(objectType, objectInstance), objectType2 = _a[0], superTypes = _a.slice(1);
    var output = Object.create(objectType2.prototype);
    var definitions = tslib_1.__spreadArray(tslib_1.__spreadArray([], superTypes.reverse(), true), [objectType2], false).map(function (t) { return object_definition_1.objectDefinitions.get(t); })
        .filter(function (t) { return !!t; });
    definitions.forEach(function (d) {
        if (!d) {
            return;
        }
        if (options.runConstructor) {
            d.ctr.call(output);
        }
        d.beforeDeserialized.call(output);
        d.properties.forEach(function (p, key) {
            if (!p.objectType) {
                throw new Error("Cannot deserialize property \"".concat(key, "\" without type!"));
            }
            if (p.readonly) {
                return;
            }
            if (p.xpathSelectorParsed) {
                var xpathMatched_1 = [];
                var currentNodes = [objectInstance];
                var index = -1;
                for (var _i = 0, _a = p.xpathSelectorParsed; _i < _a.length; _i++) {
                    var item = _a[_i];
                    index++;
                    var nextCurrentNodes = [];
                    var _loop_1 = function (currentNode) {
                        if (item.isText) {
                            var textNode = currentNode.firstChild || currentNode;
                            if (currentNode.childNodes && currentNode.childNodes.length) {
                                var allTextNodes = [];
                                var atLeastOneElementChild = false;
                                for (var i = 0; i < currentNode.childNodes.length; i++) {
                                    var childNode = currentNode.childNodes.item(i);
                                    if (childNode.nodeType === 3) {
                                        allTextNodes.push(childNode);
                                    }
                                    else if (childNode.nodeType === 1) {
                                        atLeastOneElementChild = true;
                                        break;
                                    }
                                }
                                if (atLeastOneElementChild) {
                                    var toStringed = void 0;
                                    if (currentNode.innerHTML) {
                                        console.log("innerHTML");
                                        toStringed = currentNode.innerHTML;
                                    }
                                    else if (currentNode.childNodes.toString) {
                                        toStringed = currentNode.childNodes.toString();
                                    }
                                    else {
                                        console.log("childNodes.items.toString?");
                                        for (var i = 0; i < currentNode.childNodes.length; i++) {
                                            var childNode = currentNode.childNodes.item(i);
                                            if (childNode.toString) {
                                                if (!toStringed) {
                                                    toStringed = "";
                                                }
                                                toStringed += childNode.toString();
                                            }
                                        }
                                    }
                                    if (toStringed) {
                                        var obj = { data: toStringed, nodeType: 3 };
                                        textNode = obj;
                                    }
                                }
                                else if (allTextNodes.length) {
                                    if (allTextNodes.length === 1) {
                                        textNode = allTextNodes[0];
                                    }
                                    else {
                                        console.log("###################");
                                        console.log("###################");
                                        console.log("###################");
                                        console.log("XML text nodes: [" + allTextNodes.length + "]");
                                        var fullTxt_1 = "";
                                        allTextNodes.forEach(function (allTextNode) {
                                            fullTxt_1 += allTextNode.data;
                                        });
                                        console.log(fullTxt_1);
                                        var obj = { data: fullTxt_1, nodeType: 3 };
                                        textNode = obj;
                                    }
                                }
                            }
                            if (textNode) {
                                xpathMatched_1.push(textNode);
                            }
                        }
                        else if (item.isAttribute) {
                            if (currentNode.attributes) {
                                var attr = item.namespaceUri ?
                                    currentNode.attributes.getNamedItemNS(item.namespaceUri, item.localName) :
                                    currentNode.attributes.getNamedItem(item.localName);
                                if (attr) {
                                    xpathMatched_1.push(attr);
                                }
                            }
                        }
                        else {
                            if (currentNode.childNodes && currentNode.childNodes.length) {
                                for (var i = 0; i < currentNode.childNodes.length; i++) {
                                    var childNode = currentNode.childNodes.item(i);
                                    if (childNode.nodeType !== 1) {
                                        continue;
                                    }
                                    if (childNode.localName !== item.localName) {
                                        continue;
                                    }
                                    if (item.namespaceUri &&
                                        item.namespaceUri !== childNode.namespaceURI) {
                                        continue;
                                    }
                                    nextCurrentNodes.push(childNode);
                                }
                            }
                        }
                    };
                    for (var _b = 0, currentNodes_1 = currentNodes; _b < currentNodes_1.length; _b++) {
                        var currentNode = currentNodes_1[_b];
                        _loop_1(currentNode);
                    }
                    currentNodes = nextCurrentNodes;
                    if (index === p.xpathSelectorParsed.length - 1) {
                        currentNodes.forEach(function (node) {
                            xpathMatched_1.push(node);
                        });
                    }
                }
                if (xpathMatched_1 && xpathMatched_1.length) {
                    if (p.array || p.set) {
                        output[key] = [];
                        xpathMatched_1.forEach(function (item) {
                            output[key].push(deserializeObject(item, p, options));
                        });
                        if (p.set) {
                            output[key] = new Set(output[key]);
                        }
                        return;
                    }
                    output[key] = deserializeObject(xpathMatched_1[0], p, options);
                }
            }
            else if (p.xpathSelector) {
                var select = xpath.useNamespaces(p.namespaces || {});
                var xPathSelected = select(p.xpathSelector, objectInstance);
                if (xPathSelected && xPathSelected.length) {
                    var xpathMatched_2 = [];
                    if (!(xPathSelected instanceof Array)) {
                        xpathMatched_2.push(xPathSelected);
                    }
                    else {
                        xPathSelected.forEach(function (item) {
                            xpathMatched_2.push(item);
                        });
                    }
                    if (p.array || p.set) {
                        output[key] = [];
                        xpathMatched_2.forEach(function (item) {
                            output[key].push(deserializeObject(item, p, options));
                        });
                        if (p.set) {
                            output[key] = new Set(output[key]);
                        }
                        return;
                    }
                    output[key] = deserializeObject(xpathMatched_2[0], p, options);
                }
            }
        });
        d.onDeserialized.call(output);
    });
    return output;
}
function deserializeObject(objectInstance, definition, _options) {
    var primitive = definition.objectType === String
        || definition.objectType === Boolean
        || definition.objectType === Number;
    var value = objectInstance.nodeType === 3 ?
        objectInstance.data :
        (objectInstance.nodeType === 2 ?
            objectInstance.value :
            (objectInstance.nodeType === 1 ?
                objectInstance.localName :
                objectInstance.nodeValue));
    var converter = definition.converter || converter_1.propertyConverters.get(definition.objectType);
    if (converter) {
        return converter.deserialize(value);
    }
    if (!primitive) {
        var objDefinition = object_definition_1.objectDefinitions.get(definition.objectType);
        if (objDefinition) {
            return deserialize(objectInstance, definition.objectType);
        }
    }
    return value;
}
//# sourceMappingURL=deserialize.js.map