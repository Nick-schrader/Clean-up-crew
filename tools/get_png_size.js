import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, '..', 'public', 'assets', 'donut.png');
if (!fs.existsSync(file)) {
  console.error('File not found:', file);
  process.exit(2);
}
const buf = fs.readFileSync(file);
const w = buf.readUInt32BE(16);
const h = buf.readUInt32BE(20);
console.log(`${file} -> ${w}x${h}`);
