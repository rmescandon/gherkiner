import figlet from "figlet";
import { Command } from "commander";
import { TextEditorEdit, Range } from "./editor";
import { buildDocument } from "./core";
import * as fs from "fs";

function replaceRange(
  s: string,
  start: number,
  end: number,
  substitute: string
) {
  return s.substring(0, start) + substitute + s.substring(end);
}

export class CliTextEditorEdit {
  lines: string[] = [];

  constructor(lines: string[]) {
    this.lines = lines;
  }

  replace(range: Range, value: string): void {
    // TODO complete all the cases. By now, let's only consider a range with a
    // replacement in the same line
    if (range.start.line !== range.end.line) {
      return;
    }

    // TODO fill this with more generic case for multiline
    let line = range.end.line;
    if (this.lines.length <= line) {
      return;
    }

    this.lines[line] = replaceRange(
      this.lines[line],
      range.start.character,
      range.end.character,
      value
    );
  }
}

let settings = {
  paddingSymbol: " ",
  paddingDefault: 4,
  paddingTable: 10,
  paddings: [
    {
      keyword: "Feature",
      padding: 0,
    },
    {
      keyword: "Scenario Outline",
      padding: 2,
    },
    {
      keyword: "Scenario",
      padding: 2,
    },
    {
      keyword: "Given",
      padding: 4,
    },
    {
      keyword: "When",
      padding: 5,
    },
    {
      keyword: "Then",
      padding: 5,
    },
    {
      keyword: "And",
      padding: 6,
    },
    {
      keyword: "But",
      padding: 6,
    },
    {
      keyword: "Backgroud",
      padding: 2,
    },
    {
      keyword: "Action",
      padding: 2,
    },
    {
      keyword: "Examples:",
      padding: 4,
    },
    {
      keyword: "#",
      padding: 0,
    },
  ],
  formatOnSave: false,
  fixtureLineBreak: true,
  consecutiveBlankLinesToOne: false,
};

//add the following line
const program = new Command();

console.log(figlet.textSync("Gerkiner"));

program
  .version("1.0.0")
  .description("CLI to format Gherkin feature files")
  .option("-v", "Verbose")
  .parse(process.argv);

// const options = program.opts();

// if (options.v) {
//   console.log("VERBOSE");
// }

let lines = fs.readFileSync(program.args[0], "utf-8").split("\n");

let eb = new TextEditorEdit(new CliTextEditorEdit(lines));
buildDocument(lines, eb, settings);

fs.writeFileSync(program.args[0], lines.join("\n"));