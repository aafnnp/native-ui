import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// 检查 Astro 基础文件是否已初始化
const requiredFiles = [
  "astro.config.mjs",
  "src/env.d.ts",
  "src/pages/index.astro",
];
const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const missingFiles = requiredFiles.filter((filePath) => {
  const absolutePath = resolve(docsRootDir, filePath);
  return !existsSync(absolutePath);
});

if (missingFiles.length > 0) {
  console.error("E_ASTRO_NOT_BOOTSTRAPPED");
  process.exit(1);
}

console.log("OK_ASTRO_BOOTSTRAPPED");
process.exit(0);
