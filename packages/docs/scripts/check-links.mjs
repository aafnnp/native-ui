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

const batchB1ComponentEntries = [
  {
    file: "src/content/docs/guide/components/input.mdx",
    route: "/guide/components/input",
  },
  {
    file: "src/content/docs/guide/components/textarea.mdx",
    route: "/guide/components/textarea",
  },
  {
    file: "src/content/docs/guide/components/checkbox.mdx",
    route: "/guide/components/checkbox",
  },
  {
    file: "src/content/docs/guide/components/radio.mdx",
    route: "/guide/components/radio",
  },
];

const batchB2ComponentEntries = [
  {
    file: "src/content/docs/guide/components/grid.mdx",
    route: "/guide/components/grid",
  },
  {
    file: "src/content/docs/guide/components/stack.mdx",
    route: "/guide/components/stack",
  },
];

const pageEntries = [
  ...corePageEntries,
  ...batchAComponentEntries,
  ...batchB1ComponentEntries,
  ...batchB2ComponentEntries,
];
const knownRoutes = new Set(pageEntries.map((entry) => entry.route));
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

/**
 * 解析 --file 参数，支持 --file <path> 与 --file=<path>
 * @param {string[]} argv
 * @returns {string | null}
 */
function parseFileArg(argv) {
  for (let index = 0; index < argv.length; index += 1) {
    const currentArg = argv[index];
    if (currentArg === "--file") {
      const nextArg = argv[index + 1];
      return nextArg ? nextArg.trim() : null;
    }
    if (currentArg.startsWith("--file=")) {
      return currentArg.slice("--file=".length).trim();
    }
  }
  return null;
}

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
const fileArg = parseFileArg(process.argv.slice(2));
const entriesToCheck = fileArg
  ? [{ file: fileArg, route: fileArg }]
  : pageEntries;

for (const entry of entriesToCheck) {
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
  if (fileArg) {
    for (const broken of brokenLinks) {
      console.error(`E_LINKS_INVALID ${broken.to}`);
    }
    process.exit(1);
  }
  console.error("E_LINKS_BROKEN_CORE_PAGES");
  for (const broken of brokenLinks) {
    console.error(`- from=${broken.from} to=${broken.to}`);
  }
  process.exit(1);
}

console.log("OK_LINKS");
process.exit(0);
