"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserialize = deserialize;
const xpath = require("xpath");
const object_definition_1 = require("../classes/object-definition");
const converter_1 = require("../converters/converter");
function deserialize(objectInstance, objectType, options = { runConstructor: false }) {
    return deserializeRootObject(objectInstance, objectType, options);
}
function deserializeRootObject(objectInstance, objectType = Object, options) {
    if (!object_definition_1.objectDefinitions.has(objectType)) {
        return undefined;
    }
    const [objectType2, ...superTypes] = (0, object_definition_1.getTypedInheritanceChain)(objectType, objectInstance);
    const output = Object.create(objectType2.prototype);
    const definitions = [...superTypes.reverse(), objectType2]
        .map((t) => object_definition_1.objectDefinitions.get(t))
        .filter((t) => !!t);
    definitions.forEach((d) => {
        if (!d) {
            return;
        }
        if (options.runConstructor) {
            d.ctr.call(output);
        }
        d.beforeDeserialized.call(output);
        d.properties.forEach((p, key) => {
            if (!p.objectType) {
                throw new Error(`Cannot deserialize property "${key}" without type!`);
            }
            if (p.readonly) {
                return;
            }
            if (p.xpathSelectorParsed) {
                const xpathMatched = [];
                let currentNodes = [objectInstance];
                let index = -1;
                for (const item of p.xpathSelectorParsed) {
                    index++;
                    const nextCurrentNodes = [];
                    for (const currentNode of currentNodes) {
                        if (item.isText) {
                            let textNode = currentNode.firstChild || currentNode;
                            if (currentNode.childNodes && currentNode.childNodes.length) {
                                const allTextNodes = [];
                                let atLeastOneElementChild = false;
                                for (let i = 0; i < currentNode.childNodes.length; i++) {
                                    const childNode = currentNode.childNodes.item(i);
                                    if (childNode.nodeType === 3) {
                                        allTextNodes.push(childNode);
                                    }
                                    else if (childNode.nodeType === 1) {
                                        atLeastOneElementChild = true;
                                        break;
                                    }
                                }
                                if (atLeastOneElementChild) {
                                    let toStringed;
                                    if (currentNode.innerHTML) {
                                        console.log("innerHTML");
                                        toStringed = currentNode.innerHTML;
                                    }
                                    else if (currentNode.childNodes.toString) {
                                        toStringed = currentNode.childNodes.toString();
                                    }
                                    else {
                                        console.log("childNodes.items.toString?");
                                        for (let i = 0; i < currentNode.childNodes.length; i++) {
                                            const childNode = currentNode.childNodes.item(i);
                                            if (childNode.toString) {
                                                if (!toStringed) {
                                                    toStringed = "";
                                                }
                                                toStringed += childNode.toString();
                                            }
                                        }
                                    }
                                    if (toStringed) {
                                        const obj = { data: toStringed, nodeType: 3 };
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
                                        let fullTxt = "";
                                        allTextNodes.forEach((allTextNode) => {
                                            fullTxt += allTextNode.data;
                                        });
                                        console.log(fullTxt);
                                        const obj = { data: fullTxt, nodeType: 3 };
                                        textNode = obj;
                                    }
                                }
                            }
                            if (textNode) {
                                xpathMatched.push(textNode);
                            }
                        }
                        else if (item.isAttribute) {
                            if (currentNode.attributes) {
                                const attr = item.namespaceUri ?
                                    currentNode.attributes.getNamedItemNS(item.namespaceUri, item.localName) :
                                    currentNode.attributes.getNamedItem(item.localName);
                                if (attr) {
                                    xpathMatched.push(attr);
                                }
                            }
                        }
                        else {
                            if (currentNode.childNodes && currentNode.childNodes.length) {
                                for (let i = 0; i < currentNode.childNodes.length; i++) {
                                    const childNode = currentNode.childNodes.item(i);
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
                    }
                    currentNodes = nextCurrentNodes;
                    if (index === p.xpathSelectorParsed.length - 1) {
                        currentNodes.forEach((node) => {
                            xpathMatched.push(node);
                        });
                    }
                }
                if (xpathMatched && xpathMatched.length) {
                    if (p.array || p.set) {
                        output[key] = [];
                        xpathMatched.forEach((item) => {
                            output[key].push(deserializeObject(item, p, options));
                        });
                        if (p.set) {
                            output[key] = new Set(output[key]);
                        }
                        return;
                    }
                    output[key] = deserializeObject(xpathMatched[0], p, options);
                }
            }
            else if (p.xpathSelector) {
                const select = xpath.useNamespaces(p.namespaces || {});
                const xPathSelected = select(p.xpathSelector, objectInstance);
                if (xPathSelected && xPathSelected.length) {
                    const xpathMatched = [];
                    if (!(xPathSelected instanceof Array)) {
                        xpathMatched.push(xPathSelected);
                    }
                    else {
                        xPathSelected.forEach((item) => {
                            xpathMatched.push(item);
                        });
                    }
                    if (p.array || p.set) {
                        output[key] = [];
                        xpathMatched.forEach((item) => {
                            output[key].push(deserializeObject(item, p, options));
                        });
                        if (p.set) {
                            output[key] = new Set(output[key]);
                        }
                        return;
                    }
                    output[key] = deserializeObject(xpathMatched[0], p, options);
                }
            }
        });
        d.onDeserialized.call(output);
    });
    return output;
}
function deserializeObject(objectInstance, definition, _options) {
    const primitive = definition.objectType === String
        || definition.objectType === Boolean
        || definition.objectType === Number;
    const value = objectInstance.nodeType === 3 ?
        objectInstance.data :
        (objectInstance.nodeType === 2 ?
            objectInstance.value :
            (objectInstance.nodeType === 1 ?
                objectInstance.localName :
                objectInstance.nodeValue));
    const converter = definition.converter || converter_1.propertyConverters.get(definition.objectType);
    if (converter) {
        return converter.deserialize(value);
    }
    if (!primitive) {
        const objDefinition = object_definition_1.objectDefinitions.get(definition.objectType);
        if (objDefinition) {
            return deserialize(objectInstance, definition.objectType);
        }
    }
    return value;
}
//# sourceMappingURL=deserialize.js.map