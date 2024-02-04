"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Separators = exports.File = exports.Strings = void 0;
class Strings {
    static split(str, sep) {
        return str.trim().split(sep).map(token => token.trim());
    }
    // strip removes first and last element in an array if array has at least two elements
    static strip(arr) {
        if (arr.length > 2) {
            return arr.slice(1, arr.length - 1);
        }
        return arr;
    }
    static normalizeToJustOneSpaceAfterPrefix(content, prefix) {
        /**
         * This function normalizes the content of a line by removing all the spaces
         * after the prefix and leaving just one space. In the case of a reserved word
         * followed by a : it is also considered
         */
        return content.replace(new RegExp(`(${prefix})\\s*(:?)\\s+`), "$1$2 ");
    }
}
exports.Strings = Strings;
class File {
    static isFeature(filepath) {
        return filepath.endsWith('.feature');
    }
}
exports.File = File;
class Separators {
    static validBoundaries(str) {
        str = str.trim();
        if (str.charAt(0) !== '|') {
            return false;
        }
        if (str.charAt(str.length - 1) !== '|') {
            return false;
        }
        return true;
    }
    static count(str) {
        // matches | but not \| (escaped)
        return (str.match(/(?<!\\)\|/g) || []).length;
    }
}
exports.Separators = Separators;
//# sourceMappingURL=utils.js.map