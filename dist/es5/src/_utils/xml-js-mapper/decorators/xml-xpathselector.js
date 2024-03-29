"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlXPathSelector = void 0;
require("reflect-metadata");
var object_definition_1 = require("../classes/object-definition");
function XmlXPathSelector(selector, namespaces) {
    return function (target, key) {
        var objectType = Reflect.getMetadata("design:type", target, key);
        var objDef = (0, object_definition_1.getDefinition)(target.constructor);
        var property = objDef.getProperty(key);
        property.xpathSelector = selector;
        if (namespaces) {
            property.namespaces = namespaces;
        }
        property.array = objectType === Array;
        property.set = objectType === Set;
        if (!property.array && !property.set && !property.objectType) {
            property.objectType = objectType;
        }
        if (property.xpathSelector.indexOf("|") < 0
            && property.xpathSelector.indexOf(">") < 0
            && property.xpathSelector.indexOf("*") < 0
            && property.xpathSelector.indexOf("||") < 0
            && property.xpathSelector.indexOf("[") < 0
            && property.xpathSelector.indexOf("]") < 0) {
            property.xpathSelectorParsed = [];
            var items = property.xpathSelector.split("/");
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (!item.length) {
                    continue;
                }
                var subitems = item.split(":");
                var isAttribute = item[0] === "@";
                var isText = item === "text()";
                var localName = subitems.length > 1 ?
                    subitems[1] :
                    (isAttribute ? subitems[0].substr(1) : subitems[0]);
                var namespacePrefix = subitems.length > 1 ?
                    (isAttribute ? subitems[0].substr(1) : subitems[0]) :
                    undefined;
                var namespaceUri = namespacePrefix ?
                    (namespaces ? namespaces[namespacePrefix] : undefined) :
                    undefined;
                var xItem = {
                    isAttribute: isAttribute,
                    isText: isText,
                    localName: localName,
                    namespacePrefix: namespacePrefix,
                    namespaceUri: namespaceUri,
                };
                property.xpathSelectorParsed.push(xItem);
            }
        }
    };
}
exports.XmlXPathSelector = XmlXPathSelector;
//# sourceMappingURL=xml-xpathselector.js.map