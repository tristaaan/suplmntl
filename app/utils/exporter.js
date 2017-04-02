export function jsonToBlob(json) {

}

export function jsonToMarkdown(col) {
  var md = '';
  md += `# ${col.name}\n\n`;

  col.links.forEach((el) => {
    md += `## [${el.title}](${el.link})\n${el.description}\n\n`;
  });

  return md;
}
