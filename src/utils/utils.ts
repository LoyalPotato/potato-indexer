export function checkHeaderSize(s: string, min: number, max: number): boolean {
    let i = 0;
    while (s[i] === "#") {
        ++i;
    }

    return i >= min && i <= max;
}
export function concatLines(lines: string[], isPostContent = false): string {
    let s = "";
    for (let i = 0; i < lines.length; ++i) {
        s += lines[i];
        if (!isPostContent || i < lines.length - 1) {
            s += "\n";
        }
    }

    return s;
}
