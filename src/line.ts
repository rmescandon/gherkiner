import * as vscode from 'vscode';


export interface ILine {
    readonly pos: number
    readonly indent: number
    readonly content: string

    isEmpty(): boolean 

    isTagLine(): boolean
    isKeywordLine(keyword: string): boolean
    isTableLine(): boolean

    updatePadding(paddingStr: string, editBuilder: vscode.TextEditorEdit): void
    updateContent(newContent: string, editBuilder: vscode.TextEditorEdit): void
}

export class LineFactory  {
    static create(pos: number, doc: vscode.TextDocument): ILine {
        let line = doc.lineAt(pos);

        let content = line.text.trimLeft();
        let indent = line.text.length - content.length;
        return new Line(pos, indent, content);
    }
}

export class Line implements ILine {
    readonly pos: number;
    readonly indent: number;
    readonly content: string;

    constructor(pos: number, indent: number, content: string) {
        this.pos = pos;
        this.indent = indent;
        this.content = content;
    }

    // update a document line with a certain padding
    updatePadding(paddingStr: string, editBuilder: vscode.TextEditorEdit) {
        if (this.indent < 0) {
            return;
        }
        let startPos = new vscode.Position(this.pos, 0);
        let endPos = new vscode.Position(this.pos, this.indent);
        let range = new vscode.Range(startPos, endPos);
        editBuilder.replace(
            range,
            paddingStr,
        );
    }

    updateContent(newContent: string, editBuilder: vscode.TextEditorEdit) {
        if (this.indent < 0) {
            return;
        }
        let startPos = new vscode.Position(this.pos, this.indent);
        let endPos = new vscode.Position(this.pos, this.indent + this.content.length);
        let range = new vscode.Range(startPos, endPos);
        editBuilder.replace(
            range,
            newContent,
        );
    }

    isEmpty(): boolean {
        return this.content.trim().length === 0;
    }

    isTagLine(): boolean {
        if (!this.content) {
            return false;
        }
        if (this.content.length === 0) {
            return false;
        }
        return this.content.charAt(0) === '@';
    }

    isKeywordLine(keyword: string): boolean {
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

    isTableLine(): boolean {
        if (this.isEmpty()) {
            return false;
        }
        if (this.content.length < 2) {
            return false;
        }
        if (this.content.charAt(0) !== '|') {
            return false;
        }
        if (this.content.charAt(this.content.length - 1) !== '|') {
            return false;
        }
        return true;
    }
}