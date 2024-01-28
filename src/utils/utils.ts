export function checkHeaderSize(s: string, min: number, max: number): boolean {
    let i = 0;
    while (s[i] === "#") {
        ++i;
    }

    return i >= min && i <= max;
}

export function generateLink(header: string, tabsOverride?: string): string {
    let tabs = "";
    let h = "";
    let headerTitle = "";
    for (let i = 0; i < header.length; ++i) {
        const char = header[i];
        if (char === "#") {
            tabs += "\t";
            h += "#";
        } else {
            headerTitle = header.substring(i);
            break;
        }
    }

    headerTitle = headerTitle.trim();
    tabs = tabs.slice(0, -1);
    if (tabsOverride != null) tabs = tabsOverride;

    return `${tabs}- [${headerTitle}](${h}${headerTitle.replaceAll(
        " ",
        "%20",
    )})`;
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
