const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = "./images";
const outputDir = "./images_webp";

// Default conversion options
const defaultOptions = { quality: 80 };

// Optional per-directory overrides
const conversionMap = {
  foil: { quality: 80 },
  etch: { quality: 10 }
};

// Ensure directory exists
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Recursively walk through directory
function walkDir(dir, callback) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

// Determine conversion options based on parent folder
function getOptionsForPath(filePath) {
  const parts = filePath.split(path.sep);
  for (const part of parts) {
    if (conversionMap[part]) return conversionMap[part];
  }
  return defaultOptions;
}

async function convertImage(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) return;

  const relPath = path.relative(inputDir, inputPath);
  const outputPath = path.join(
    outputDir,
    relPath.replace(/\.(png|jpe?g)$/i, ".webp")
  );

  ensureDir(path.dirname(outputPath));

  const options = getOptionsForPath(inputPath);

  try {
    let pipeline = sharp(inputPath);

    if (options.width || options.height) {
      pipeline = pipeline.resize(options.width, options.height);
    }

    await pipeline.webp({ quality: options.quality }).toFile(outputPath);

    console.log(
      `✅ Converted: ${relPath} (quality=${options.quality}${
        options.width || options.height
          ? `, resize=${options.width || "auto"}x${options.height || "auto"}`
          : ""
      })`
    );
  } catch (err) {
    console.error(`❌ Failed to convert ${inputPath}: ${err.message}`);
  }
}

async function main() {
  ensureDir(outputDir);

  const tasks = [];
  walkDir(inputDir, (filePath) => tasks.push(convertImage(filePath)));

  await Promise.all(tasks);
  console.log("🎉 All images converted to WebP!");
}

main().catch(console.error);