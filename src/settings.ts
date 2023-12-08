export interface Padding {
    keyword: string
    padding: number
}

export interface Settings {
    paddingSymbol: string
    paddingDefault: number
    paddingTable: number
    paddings: Padding[]
    formatOnSave: boolean
    fixtureLineBreak: boolean
    consecutiveBlankLinesToOne: boolean
}