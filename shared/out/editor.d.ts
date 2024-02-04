export declare class Position {
    readonly line: number;
    readonly character: number;
    constructor(line: number, character: number);
}
export declare class Range {
    readonly start: Position;
    readonly end: Position;
    constructor(start: Position, end: Position);
}
export declare class TextEditorEdit {
    _strategy: any;
    constructor(strategy: any);
    replace(range: Range, value: string): void;
}
//# sourceMappingURL=editor.d.ts.map