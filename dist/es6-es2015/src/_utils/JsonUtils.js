"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.traverseJsonObjects = exports.sortObject = exports.isNullOrUndefined = void 0;
function isNullOrUndefined(val) {
    return val === undefined || val === null;
}
exports.isNullOrUndefined = isNullOrUndefined;
function sortObject(obj) {
    if (obj === null) {
        return null;
    }
    if (obj instanceof Array) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = sortObject(obj[i]);
        }
        return obj;
    }
    else if (typeof obj !== "object") {
        return obj;
    }
    const newObj = {};
    Object.keys(obj).sort().forEach((key) => {
        newObj[key] = sortObject(obj[key]);
    });
    return newObj;
}
exports.sortObject = sortObject;
function traverseJsonObjects_(parent, keyInParent, obj, func) {
    func(obj, parent, keyInParent);
    if (obj instanceof Array) {
        for (let index = 0; index < obj.length; index++) {
            const item = obj[index];
            if (!isNullOrUndefined(item)) {
                traverseJsonObjects_(obj, index, item, func);
            }
        }
    }
    else if (typeof obj === "object" && obj !== null) {
        Object.keys(obj).forEach((key) => {
            if (obj.hasOwnProperty(key)) {
                const item = obj[key];
                if (!isNullOrUndefined(item)) {
                    traverseJsonObjects_(obj, key, item, func);
                }
            }
        });
    }
}
function traverseJsonObjects(obj, func) {
    traverseJsonObjects_(undefined, undefined, obj, func);
}
exports.traverseJsonObjects = traverseJsonObjects;
//# sourceMappingURL=JsonUtils.js.map