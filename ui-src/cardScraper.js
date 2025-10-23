const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Load your JSON file
const data = JSON.parse(fs.readFileSync("./data/cards_malie.json", "utf8"));

// Base output directory
const outBase = "./images_webp";
// const frontDir = path.join(outBase, "front");
const foilDir = path.join(outBase, "foil");
const etchDir = path.join(outBase, "etch");

// Ensure directories exist
for (const dir of [outBase, foilDir, etchDir]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function convertAndSave(url, outputPath) {
  try {
    console.log(`Downloading ${url}...`);
    const imgBuffer = await downloadImage(url);
    await sharp(imgBuffer)
      .webp({ quality: 70 })
      .toFile(outputPath);
    console.log(`✅ Saved ${outputPath}`);
  } catch (err) {
    console.error(`❌ Error processing ${url}: ${err.message}`);
  }
}

async function processCard(card) {
  const { images, ext } = card;
  if (!images?.tcgl?.png) return;

  // const frontUrl = images.tcgl.png.front;
  const foilUrl = images.tcgl.png.foil;
  const etchUrl = images.tcgl.png.etch;
  const fileName = ext.tcgl.cardID;

  const tasks = [];
  // if (frontUrl) {
  //   const frontPath = path.join(frontDir, `${fileName}.webp`);
  //   tasks.push(convertAndSave(frontUrl, frontPath));
  // }
  if (foilUrl) {
    const foilPath = path.join(foilDir, `${fileName}.webp`);
    tasks.push(convertAndSave(foilUrl, foilPath));
  }
  if (etchUrl) {
    const etchPath = path.join(etchDir, `${fileName}.webp`);
    tasks.push(convertAndSave(etchUrl, etchPath));
  }

  await Promise.all(tasks);
}

async function main() {
  for (const card of data) {
    await processCard(card);
  }
  console.log("🎉 Done converting all foil/etch images!");
}

main().catch(console.error);