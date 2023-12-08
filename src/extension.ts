// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { SettingsProvider } from "./settings";

import { File } from "./utils";

import { buildDocument } from "./core";
import { TextEditorEdit, Range } from "./editor";

class ExtensionTextEditorEdit {
  editor: vscode.TextEditorEdit;

  constructor(editor: vscode.TextEditorEdit) {
    this.editor = editor;
  }

  replace(range: Range, value: string): void {
    this.editor.replace(
      new vscode.Range(
        new vscode.Position(range.start.line, range.start.character),
        new vscode.Position(range.end.line, range.end.character)
      ),
      value
    );
  }
}

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

  let lines: string[] = [];
  for (let pos = 0; pos < editor.document.lineCount; pos++) {
    lines.push(editor.document.lineAt(pos).text);
  }

  editor.edit((editBuilder) => {
    let eb = new TextEditorEdit(new ExtensionTextEditorEdit(editBuilder));
    buildDocument(lines, eb, settings);
  });
}
