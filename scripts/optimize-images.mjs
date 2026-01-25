#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const assetsDir = path.join(root, 'src', 'assets');
const quality = Number(process.env.IMG_QUALITY || 80);
const generateWebp = process.env.IMG_WEBP !== 'false';

const validExt = new Set(['.jpg', '.jpeg', '.png']);

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

async function optimizeImage(file) {
  const ext = path.extname(file).toLowerCase();
  if (!validExt.has(ext)) return null;

  const src = sharp(file, { failOn: 'none' });
  const metadata = await src.metadata();

  // Re-encode original (lossy) to shrink size
  const pipeline = ext === '.png'
    ? src.png({ quality, palette: true })
    : src.jpeg({ quality, mozjpeg: true, progressive: true });

  await pipeline.toFile(file + '.tmp');
  await fs.rename(file + '.tmp', file);

  let webpOut = null;
  if (generateWebp) {
    const webpPath = file.replace(ext, '.webp');
    await src.webp({ quality }).toFile(webpPath);
    webpOut = webpPath;
  }

  return {
    file,
    webp: webpOut,
    format: metadata.format,
    width: metadata.width,
    height: metadata.height
  };
}

async function main() {
  console.log(`Optimizing images under ${assetsDir} (quality=${quality}, webp=${generateWebp})`);
  const tasks = [];
  for await (const file of walk(assetsDir)) {
    tasks.push(file);
  }

  let optimized = 0;
  for (const file of tasks) {
    const res = await optimizeImage(file);
    if (res) {
      optimized += 1;
      console.log(`✓ ${path.relative(root, res.file)} (${res.width}x${res.height})${res.webp ? ' + webp' : ''}`);
    }
  }

  console.log(`Done. Optimized ${optimized} image(s).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
