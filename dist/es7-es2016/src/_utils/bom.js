"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUTF8BOM = removeUTF8BOM;
function removeUTF8BOM(str) {
    if (str.charCodeAt(0) === 0xFEFF) {
        str = str.slice(1);
    }
    return str;
}
//# sourceMappingURL=bom.js.map