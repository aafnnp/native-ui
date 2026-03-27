import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const migrationMapPath = resolve(
  docsRootDir,
  "../../docs/superpowers/specs/2026-03-27-docs-migration-map.md",
);
const redirectsConfigPath = resolve(docsRootDir, "config/redirects.json");
const distDir = resolve(docsRootDir, "dist");

/**
 * 将路由路径转换为 dist html 路径
 * @param {string} route
 * @returns {string}
 */
function toDistHtmlPath(route) {
  if (route === "/") {
    return resolve(distDir, "index.html");
  }
  const cleanRoute = route.replace(/^\/+/, "");
  return resolve(distDir, cleanRoute, "index.html");
}

/**
 * 构建产物，确保重定向门禁基于 dist 校验
 * @returns {boolean}
 */
function runBuild() {
  const result = spawnSync("pnpm", ["run", "build"], {
    cwd: docsRootDir,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return result.status === 0;
}

const mapSource = readFileSync(migrationMapPath, "utf8");
const redirectRules = JSON.parse(readFileSync(redirectsConfigPath, "utf8"));
const routeRows = mapSource
  .split("\n")
  .filter((line) => line.startsWith("| `") && line.includes("| 已迁移 |"));

if (routeRows.length === 0) {
  console.error("E_REDIRECTS_NO_MIGRATED_ROUTES");
  process.exit(1);
}

/**
 * 执行一次重定向门禁评估
 * @returns {{ passed:number; failedDistTargets:string[]; missingRedirectRules:string[]; redirectTargetMismatch:string[]; total:number; rate:number; }}
 */
function evaluate() {
  let passed = 0;
  const failedDistTargets = [];
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

    const distHtmlPath = toDistHtmlPath(newRoute);
    const matched = existsSync(distHtmlPath);

    if (matched) {
      passed += 1;
    } else {
      failedDistTargets.push(newRoute);
    }
  }

  const total =
    passed + failedDistTargets.length + missingRedirectRules.length + redirectTargetMismatch.length;
  const rate = total === 0 ? 0 : Math.floor((passed / total) * 100);
  return { passed, failedDistTargets, missingRedirectRules, redirectTargetMismatch, total, rate };
}

let result = evaluate();
if (result.rate < 99 || result.failedDistTargets.length > 0) {
  if (!runBuild()) {
    console.error("E_REDIRECTS_BUILD_FAILED");
    process.exit(1);
  }
  result = evaluate();
}

if (
  result.failedDistTargets.length > 0 ||
  result.missingRedirectRules.length > 0 ||
  result.redirectTargetMismatch.length > 0 ||
  result.rate < 99
) {
  for (const route of result.missingRedirectRules) {
    console.error(`E_REDIRECTS_RULE_MISSING ${route}`);
  }
  for (const message of result.redirectTargetMismatch) {
    console.error(`E_REDIRECTS_RULE_TARGET_MISMATCH ${message}`);
  }
  for (const route of result.failedDistTargets) {
    console.error(`E_REDIRECTS_DIST_TARGET_MISSING ${route}`);
  }
  console.error(`E_REDIRECTS_RATE_LOW rate=${result.rate} threshold=99`);
  process.exit(1);
}

console.log(`OK_REDIRECTS rate=${result.rate}`);
