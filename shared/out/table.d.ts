import { ILine, Line } from './line';
import { TextEditorEdit } from './editor';
export interface IData {
    columns: string[];
    toString(max: number[]): string;
}
export interface ITableLine extends ILine {
    data: IData;
    isValid(): boolean;
}
export declare class TableLine extends Line {
    data: IData;
    constructor(line: ILine);
    isValid(): boolean;
}
export declare class Table {
    columnsSeparator: RegExp;
    columnMaxLength: number[];
    valid: boolean;
    headers: ITableLine | undefined;
    rows: ITableLine[];
    constructor();
    reset(): void;
    push(line: ITableLine): void;
    private buildHeaders;
    private pushRow;
    empty(): boolean;
    update(paddingStr: string, editBuilder: TextEditorEdit): void;
}
//# sourceMappingURL=table.d.ts.map