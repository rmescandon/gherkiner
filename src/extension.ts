// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { SettingsProvider, ISettings } from "./settings";

import { File, Strings } from "./utils";
import { Line, LineFactory, Lines } from "./line";
import { Table, TableLine } from "./table";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // formatter implemented using API
  vscode.languages.registerDocumentFormattingEditProvider("feature", {
    provideDocumentFormattingEdits(
      document: vscode.TextDocument
    ): vscode.TextEdit[] {
      // execute the format directly because it was already implemented that way.
      // The alternative is using the 'document' param and returning an array with
      // the edit operations to achieve. Something like:
      //
      //  const firstLine = document.lineAt(0);
      //	if (firstLine.text !== '42') {
      //		return [vscode.TextEdit.insert(firstLine.range.start, '42\n')];
      //	}
      formatFeature();
      return [];
    },
  });

  // when formatOnSave is set, enable the formatting when saving the document
  const settings = new SettingsProvider().settings;
  if (settings.formatOnSave) {
    context.subscriptions.push(
      vscode.workspace.onWillSaveTextDocument(formatFeature)
    );
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}

function formatFeature() {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return null;
  }

  if (!File.isFeature(editor.document.uri.toString())) {
    return null;
  }

  const settings = new SettingsProvider().settings;

  editor.edit((editBuilder) => {
    buildDocument(editor.document, editBuilder, settings);
  });
}

function buildDocument(
  doc: vscode.TextDocument,
  editBuilder: vscode.TextEditorEdit,
  settings: ISettings
) {
  // tagLines is an array of consecutive lines starting with a tag. When the next line to the last with tag
  // switches to a padded line, all them take the same padding. When that next line is not padded, the array
  // is is emptied
  let tagLines: Line[] = [];

  // tab represents a table. It is populated with the header and rows of the table whilst identified on the
  // document during consecutive lines.
  // First line is considered the header of the table and calculates the number of row cells, the headers, and
  // initialices the length of every cell.
  // Second and next lines are validated against number of cells and the length of every cell is now recalculated.
  // When reached a line not starting with |, if everything is valid, all table rows are updated
  let tab = new Table();
  // padding for the table is taken from paddingTable setting.
  // When not set paddingTable it is taken from paddingDefault.
  // and finally not set (set to -1) if none of the above is set
  let tabPadding =
    settings.paddingTable > 0
      ? settings.paddingTable
      : settings.paddingDefault > 0
      ? settings.paddingDefault
      : -1;

  let emptyLines = new Lines();
  for (let pos = 0; pos < doc.lineCount; pos++) {
    let line = LineFactory.create(pos, doc);

    // address table lines
    if (tabPadding >= 0) {
      if (line.isTableLine()) {
        if (tab.empty()) {
          tab = new Table();
        }
        tab.push(new TableLine(line));
        continue;
      }

      if (!tab.empty() && tab.valid) {
        const paddingStr = settings.paddingSymbol.repeat(tabPadding);
        tab.update(paddingStr, editBuilder);
        tab.reset();
      }
    }

    // if empty line, reset tagLines array, draw table if not empty and continue
    if (line.isEmpty()) {
      tagLines = [];

      // treat the blank line according to the settings, either removing its padding or leaving one
      if (settings.consecutiveBlankLinesToOne) {
        emptyLines.append(line);
      } else {
        line.updatePadding("", editBuilder);
      }
      continue;
    }

    // if not empty line and list of empty lines is not empty, reduce all of them to a single one
    if (!emptyLines.isEmpty()) {
      emptyLines.updateContent("", editBuilder);
      emptyLines.reset();
    }

    // if current line starts with @, append its number of line to the array of tag lines until finding
    // an empty line or a line matching any defined keyword
    if (line.isTagLine()) {
      tagLines.push(line);
      continue;
    }

    // find a a keyword that matches the line initial string
    let p = settings.paddings.find((padding) => {
      if (padding) {
        if (line.isKeywordLine(padding.keyword)) {
          // normalize the line content to have exactly one space after the keyword
          line.updateContent(
            Strings.normalizeToJustOneSpaceAfterPrefix(line.content, padding.keyword),
            editBuilder,
          );
          return padding;
        }
      }
      return undefined;
    });

    // use default padding when not found a keywork padding
    let padding = settings.paddingDefault;
    if (p) {
      padding = p.padding;
    }

    // skip line if not found a either a keyword or a default padding
    if (padding === -1) {
      continue;
    }

    // when found a padding to apply, build the padding string and update the line
    const paddingStr = settings.paddingSymbol.repeat(padding);
    line.updatePadding(paddingStr, editBuilder);

    // update any cumulated tag lines and reset them
    tagLines.forEach((line) => line.updatePadding(paddingStr, editBuilder));

    if (settings.fixtureLineBreak) {
      // insert a line break just before any @fixture found in tag line that is not at the beginning
      tagLines.forEach((line) =>
        line.updateContent(
          line.content.replace(
            /[^^]\@fixture/gi,
            "\r\n" + paddingStr + "@fixture"
          ),
          editBuilder
        )
      );
    }

    tagLines = [];
  }
}
