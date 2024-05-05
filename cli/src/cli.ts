import figlet from "figlet";
import path from "path";
import { Command } from "commander";
import { TextEditorEdit, Range } from "../../shared/out/editor";
import { buildDocument } from "../../shared/out/core";
import { Settings, Padding } from "../../shared/out/settings";
import * as fs from "fs";
import { exit } from "process";

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
/*
A modelic settings.json file used for a basic configuration of the formatter could be like:
{
 "padding": {
    "symbol": "space",
    "default": 4,
    "table": 10
  },
  "paddings": [
    {
        "keyword": "Feature",
        "padding": 0
    },
    {
        "keyword": "Scenario Outline",
        "padding": 2
    },
    {
        "keyword": "Scenario",
        "padding": 2
    },
    {
        "keyword": "Given",
        "padding": 4
    },
    {
        "keyword": "When",
        "padding": 5
    },
    {
        "keyword": "Then",
        "padding": 5
    },
    {
        "keyword": "And",
        "padding": 6
    },
    {
        "keyword": "But",
        "padding": 6
    },
    {
        "keyword": "Backgroud",
        "padding": 2
    },
    {
        "keyword": "Action",
        "padding": 2
    },
    {
        "keyword": "Examples:",
        "padding": 4
    },
    {
        "keyword": "#",
        "padding": 0
    }
  ],
  "formatOnSave": false,
  "fixtureLineBreak": true,
  "consecutiveBlankLinesToOne": false
}
*/
export class SettingsProvider {
  get settings(): Settings {
    const paddingSymbol = config.get('padding').get('symbol') === 'tab' ? '\t' : ' ';
    const paddingDefault = config.get('padding').get('default') ?? -1;
    const paddingTable = config.get('padding').get('table') ?? -1;
    const paddings = config.get('paddings') ?? [];
    const formatOnSave = config.get('formatOnSave') ?? false;
    const fixtureLineBreak = config.get('fixtureLineBreak') ?? false;
    const consecutiveBlankLinesToOne = config.get('consecutiveBlankLinesToOne') ?? false;
  
    return {
      paddingSymbol,
      paddingDefault,
      paddingTable,
      paddings,
      formatOnSave,
      fixtureLineBreak,
      consecutiveBlankLinesToOne,
    };
  }
}

//add the following line
const program = new Command();

program
  .version("1.0.0")
  .description("CLI to format Gherkin feature files")
  .option("-v", "verbose execution")
  .option("-s, --settings <filepath>", "settings file with the rules to use for the formatter")
  .parse(process.argv);

const options = program.opts();
if (options.help) {
  program.help();
  exit();
}

if (options.v) {
  console.log(figlet.textSync("Gerkiner"));
}

if (options.settings) {
  let settingsFilePath = path.resolve(options.settings)
  process.env['NODE_CONFIG'] = fs.readFileSync(settingsFilePath, "utf-8");
}

// import after evaluating the optional --settings  
import config from "config";

let lines = fs.readFileSync(program.args[0], "utf-8").split("\n");

let eb = new TextEditorEdit(new CliTextEditorEdit(lines));
buildDocument(lines, eb, new SettingsProvider().settings);

fs.writeFileSync(program.args[0], lines.join("\n"));

if (options.v) {
  console.log("formatted file: " + program.args[0]);
}
