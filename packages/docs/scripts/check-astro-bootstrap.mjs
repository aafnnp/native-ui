import { existsSync } from "node:fs";
import { resolve } from "node:path";

// 检查 Astro 基础文件是否已初始化
const requiredFiles = [
  "astro.config.mjs",
  "src/pages/index.astro",
];

const missingFiles = requiredFiles.filter((filePath) => {
  const absolutePath = resolve(process.cwd(), filePath);
  return !existsSync(absolutePath);
});

if (missingFiles.length > 0) {
  console.error("E_ASTRO_NOT_BOOTSTRAPPED");
  process.exit(1);
}

console.log("OK_ASTRO_BOOTSTRAPPED");
process.exit(0);
