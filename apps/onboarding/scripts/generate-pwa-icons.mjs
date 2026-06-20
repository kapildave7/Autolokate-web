/**
 * Generates PWA raster icons from the approved Autolokate mark PNG.
 * Source of truth: packages/brand/src/assets/autolokate_dark.png
 *
 * On #0A0A0A launcher backgrounds, matches in-app AlLogo/AlBrandMark
 * variant="dark" (CSS: brightness(0) invert(1)).
 *
 * Run: node scripts/generate-pwa-icons.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const brandMark = path.resolve(rootDir, '../../packages/brand/src/assets/autolokate_dark.png');
const iconsDir = path.resolve(rootDir, 'public/icons');
const publicDir = path.resolve(rootDir, 'public');

/** Matches manifest theme_color / background_color and in-app dark canvas. */
const BRAND_BG = { r: 10, g: 10, b: 10, alpha: 1 };

/** Approved mark dimensions — packages/brand/src/types.ts LOGO_VIEW_BOX */
const MARK_WIDTH = 164;
const MARK_HEIGHT = 146;

/** Android adaptive icon maskable safe zone (min inner circle = 80% diameter). */
const MASKABLE_SAFE_RATIO = 0.8;

/** Standard icons — 12.5% total inset (6.25% per edge). */
const ANY_SAFE_RATIO = 0.875;

/**
 * Match AlLogo / AlBrandMark variant="dark":
 *   filter: brightness(0) invert(1)
 * Preserves alpha; visible pixels become white for contrast on dark bg.
 */
async function loadDarkVariantMark() {
  const { data, info } = await sharp(brandMark).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] > 0) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    }
  }

  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  }).png();
}

function fitBoxSize(canvasSize, safeRatio) {
  return Math.round(canvasSize * safeRatio);
}

async function renderMarkLayer(boxSize) {
  const mark = await loadDarkVariantMark();
  return mark
    .resize(boxSize, boxSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();
}

async function renderSquareIcon(canvasSize, safeRatio, outPath) {
  const boxSize = fitBoxSize(canvasSize, safeRatio);
  const markLayer = await renderMarkLayer(boxSize);
  const markMeta = await sharp(markLayer).metadata();
  const left = Math.round((canvasSize - (markMeta.width ?? MARK_WIDTH)) / 2);
  const top = Math.round((canvasSize - (markMeta.height ?? MARK_HEIGHT)) / 2);

  await sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: BRAND_BG,
    },
  })
    .composite([{ input: markLayer, left, top }])
    .png()
    .toFile(outPath);

  return {
    canvasSize,
    safeRatio,
    boxSize,
    markWidth: markMeta.width,
    markHeight: markMeta.height,
    offsetLeft: left,
    offsetTop: top,
  };
}

async function renderFavicon(size, outPath) {
  const mark = await loadDarkVariantMark();
  await mark
    .resize(size, size, {
      fit: 'contain',
      background: BRAND_BG,
    })
    .png()
    .toFile(outPath);
}

async function main() {
  fs.mkdirSync(iconsDir, { recursive: true });

  const results = {
    source: brandMark,
    markDimensions: `${MARK_WIDTH}×${MARK_HEIGHT}`,
    displayVariant: 'dark (brightness(0) invert(1))',
    icons: [],
  };

  results.icons.push(
    await renderSquareIcon(192, ANY_SAFE_RATIO, path.join(iconsDir, 'icon-192.png')),
  );
  results.icons.push(
    await renderSquareIcon(512, ANY_SAFE_RATIO, path.join(iconsDir, 'icon-512.png')),
  );
  results.icons.push(
    await renderSquareIcon(192, MASKABLE_SAFE_RATIO, path.join(iconsDir, 'icon-192-maskable.png')),
  );
  results.icons.push(
    await renderSquareIcon(512, MASKABLE_SAFE_RATIO, path.join(iconsDir, 'icon-512-maskable.png')),
  );
  results.icons.push(
    await renderSquareIcon(180, ANY_SAFE_RATIO, path.join(publicDir, 'apple-touch-icon.png')),
  );
  // Convenience copy for tooling that expects icons/ path
  await fs.promises.copyFile(
    path.join(publicDir, 'apple-touch-icon.png'),
    path.join(iconsDir, 'apple-touch-icon.png'),
  );

  await renderFavicon(32, path.join(publicDir, 'favicon-32.png'));
  await sharp(path.join(publicDir, 'favicon-32.png'))
    .resize(16, 16, { fit: 'contain', background: BRAND_BG })
    .toFile(path.join(publicDir, 'favicon-16.png'));
  await sharp(path.join(publicDir, 'favicon-32.png')).toFile(path.join(publicDir, 'favicon.ico'));

  console.log('PWA icons generated from approved mark PNG (dark variant)');
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
