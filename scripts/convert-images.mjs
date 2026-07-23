import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const sourceDir = path.join(rootDir, 'src', 'assets', 'img');
const outputDir = path.join(rootDir, 'public', 'img');

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff', '.tif'];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyImageToPublic(filePath) {
  const relativePath = path.relative(sourceDir, filePath);
  const targetPath = path.join(outputDir, relativePath);
  const targetDir = path.dirname(targetPath);
  await ensureDir(targetDir);

  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.webp') {
    await fs.copyFile(filePath, targetPath);
    return;
  }

  const outputFile = path.join(targetDir, `${path.basename(filePath, ext)}.webp`);
  await sharp(filePath)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputFile);
}

async function main() {
  await ensureDir(outputDir);
  const files = await glob(`${sourceDir}/**/*`, {
    nodir: true,
    windowsPathsNoEscape: true,
  });

  const images = files.filter((file) => imageExtensions.includes(path.extname(file).toLowerCase()));

  for (const file of images) {
    await copyImageToPublic(file);
  }
}

main().catch((error) => {
  console.error('Image conversion failed:', error);
  process.exit(1);
});
