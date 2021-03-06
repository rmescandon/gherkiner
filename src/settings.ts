import * as vscode from 'vscode';

export interface IPadding {
    keyword: string
    padding: number
}

export interface ISettings {
    paddingSymbol: string
    paddingDefault: number
    paddingTable: number
    paddings: IPadding[]
    formatOnSave: boolean
}

export class SettingsProvider {

    get settings(): ISettings {

        const cfg = vscode.workspace.getConfiguration();

        const paddingSymbol = this.readPaddingSymbol(cfg);
        const paddingDefault = this.readPaddingDefault(cfg);
        const paddingTable = this.readPaddingTable(cfg);
        const paddings = this.readPaddings(cfg);
        const formatOnSave = this.readFormatOnSave(cfg);

        return {
            paddingSymbol,
            paddingDefault,
            paddingTable,
            paddings,
            formatOnSave,
        };
    }

    private readPaddingSymbol(cfg: vscode.WorkspaceConfiguration): string {
        return cfg.get<string>('gherkiner.padding.symbol') === 'tab' ? '\t' : ' ';
    }

    private readPaddingDefault(cfg: vscode.WorkspaceConfiguration): number {
        return cfg.get<number>('gherkiner.padding.default') ?? -1;
    }

    private readPaddingTable(cfg: vscode.WorkspaceConfiguration): number {
        return cfg.get<number>('gherkiner.padding.table') ?? -1;
    }

    private readPaddings(cfg: vscode.WorkspaceConfiguration): IPadding[]{
        return cfg.get<IPadding[]>('gherkiner.paddings') ?? [];
    }

    private readFormatOnSave(cfg: vscode.WorkspaceConfiguration): boolean {
        return cfg.get<boolean>('gherkiner.formatOnSave') ?? false;
    }
}