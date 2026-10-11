// Generates the icon and social-preview images in public/ from SVG sources.
// Run with `npm run images` after changing public/favicon.svg or the preview text below,
// then commit the results. Run it on Windows: the preview uses the Segoe UI font.
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const favicon = 'public/favicon.svg';
const render = (input, size) => sharp(input, { density: 600 }).resize(size, size).png().toBuffer();

// Apple touch icon: used when someone saves the site to a phone's home screen.
await writeFile('public/apple-touch-icon.png', await render(favicon, 180));

// favicon.ico: fallback for browsers and tools that don't read SVG icons.
// An .ico file is a small header plus a directory of images; modern ones embed PNGs directly.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((size) => render(favicon, size)));
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
  const entry = 6 + 16 * i;
  header.writeUInt8(icoSizes[i], entry); // width
  header.writeUInt8(icoSizes[i], entry + 1); // height
  header.writeUInt16LE(1, entry + 4); // colour planes
  header.writeUInt16LE(32, entry + 6); // bits per pixel
  header.writeUInt32LE(png.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += png.length;
});
await writeFile('public/favicon.ico', Buffer.concat([header, ...pngs]));

// Social preview (Open Graph) image: the card shown when the link is shared on LinkedIn, WhatsApp etc.
// 1200x630 is the size every major platform expects.
const font = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0e1116"/>
  <rect x="0" y="0" width="12" height="630" fill="#2dd4bf"/>
  <g transform="translate(96 96) scale(1.5)">
    <rect width="64" height="64" rx="14" fill="#161b22" stroke="#262c36" stroke-width="1.5"/>
    <g fill="none" stroke="#2dd4bf" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 45V19l16 26V19"/>
      <path d="M53.6 22.6a12 13 0 1 0 0 18.8"/>
    </g>
  </g>
  <text x="96" y="330" font-family="${font}" font-size="84" font-weight="700" fill="#e6edf3">Nathanael Cammay</text>
  <text x="96" y="400" font-family="${font}" font-size="44" fill="#2dd4bf">Software Developer</text>
  <text x="96" y="470" font-family="${font}" font-size="32" fill="#9aa4b2">C#/.NET · SQL Server · JavaScript · React</text>
  <text x="96" y="560" font-family="${font}" font-size="30" fill="#9aa4b2">nathanaelcammay.com</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile('public/og-image.png');

console.log('Generated apple-touch-icon.png, favicon.ico and og-image.png in public/');
