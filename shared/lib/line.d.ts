import { TextEditorEdit } from "./editor";
export interface ILine {
    readonly pos: number;
    readonly indent: number;
    readonly content: string;
    isEmpty(): boolean;
    isTagLine(): boolean;
    isKeywordLine(keyword: string): boolean;
    isTableLine(): boolean;
    updatePadding(paddingStr: string, editBuilder: TextEditorEdit): void;
    updateContent(newContent: string, editBuilder: TextEditorEdit): void;
}
export declare class LineFactory {
    static create(text: string, pos: number): ILine;
}
export declare class Line implements ILine {
    readonly pos: number;
    readonly indent: number;
    readonly content: string;
    constructor(pos: number, indent: number, content: string);
    updatePadding(paddingStr: string, editBuilder: TextEditorEdit): void;
    updateContent(newContent: string, editBuilder: TextEditorEdit): void;
    isEmpty(): boolean;
    isTagLine(): boolean;
    isKeywordLine(keyword: string): boolean;
    isTableLine(): boolean;
}
export declare class Lines {
    lines: ILine[];
    append(line: ILine): void;
    isEmpty(): boolean;
    reset(): void;
    updateContent(newContent: string, editBuilder: TextEditorEdit): void;
}
//# sourceMappingURL=line.d.ts.map