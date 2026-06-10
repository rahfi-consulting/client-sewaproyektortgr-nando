import { readFile } from "node:fs/promises";
import path from "node:path";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default async function Icon() {
  const filePath = path.join(process.cwd(), "public", "light-logo.png");
  const image = await readFile(filePath);

  return new Response(image, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
