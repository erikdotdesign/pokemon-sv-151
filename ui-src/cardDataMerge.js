const fs = require('fs');
const path = require('path');

// Load both JSON files
const tcgData = JSON.parse(fs.readFileSync("./data/cards_tcg.json", "utf8"));
const malieData = JSON.parse(fs.readFileSync("./data/cards_malie.json", "utf8"));

// Image dirs
const foilDir = "./images_webp/foil";
const etchDir = "./images_webp/etch";

// TCG image map
const tcgImageMap = new Map();
for (const card of tcgData) {
  const key = Number(card.number);
  const images = card.images;
  if (images.large) {
    tcgImageMap.set(key, images.large);
  }
}

// Merge data
for (const card of malieData) {
  const { collector_number, ext } = card;
  const cardId = ext.tcgl.cardID;
  const frontImage = tcgImageMap.get(collector_number.numeric);
  const foilPath = path.join(foilDir, `${cardId}.webp`);
  const etchPath = path.join(etchDir, `${cardId}.webp`);
  const oldImages = card.images.tcgl.png;
  const newImages = { front: frontImage };
  if (oldImages.foil) newImages.foil = foilPath;
  if (oldImages.etch) newImages.etch = etchPath;
  card.images = newImages;
}

// Write merged file
fs.writeFileSync("./data/cards_merged.json", JSON.stringify(malieData, null, 2));
console.log("🎉 Merged data written to cards_merged.json");