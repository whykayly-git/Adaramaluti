import sharp from "sharp";
import path from "path";

const logo = path.resolve("public/images/logo.png");

async function circleIcon(size) {
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#fff"/></svg>`
  );
  const resized = await sharp(logo)
    .resize(size, size)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  return sharp({
    create: { width: size, height: size, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } },
  })
    .composite([{ input: resized }])
    .png()
    .toBuffer();
}

const icon32 = await circleIcon(32);
await sharp(icon32).toFile(path.resolve("app/icon.png"));

const icon180 = await circleIcon(180);
await sharp(icon180).toFile(path.resolve("app/apple-icon.png"));

const favicon16 = await circleIcon(16);
await sharp(favicon16).toFile(path.resolve("public/favicon-16.png"));

console.log("icons generated");
