"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextEditorEdit = exports.Range = exports.Position = void 0;
class Position {
    constructor(line, character) {
        this.line = line;
        this.character = character;
    }
}
exports.Position = Position;
class Range {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}
exports.Range = Range;
class TextEditorEdit {
    constructor(strategy) {
        this._strategy = strategy;
    }
    replace(range, value) {
        this._strategy.replace(range, value);
    }
}
exports.TextEditorEdit = TextEditorEdit;
//# sourceMappingURL=editor.js.map