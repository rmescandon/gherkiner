"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = exports.TableLine = void 0;
const line_1 = require("./line");
const utils_1 = require("./utils");
class TableLine extends line_1.Line {
    constructor(line) {
        super(line.pos, line.indent, line.content);
        this.data = new Data([]);
        this.data = new Data([]);
    }
    isValid() {
        let content = this.content.trim();
        if (content.length === 0) {
            return false;
        }
        if (!utils_1.Separators.validBoundaries(content)) {
            return false;
        }
        if (utils_1.Separators.count(content) < 2) {
            return false;
        }
        return true;
    }
}
exports.TableLine = TableLine;
class Data {
    constructor(columns) {
        this.columns = [];
        this.columns = columns;
    }
    toString(max) {
        let str = "|";
        for (let i = 0; i < max.length; i++) {
            let diff = max[i] - this.columns[i].length;
            str += " " + this.columns[i] + " ".repeat(diff) + " |";
        }
        return str;
    }
}
class Table {
    constructor() {
        // separator is | not preceded by \ character, so it is not escaped
        this.columnsSeparator = /(?<!\\)\|/;
        this.columnMaxLength = [];
        this.valid = true;
        this.rows = [];
        this.reset();
    }
    reset() {
        this.columnMaxLength = [];
        this.valid = true;
        this.headers = undefined;
        this.rows = [];
    }
    push(line) {
        this.empty() ? this.buildHeaders(line) : this.pushRow(line);
    }
    // returns true if the line is a valid table header
    buildHeaders(line) {
        if (!this.valid) {
            return;
        }
        if (!line.isValid()) {
            this.valid = false;
            return;
        }
        // split the line in an array of tokens considerig | as separator.
        // Get rid of first and last element and take the inner ones
        let tokens = utils_1.Strings.strip(utils_1.Strings.split(line.content, this.columnsSeparator));
        tokens.forEach(token => this.columnMaxLength.push(token.length));
        line.data = new Data(tokens);
        this.headers = line;
        this.valid = true;
    }
    // returns true if the line is a valid table row
    pushRow(line) {
        if (!this.valid) {
            return;
        }
        if (!line.isValid()) {
            this.valid = false;
            return;
        }
        // split the line in an array of tokens considerig | as separator.
        // Get rid of first and last element and take the inner ones
        let tokens = utils_1.Strings.strip(utils_1.Strings.split(line.content, this.columnsSeparator));
        // check the number of headers matches the number of tokens in line
        if (tokens.length !== this.columnMaxLength.length) {
            this.valid = false;
            return;
        }
        for (let i = 0; i < this.columnMaxLength.length; i++) {
            let len = tokens[i].length;
            if (len > this.columnMaxLength[i]) {
                this.columnMaxLength[i] = len;
            }
        }
        line.data = new Data(tokens);
        this.rows.push(line);
    }
    empty() {
        return !this.headers;
    }
    update(paddingStr, editBuilder) {
        if (!this.valid) {
            return;
        }
        if (this.empty()) {
            return;
        }
        this.headers?.updateContent(this.headers.data.toString(this.columnMaxLength), editBuilder);
        this.headers?.updatePadding(paddingStr, editBuilder);
        for (let row of this.rows) {
            row.updateContent(row.data.toString(this.columnMaxLength), editBuilder);
            row.updatePadding(paddingStr, editBuilder);
        }
    }
}
exports.Table = Table;
//# sourceMappingURL=table.js.map