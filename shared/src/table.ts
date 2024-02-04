import { ILine, Line } from './line';
import { Strings, Separators } from './utils';
import { TextEditorEdit } from './editor';

export interface IData {
    columns: string[]
    toString(max: number[]): string
}

export interface ITableLine extends ILine {
    data: IData
    isValid(): boolean
}

export class TableLine extends Line {
    data: IData = new Data([]);

    constructor(line: ILine) {
        super(line.pos, line.indent, line.content);


        this.data = new Data([]);
    }

    isValid(): boolean {
        let content = this.content.trim();

        if (content.length === 0) {
            return false;
        }

        if (!Separators.validBoundaries(content)) {
            return false;
        }

        if (Separators.count(content) < 2) {
            return false;
        }

        return true;
    }
}

class Data implements IData {
    columns: string[] = [];

    constructor(columns: string[]) {
        this.columns = columns;
    }

    toString(max: number[]): string {
        let str = "|";
        for (let i = 0; i < max.length; i++) {
            let diff = max[i] - this.columns[i].length;
            str += " " + this.columns[i] + " ".repeat(diff) + " |";
        }
        return str;
    }
}

export class Table {
    // separator is | not preceded by \ character, so it is not escaped
    columnsSeparator: RegExp = /(?<!\\)\|/;
    columnMaxLength: number[] = [];
    valid: boolean = true;

    headers: ITableLine | undefined;
    rows: ITableLine[] = [];


    constructor() {
        this.reset();
    }

    reset() {
        this.columnMaxLength = [];
        this.valid = true;

        this.headers = undefined;
        this.rows = [];
    }

    push(line: ITableLine) {
        this.empty() ? this.buildHeaders(line) : this.pushRow(line);
    }

    // returns true if the line is a valid table header
    private buildHeaders(line: ITableLine) {
        if (!this.valid) {
            return;
        }

        if (!line.isValid()) {
            this.valid = false;
            return;
        }

        // split the line in an array of tokens considerig | as separator.
        // Get rid of first and last element and take the inner ones
        let tokens = Strings.strip(
            Strings.split(line.content, this.columnsSeparator)
        );

        tokens.forEach(token => this.columnMaxLength.push(token.length));

        line.data = new Data(tokens);
        this.headers = line;

        this.valid = true;
    }

    // returns true if the line is a valid table row
    private pushRow(line: ITableLine) {
        if (!this.valid) {
            return;
        }

        if (!line.isValid()) {
            this.valid = false;
            return;
        }

        // split the line in an array of tokens considerig | as separator.
        // Get rid of first and last element and take the inner ones
        let tokens = Strings.strip(
            Strings.split(line.content, this.columnsSeparator)
        );

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

    empty(): boolean {
        return !this.headers;
    }

    update(paddingStr: string, editBuilder: TextEditorEdit) {
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
