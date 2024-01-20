export function checkHeaderSize(s: string, min: number, max: number): boolean {
    let i = 0;
    while (s[i] === "#") {
        ++i;
    }

    return i >= min && i <= max;
}
