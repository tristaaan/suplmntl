export default function jsonToMarkdown(col) {
  let md = '';
  md += `# ${col.name}\n\n`;

  col.links.forEach((el) => {
    md += `## [${el.title}](${el.link})\n${el.description}\n\n`;
  });

  return md;
}
