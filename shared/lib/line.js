"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lines = exports.Line = exports.LineFactory = void 0;
const utils_1 = require("./utils");
const editor_1 = require("./editor");
class LineFactory {
    static create(text, pos) {
        let content = text.trimLeft();
        let indent = text.length - content.length;
        return new Line(pos, indent, content);
    }
}
exports.LineFactory = LineFactory;
class Line {
    constructor(pos, indent, content) {
        this.pos = pos;
        this.indent = indent;
        this.content = content;
    }
    // update a document line with a certain padding
    updatePadding(paddingStr, editBuilder) {
        if (this.indent < 0) {
            return;
        }
        let startPos = new editor_1.Position(this.pos, 0);
        let endPos = new editor_1.Position(this.pos, this.indent);
        let range = new editor_1.Range(startPos, endPos);
        editBuilder.replace(range, paddingStr);
    }
    updateContent(newContent, editBuilder) {
        if (this.indent < 0) {
            return;
        }
        let startPos = new editor_1.Position(this.pos, this.indent);
        let endPos = new editor_1.Position(this.pos, this.indent + this.content.length);
        let range = new editor_1.Range(startPos, endPos);
        editBuilder.replace(range, newContent);
    }
    isEmpty() {
        return this.content.trim().length === 0;
    }
    isTagLine() {
        if (!this.content) {
            return false;
        }
        if (this.content.length === 0) {
            return false;
        }
        return this.content.charAt(0) === "@";
    }
    isKeywordLine(keyword) {
        if (!keyword) {
            return false;
        }
        if (!this.content) {
            return false;
        }
        if (this.content.length === 0) {
            return false;
        }
        return this.content.startsWith(keyword);
    }
    isTableLine() {
        if (this.isEmpty()) {
            return false;
        }
        if (this.content.length < 2) {
            return false;
        }
        if (!utils_1.Separators.validBoundaries(this.content)) {
            return false;
        }
        if (utils_1.Separators.count(this.content) < 2) {
            return false;
        }
        return true;
    }
}
exports.Line = Line;
class Lines {
    constructor() {
        this.lines = [];
    }
    append(line) {
        this.lines.push(line);
    }
    isEmpty() {
        return this.lines.length === 0;
    }
    reset() {
        this.lines = [];
    }
    updateContent(newContent, editBuilder) {
        let startLine = this.lines[0];
        let endLine = this.lines[this.lines.length - 1];
        let startPos = new editor_1.Position(startLine.pos, 0);
        let endPos = new editor_1.Position(endLine.pos, endLine.indent + endLine.content.length);
        let range = new editor_1.Range(startPos, endPos);
        editBuilder.replace(range, newContent);
    }
}
exports.Lines = Lines;
//# sourceMappingURL=line.js.map