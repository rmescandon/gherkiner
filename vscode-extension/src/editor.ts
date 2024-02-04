export class Position {
  readonly line: number;
  readonly character: number;

  constructor(line: number, character: number) {
    this.line = line;
    this.character = character;
  }
}

export class Range {
  readonly start: Position;
  readonly end: Position;

  constructor(start: Position, end: Position) {
    this.start = start;
    this.end = end;
  }
}

export class TextEditorEdit {
  _strategy: any;
  constructor(strategy: any) {
    this._strategy = strategy;
  }

  replace(range: Range, value: string): void {
    this._strategy.replace(range, value);
  }
}

