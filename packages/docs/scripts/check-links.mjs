import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * 核心页面集合（Task 2 最小实现）
 */
const corePageEntries = [
  { file: "src/content/docs/index.mdx", route: "/" },
  {
    file: "src/content/docs/guide/getting-started.mdx",
    route: "/guide/getting-started",
  },
  { file: "src/content/docs/guide/theme.mdx", route: "/guide/theme" },
  { file: "src/content/docs/guide/migration.mdx", route: "/guide/migration" },
];

const batchAComponentEntries = [
  {
    file: "src/content/docs/guide/components/accordion.mdx",
    route: "/guide/components/accordion",
  },
  {
    file: "src/content/docs/guide/components/alert.mdx",
    route: "/guide/components/alert",
  },
  {
    file: "src/content/docs/guide/components/avatar.mdx",
    route: "/guide/components/avatar",
  },
  {
    file: "src/content/docs/guide/components/badge.mdx",
    route: "/guide/components/badge",
  },
  {
    file: "src/content/docs/guide/components/button.mdx",
    route: "/guide/components/button",
  },
];

const pageEntries = [...corePageEntries, ...batchAComponentEntries];
const knownRoutes = new Set(pageEntries.map((entry) => entry.route));
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

/**
 * 标准化链接目标，仅保留路径部分
 * @param {string} target
 * @returns {string}
 */
function normalizeTarget(target) {
  const withoutHash = target.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];
  return withoutQuery.endsWith("/") && withoutQuery.length > 1
    ? withoutQuery.slice(0, -1)
    : withoutQuery;
}

const brokenLinks = [];

for (const entry of pageEntries) {
  const absolutePath = resolve(docsRootDir, entry.file);
  const source = readFileSync(absolutePath, "utf8");

  for (const match of source.matchAll(markdownLinkPattern)) {
    const rawTarget = match[1].trim();

    // 仅校验站内绝对路径链接，跳过外链和协议链接
    if (!rawTarget.startsWith("/")) {
      continue;
    }

    const normalizedTarget = normalizeTarget(rawTarget);
    if (!knownRoutes.has(normalizedTarget)) {
      brokenLinks.push({
        from: entry.route,
        to: rawTarget,
      });
    }
  }
}

if (brokenLinks.length > 0) {
  console.error("E_LINKS_BROKEN_CORE_PAGES");
  for (const broken of brokenLinks) {
    console.error(`- from=${broken.from} to=${broken.to}`);
  }
  process.exit(1);
}

console.log("OK_LINKS");
process.exit(0);
