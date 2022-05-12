export class Strings {
    static split(str: string, sep: string): string[] {
        return str.trim().split(sep).map(token => token.trim());
    }

    // strip removes first and last element in an array if array has at least two elements
    static strip(arr: string[]): string[] {
        if (arr.length > 2) {
            return arr.slice(1, arr.length-1);
        }
        return arr;
    }
}

export class File {
    static isFeature(filepath: string): boolean {
        return filepath.endsWith('.feature');
    }
}


export class Separators {
    static validBoundaries(str: string): boolean {
        str = str.trim();
        if (str.charAt(0) !== '|') {
            return false;
        }

        if (str.charAt(str.length - 1) !== '|') {
            return false;
        }

        return true;
    }

    static count(str: string): number {
        return (str.match(/\|/g) || []).length;
    }

}