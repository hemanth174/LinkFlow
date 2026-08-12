const fs = require('fs');
const path = require('path');

const sizes = [256, 128, 64, 48, 32];
const output = path.join(__dirname, '..', 'assets', 'linkflow.ico');

function pixel(size, x, y) {
  const radius = size * 0.25;
  const cx = Math.min(x, size - 1 - x);
  const cy = Math.min(y, size - 1 - y);
  const rounded = cx >= radius || cy >= radius || ((cx - radius) ** 2 + (cy - radius) ** 2 <= radius ** 2);
  if (!rounded) return [0, 0, 0, 0];
  const stroke = Math.max(4, size * 0.095);
  const arrow = size * 0.67;
  const start = size * 0.30;
  const end = size * 0.70;
  const line = (ax, ay, bx, by) => {
    const dx = bx - ax; const dy = by - ay;
    const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(x - (ax + t * dx), y - (ay + t * dy)) <= stroke / 2;
  };
  const mark = line(start, arrow, end, start) || line(end, start, end, arrow) || line(end, start, end - size * 0.28, start);
  return mark ? [106, 243, 200, 255] : [22, 24, 22, 255];
}

function dib(size) {
  const rowBytes = size * 4;
  const data = Buffer.alloc(40 + rowBytes * size + Math.ceil(size / 32) * 4 * size);
  data.writeUInt32LE(40, 0); data.writeInt32LE(size, 4); data.writeInt32LE(size * 2, 8);
  data.writeUInt16LE(1, 12); data.writeUInt16LE(32, 14); data.writeUInt32LE(0, 16);
  data.writeUInt32LE(rowBytes * size, 20);
  let offset = 40;
  for (let y = size - 1; y >= 0; y--) for (let x = 0; x < size; x++) {
    const [r, g, b, a] = pixel(size, x, y);
    data[offset++] = b; data[offset++] = g; data[offset++] = r; data[offset++] = a;
  }
  return data;
}

const images = sizes.map(dib);
const header = Buffer.alloc(6 + sizes.length * 16);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const base = 6 + index * 16; const size = sizes[index];
  header[base] = size === 256 ? 0 : size; header[base + 1] = size === 256 ? 0 : size;
  header[base + 2] = 0; header[base + 3] = 0; header.writeUInt16LE(1, base + 4); header.writeUInt16LE(32, base + 6);
  header.writeUInt32LE(image.length, base + 8); header.writeUInt32LE(offset, base + 12); offset += image.length;
});
fs.writeFileSync(output, Buffer.concat([header, ...images]));
console.log(`Created ${output}`);
