import * as vscode from "vscode";
import { Separators } from "./utils";

export interface ILine {
  readonly pos: number;
  readonly indent: number;
  readonly content: string;

  isEmpty(): boolean;

  isTagLine(): boolean;
  isKeywordLine(keyword: string): boolean;
  isTableLine(): boolean;

  updatePadding(paddingStr: string, editBuilder: vscode.TextEditorEdit): void;
  updateContent(newContent: string, editBuilder: vscode.TextEditorEdit): void;
}

export class LineFactory {
  static create(text: string, pos: number): ILine {
    let content = text.trimLeft();
    let indent = text.length - content.length;
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
    editBuilder.replace(range, paddingStr);
  }

  updateContent(newContent: string, editBuilder: vscode.TextEditorEdit) {
    if (this.indent < 0) {
      return;
    }
    let startPos = new vscode.Position(this.pos, this.indent);
    let endPos = new vscode.Position(
      this.pos,
      this.indent + this.content.length
    );
    let range = new vscode.Range(startPos, endPos);
    editBuilder.replace(range, newContent);
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
    return this.content.charAt(0) === "@";
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
    if (!Separators.validBoundaries(this.content)) {
      return false;
    }
    if (Separators.count(this.content) < 2) {
      return false;
    }

    return true;
  }
}

export class Lines {
  lines: ILine[] = [];

  append(line: ILine) {
    this.lines.push(line);
  }

  isEmpty(): boolean {
    return this.lines.length === 0;
  }

  reset() {
    this.lines = [];
  }

  updateContent(newContent: string, editBuilder: vscode.TextEditorEdit) {
    let startLine = this.lines[0];
    let endLine = this.lines[this.lines.length - 1];
    let startPos = new vscode.Position(startLine.pos, 0);
    let endPos = new vscode.Position(
      endLine.pos,
      endLine.indent + endLine.content.length
    );
    let range = new vscode.Range(startPos, endPos);
    editBuilder.replace(range, newContent);
  }
}
