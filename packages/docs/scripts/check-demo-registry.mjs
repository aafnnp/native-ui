import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const docsContentDir = resolve(docsRootDir, "src/content/docs");
const registryFilePath = resolve(docsRootDir, "src/demos/registry.ts");

/**
 * 递归收集目录下所有 mdx 文件
 * @param {string} rootDir
 * @returns {string[]}
 */
function collectMdxFiles(rootDir) {
  const stack = [rootDir];
  const files = [];

  while (stack.length > 0) {
    const currentDir = stack.pop();
    if (!currentDir) {
      continue;
    }

    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(absolutePath);
        continue;
      }
      if (extname(entry.name) === ".mdx") {
        files.push(absolutePath);
      }
    }
  }

  return files;
}

const registrySource = readFileSync(registryFilePath, "utf8");
const registeredIds = new Set(
  Array.from(registrySource.matchAll(/"([a-z0-9-]+)"\s*:/g), (match) => match[1]),
);

const demoBlockIdPattern = /<DemoBlock[^>]*\sid=(?:"([^"]+)"|'([^']+)')[^>]*\/?>/g;
const mdxFiles = collectMdxFiles(docsContentDir);
const missingIds = new Set();

for (const mdxFilePath of mdxFiles) {
  const content = readFileSync(mdxFilePath, "utf8");
  for (const match of content.matchAll(demoBlockIdPattern)) {
    const demoId = (match[1] ?? match[2] ?? "").trim();
    if (!demoId || registeredIds.has(demoId)) {
      continue;
    }
    missingIds.add(demoId);
  }
}

if (missingIds.size > 0) {
  for (const demoId of missingIds) {
    console.error(`E_DEMO_ID_UNREGISTERED ${demoId}`);
  }
  process.exit(1);
}

console.log("OK_DEMO_REGISTRY");
process.exit(0);
