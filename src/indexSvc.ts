export function generateIndex(content: string): string {
  if (!content || !content.trim()) {
    return "";
  }

  const lines = content.split("\n");
  let index = "\n## Content Index\n\n";
  const indexPos: number[] = [];
  let contents = "";
  let isNewIndex = false;

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (!line) continue;
    if (line.includes("## Content Index")) {
      indexPos[0] = i;
    } else if (!isNewIndex && line.includes("- [")) {
      indexPos[1] = i;
    } else if (line.startsWith("#")) {
      if (indexPos.length === 0) {
        isNewIndex = true;
        indexPos[0] = i + 1;
      }
      contents += `${generateLink(line, contents.length === 0 ? "" : undefined)}\n`;
    }
  }

  if (indexPos.length === 0) return content; // Doesn't have one title

  index += contents + "\n";

  const preIndexContent = lines.slice(0, indexPos[0]);

  const postContentStart = indexPos[1] != null ? indexPos[1] + 1 : indexPos[0];
  const postIndexContent = lines.slice(postContentStart);

  const newContent = preIndexContent.join("\n") + index + postIndexContent.join("\n");

  return newContent;
}


function generateLink(header: string, tabsOverride?: string): string {
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

  return `${tabs}- [${headerTitle}](${h}${headerTitle.replaceAll(" ", "%20")})`;
}
