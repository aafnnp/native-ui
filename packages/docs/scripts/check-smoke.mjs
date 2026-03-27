import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 核心页面 smoke 检查所需文件
 */
const corePagesRequiredFiles = [
  "src/content.config.ts",
  "src/content/docs/index.mdx",
  "src/content/docs/guide/getting-started.mdx",
  "src/content/docs/guide/theme.mdx",
  "src/content/docs/guide/migration.mdx",
];

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const scopeArg = args.find((arg) => arg.startsWith("--scope"));
const scope = scopeArg?.includes("=")
  ? scopeArg.split("=")[1]
  : args[args.indexOf("--scope") + 1] ?? "core-pages";

if (scope !== "core-pages") {
  console.error("E_SMOKE_SCOPE_UNSUPPORTED");
  process.exit(1);
}

const missingFiles = corePagesRequiredFiles.filter((filePath) => {
  const absolutePath = resolve(docsRootDir, filePath);
  return !existsSync(absolutePath);
});

if (missingFiles.length > 0) {
  console.error("E_SMOKE_CORE_PAGES_MISSING");
  process.exit(1);
}

console.log("OK_SMOKE_CORE_PAGES");
process.exit(0);
