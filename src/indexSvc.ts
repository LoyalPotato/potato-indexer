export function generateIndex(content: string): string {
  if (!content || !content.trim()) {
    return "";
  }

  const lines = content.split("\n");
  let index = "\n## Content Index\n\n";
  const indexPos: number[] = [];
  let contents = "";

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (!line) continue;
    if (line.includes("## Content Index")) {
      console.log("index start", i);
      indexPos[0] = i;
    } else if (indexPos[0] != null && line.includes("- [")) {
      indexPos[1] = i;
      console.log("index val", i);
    } else if (line.startsWith("#")) {
      if (indexPos.length === 0) {
        console.log("no index start", i);
        indexPos[0] = i + 1;
      }
      contents += `${generateLink(line)}\n`;
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


/**
 * NOTE:
 * One improvement we can do is, if it's a selection, that the tabs are handled as if the first title is # and increments, since we're replacing it for tabs
 */
function generateLink(header: string): string {
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

  return `${tabs} - [${headerTitle}](${h}${headerTitle.replaceAll(" ", "%20")})`;
}
