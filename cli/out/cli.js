"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliTextEditorEdit = void 0;
const figlet_1 = __importDefault(require("figlet"));
const commander_1 = require("commander");
const editor_1 = require("../../shared/out/editor");
const core_1 = require("../../shared/out/core");
const fs = __importStar(require("fs"));
function replaceRange(s, start, end, substitute) {
    return s.substring(0, start) + substitute + s.substring(end);
}
class CliTextEditorEdit {
    constructor(lines) {
        this.lines = [];
        this.lines = lines;
    }
    replace(range, value) {
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
        this.lines[line] = replaceRange(this.lines[line], range.start.character, range.end.character, value);
    }
}
exports.CliTextEditorEdit = CliTextEditorEdit;
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
const program = new commander_1.Command();
program
    .version("1.0.0")
    .description("CLI to format Gherkin feature files")
    .option("-v", "Verbose")
    .parse(process.argv);
const options = program.opts();
if (options.v) {
    console.log(figlet_1.default.textSync("Gerkiner"));
}
let lines = fs.readFileSync(program.args[0], "utf-8").split("\n");
let eb = new editor_1.TextEditorEdit(new CliTextEditorEdit(lines));
(0, core_1.buildDocument)(lines, eb, settings);
fs.writeFileSync(program.args[0], lines.join("\n"));
if (options.v) {
    console.log("formatted file: " + program.args[0]);
}
