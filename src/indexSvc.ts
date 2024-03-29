import { IndexerSettings } from "./settings/model";
import { checkHeaderSize, concatLines, generateLink } from "./utils/utils";

export function generateIndex(
    content: string,
    settings: IndexerSettings,
): string {
    if (!content || !content.trim()) {
        return "";
    }

    const lines = content.split("\n");
    let index = `${settings.headerTitleToLookFor}\n\n`;
    const indexPos: number[] = [];
    let contents = "";
    let indexFound = false;

    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        if (!line || !line.trim()) continue;

        if (line.includes(settings.headerTitleToLookFor)) {
            indexPos[0] = i;
            indexPos[1] = i;
            indexFound = true;
        } else if (indexFound && line.includes("- [")) {
            indexPos[1] = i;
        } else if (line.length > 0 && line[0] === "#") {
            if (indexPos.length === 0) {
                // NOTE: We haven't found the index so far, so assume it doesn't exist
                if (settings.insertAfterFirstHeader) {
                    indexPos[0] = i + 1;
                } else {
                    indexPos[0] = 0;
                }
            }

            if (checkHeaderSize(line, settings.minHeader, settings.maxHeader)) {
                contents += `${generateLink(
                    line,
                    contents.length === 0 ? "" : undefined,
                )}\n`;
            }
        }
    }

    if (indexPos.length === 0) return content; // Doesn't have one title

    index += contents;

    const preIndexContent = lines.slice(0, indexPos[0]);

    const postContentStart =
        indexPos[1] != null ? indexPos[1] + 1 : indexPos[0];
    const postIndexContent = lines.slice(postContentStart);

    if (preIndexContent.length > 0 && preIndexContent.at(-1) !== "") {
        index = "\n" + index;
    }

    if (postIndexContent.length > 0 && postIndexContent[0] !== "") {
        index = index + "\n";
    }

    const newContent =
        concatLines(preIndexContent) +
        index +
        concatLines(postIndexContent, true);

    return newContent;
}
