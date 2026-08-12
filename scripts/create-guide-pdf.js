const fs = require('fs');
const path = require('path');

const source = fs.readFileSync(path.join(__dirname, '..', 'docs', 'LINKFLOW-GUIDE.md'), 'utf8');
const lines = [];
for (const raw of source.split(/\r?\n/)) {
  const line = raw.replace(/^#{1,3}\s*/, '').replace(/^[-*]\s+/, '• ');
  if (line.startsWith('```')) { lines.push(''); continue; }
  if (!line) { lines.push(''); continue; }
  const width = raw.startsWith('#') ? 72 : 96;
  let text = line;
  while (text.length > width) {
    const breakAt = text.lastIndexOf(' ', width);
    const cut = breakAt > 20 ? breakAt : width;
    lines.push(text.slice(0, cut)); text = text.slice(cut).trimStart();
  }
  lines.push(text);
}

const pageWidth = 595; const pageHeight = 842; const margin = 48; const lineHeight = 14; const usable = pageHeight - 90;
const pages = []; let page = [];
for (const line of lines) { if (page.length * lineHeight > usable) { pages.push(page); page = []; } page.push(line); }
if (page.length) pages.push(page);

function escape(text) { return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }
const objects = [];
objects.push('<< /Type /Catalog /Pages 2 0 R >>');
objects.push('<< /Type /Pages /Kids [' + pages.map((_, i) => `${5 + i * 2} 0 R`).join(' ') + `] /Count ${pages.length} >>`);
objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
pages.forEach((content, index) => {
  const commands = ['BT', `/F1 10 Tf`, `1 0 0 1 ${margin} ${pageHeight - 55} Tm`];
  content.forEach((line, lineIndex) => {
    const heading = index === 0 && lineIndex === 0 || /^\d+\.\s/.test(line);
    commands.push(`/F${heading ? 2 : 1} ${heading ? 16 : 10} Tf`);
    commands.push(`0 -${heading ? 22 : lineHeight} Td`);
    commands.push(`(${escape(line)}) Tj`);
  });
  commands.push('ET');
  objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${6 + index * 2} 0 R >>`);
  objects.push(`<< /Length ${Buffer.byteLength(commands.join('\n'))} >>\nstream\n${commands.join('\n')}\nendstream`);
});
let pdf = '%PDF-1.4\n'; const offsets = [0];
objects.forEach((object, index) => { offsets[index + 1] = Buffer.byteLength(pdf); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
const xref = Buffer.byteLength(pdf); pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (let i = 1; i <= objects.length; i++) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
const output = path.join(__dirname, '..', 'docs', 'LinkFlow-Guide.pdf');
fs.writeFileSync(output, pdf);
console.log(`Created ${output}`);
