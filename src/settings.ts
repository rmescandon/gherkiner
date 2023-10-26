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
    fixtureLineBreak: boolean
    consecutiveBlankLinesToOne: boolean
}

export class SettingsProvider {

    get settings(): ISettings {

        const cfg = vscode.workspace.getConfiguration();

        const paddingSymbol = this.readPaddingSymbol(cfg);
        const paddingDefault = this.readPaddingDefault(cfg);
        const paddingTable = this.readPaddingTable(cfg);
        const paddings = this.readPaddings(cfg);
        const formatOnSave = this.readFormatOnSave(cfg);
        const fixtureLineBreak = this.readFixtureLineBreak(cfg);
        const consecutiveBlankLinesToOne = this.readConsecutiveBlankLinesToOne(cfg);

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

    private readFixtureLineBreak(cfg: vscode.WorkspaceConfiguration): boolean {
        return cfg.get<boolean>('gherkiner.fixtureLineBreak') ?? false;
    }

    private readConsecutiveBlankLinesToOne(cfg: vscode.WorkspaceConfiguration): boolean {
        return cfg.get<boolean>('gherkiner.consecutiveBlankLinesToOne') ?? false;
    }
}
