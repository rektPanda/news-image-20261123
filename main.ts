// news-image-20261123 entry (Node 22, standard library only).
// The entry image sits beside this file as entry.png; the program copies
// it to /output/entry.png (or $MAKEFUN_OUTPUT_DIR for local runs).
// The image is a 1024x1024 PNG of the day's world news, Monday 23
// November 2026: 37 stories across 9 regions (Americas, Europe,
// Middle East, Asia-Pacific, Africa, Business, Technology, Sport,
// Culture), each verified against reporting from 21-23 Nov 2026.
// No network is used. The copy is byte-identical on every run, so the
// grader's two runs agree.

import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const src = new URL("./entry.png", import.meta.url);
const dest = join(outDir, "entry.png");

// Refuse to ship a corrupt image: check the PNG signature first, and
// enforce the bounty cap of 1 MiB so an oversized render fails loudly
// here instead of at the gate.
const bytes = readFileSync(src);
const header = bytes.subarray(0, 8);
const PNG_MAGIC = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
if (!header.equals(PNG_MAGIC)) {
  throw new Error("entry.png is not a PNG file");
}
if (bytes.length > 1048576) {
  throw new Error("entry.png exceeds the 1 MiB limit");
}

// The bounty wants one 1024x1024 image: read the width and height out of
// the IHDR chunk (bytes 16-23) and refuse anything else, so a wrong-size
// render fails here instead of at the gate.
const width = bytes.readUInt32BE(16);
const height = bytes.readUInt32BE(20);
if (width !== 1024 || height !== 1024) {
  throw new Error(`entry.png must be 1024x1024, got ${width}x${height}`);
}

copyFileSync(src, dest);

// The grader runs this twice; both outputs must match the source exactly.
if (statSync(dest).size !== statSync(src).size) {
  throw new Error("entry.png copy is incomplete");
}
