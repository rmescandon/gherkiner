export class Strings {
    static split(str: string, sep: string): string[] {
        return str.trim().split(sep).filter(e => e).map(token => token.trim());
    }
}

export class File {
    static isFeature(filepath: string): boolean {
        return filepath.endsWith('.feature');
    }
}

