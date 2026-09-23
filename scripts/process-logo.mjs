import sharp from "sharp";
import path from "path";

const srcPath = path.resolve("public/images/logo-source.jpeg");
const outPath = path.resolve("public/images/logo.png");

const img = sharp(srcPath);
const meta = await img.metadata();
console.log("source size", meta.width, meta.height);

// Background is a textured stone photo, not a flat color, so it can't be
// auto-trimmed/keyed out. Keep the full square, just resize + convert to PNG.
// The Logo component renders this inside a white rounded card everywhere,
// so the texture reads as an intentional emblem/seal rather than a stray bg.
await sharp(srcPath).resize(800, 800).png().toFile(outPath);

console.log("wrote", outPath);
