import { open, readdir } from "node:fs/promises";
import path from "node:path";

const imageExtension = /\.(png|jpe?g|webp|gif|svg|ico|avif)$/i;
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

async function findImages(directory) {
  const images = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) images.push(...(await findImages(file)));
    else if (entry.isFile() && imageExtension.test(entry.name)) images.push(file);
  }
  return images;
}

const files = [...(await findImages("src/assets")), ...(await findImages("public"))];
const problems = [];
for (const file of files) {
  const handle = await open(file, "r");
  try {
    const buffer = Buffer.alloc(256);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    const header = buffer.subarray(0, bytesRead);
    if (header.toString("utf8").startsWith("version https://git-lfs.github.com/spec/v1")) {
      problems.push(`${file}: Git LFS pointer found; commit the actual image file.`);
    } else if (/\.png$/i.test(file) && !header.subarray(0, 8).equals(pngSignature)) {
      problems.push(`${file}: missing or invalid PNG image data.`);
    }
  } finally {
    await handle.close();
  }
}

if (problems.length) {
  console.error(
    "Image validation failed:\n" + problems.map((problem) => `- ${problem}`).join("\n"),
  );
  process.exitCode = 1;
} else {
  console.log(
    `Checked ${files.length} image assets: no Git LFS placeholders or invalid PNG headers.`,
  );
}
