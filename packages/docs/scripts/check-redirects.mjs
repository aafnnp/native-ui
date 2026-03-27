import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrationMapPath = resolve(
  docsRootDir,
  "../../docs/superpowers/specs/2026-03-27-docs-migration-map.md",
);
/**
 * 可维护的重定向规则来源（最小实现）
 */
const redirectRules = {
  "/": "/",
  "/guide/getting-started": "/guide/getting-started",
  "/guide/theme": "/guide/theme",
  "/guide/migration": "/guide/migration",
  "/guide/components/accordion": "/guide/components/accordion",
  "/guide/components/alert": "/guide/components/alert",
  "/guide/components/avatar": "/guide/components/avatar",
  "/guide/components/badge": "/guide/components/badge",
  "/guide/components/button": "/guide/components/button",
  "/guide/components/checkbox": "/guide/components/checkbox",
  "/guide/components/grid": "/guide/components/grid",
  "/guide/components/input": "/guide/components/input",
  "/guide/components/radio": "/guide/components/radio",
  "/guide/components/stack": "/guide/components/stack",
  "/guide/components/textarea": "/guide/components/textarea",
};

/**
 * 将路由路径转换为 Astro 页面候选路径
 * @param {string} route
 * @returns {string[]}
 */
function toPageCandidates(route) {
  if (route === "/") {
    return [
      "src/pages/index.astro",
      "src/pages/index.mdx",
      "src/content/docs/index.mdx",
    ];
  }
  const cleanRoute = route.replace(/^\/+/, "");
  return [
    `src/pages/${cleanRoute}.astro`,
    `src/pages/${cleanRoute}.mdx`,
    `src/content/docs/${cleanRoute}.mdx`,
  ];
}

const mapSource = readFileSync(migrationMapPath, "utf8");
const routeRows = mapSource
  .split("\n")
  .filter((line) => line.startsWith("| `") && line.includes("| 已迁移 |"));

if (routeRows.length === 0) {
  console.error("E_REDIRECTS_NO_MIGRATED_ROUTES");
  process.exit(1);
}

let passed = 0;
const failedRoutes = [];
const missingRedirectRules = [];
const redirectTargetMismatch = [];

for (const row of routeRows) {
  const cells = row.split("|").map((cell) => cell.trim());
  const oldRoute = cells[1]?.replace(/^`|`$/g, "");
  const newRoute = cells[2]?.replace(/^`|`$/g, "");
  if (!oldRoute || !newRoute) {
    continue;
  }

  const mappedTarget = redirectRules[oldRoute];
  if (!mappedTarget) {
    missingRedirectRules.push(oldRoute);
    continue;
  }
  if (mappedTarget !== newRoute) {
    redirectTargetMismatch.push(`${oldRoute}->${mappedTarget} expected=${newRoute}`);
    continue;
  }

  const candidates = toPageCandidates(newRoute);
  const matched = candidates.some((relativePath) =>
    existsSync(resolve(docsRootDir, relativePath)),
  );

  if (matched) {
    passed += 1;
  } else {
    failedRoutes.push(newRoute);
  }
}

const total = passed + failedRoutes.length;
const rate = total === 0 ? 0 : Math.floor((passed / total) * 100);

if (
  failedRoutes.length > 0 ||
  missingRedirectRules.length > 0 ||
  redirectTargetMismatch.length > 0 ||
  rate < 99
) {
  for (const route of missingRedirectRules) {
    console.error(`E_REDIRECTS_RULE_MISSING ${route}`);
  }
  for (const message of redirectTargetMismatch) {
    console.error(`E_REDIRECTS_RULE_TARGET_MISMATCH ${message}`);
  }
  for (const route of failedRoutes) {
    console.error(`E_REDIRECTS_TARGET_MISSING ${route}`);
  }
  console.error(`E_REDIRECTS_RATE_LOW rate=${rate} threshold=99`);
  process.exit(1);
}

console.log(`OK_REDIRECTS rate=${rate}`);
