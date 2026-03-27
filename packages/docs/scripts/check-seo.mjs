import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const astroConfigPath = resolve(docsRootDir, "astro.config.mjs");
const migrationMapPath = resolve(
  docsRootDir,
  "../../docs/superpowers/specs/2026-03-27-docs-migration-map.md",
);
const distDir = resolve(docsRootDir, "dist");
const sitemapPath = resolve(distDir, "sitemap.xml");

/**
 * 从 astro.config.mjs 提取站点前缀
 * @param {string} source
 * @returns {string}
 */
function extractSitePrefix(source) {
  const match = source.match(/site\s*:\s*["'](https?:\/\/[^"']+)["']/);
  return (match?.[1] ?? "").replace(/\/+$/, "");
}

/**
 * 执行一次构建，确保 SEO 校验使用最新 dist 产物
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

/**
 * 提取台账中“已迁移”路由集合
 * @param {string} source
 * @returns {string[]}
 */
function collectMigratedRoutes(source) {
  const routes = [];
  const lines = source.split("\n");
  for (const line of lines) {
    if (!line.startsWith("| `") || !line.includes("| 已迁移 |")) {
      continue;
    }
    const cells = line.split("|").map((cell) => cell.trim());
    const newRoute = cells[2]?.replace(/^`|`$/g, "");
    if (newRoute) {
      routes.push(newRoute);
    }
  }
  return routes;
}

/**
 * 基于 dist 做 SEO 校验
 * @param {string} sitePrefixValue
 * @param {string[]} routes
 * @returns {{ canonical: number; sitemap: number }}
 */
function validateFromDist(sitePrefixValue, routes) {
  if (!existsSync(distDir) || !existsSync(sitemapPath) || routes.length === 0) {
    return { canonical: 0, sitemap: 0 };
  }

  const canonicalPassed = routes.filter((route) => {
    const htmlPath =
      route === "/"
        ? resolve(distDir, "index.html")
        : resolve(distDir, route.replace(/^\/+/, ""), "index.html");
    if (!existsSync(htmlPath)) {
      return false;
    }
    const html = readFileSync(htmlPath, "utf8");
    const expectedHref = `${sitePrefixValue}${route === "/" ? "/" : route}`;
    const canonicalPattern = new RegExp(
      `<link\\s+rel=["']canonical["']\\s+href=["']${expectedHref.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      )}["']\\s*/?>`,
    );
    return canonicalPattern.test(html);
  }).length;

  const sitemapXml = readFileSync(sitemapPath, "utf8");
  const sitemapPassed = routes.filter((route) => {
    const expectedLoc = `<loc>${sitePrefixValue}${route === "/" ? "/" : route}</loc>`;
    return sitemapXml.includes(expectedLoc);
  }).length;

  return {
    canonical: Math.floor((canonicalPassed / routes.length) * 100),
    sitemap: Math.floor((sitemapPassed / routes.length) * 100),
  };
}

const astroConfig = readFileSync(astroConfigPath, "utf8");
const sitePrefix = extractSitePrefix(astroConfig);
const migratedRoutes = collectMigratedRoutes(readFileSync(migrationMapPath, "utf8"));

if (!sitePrefix) {
  console.error("E_SEO_SITE_PREFIX_MISSING");
  process.exit(1);
}
if (migratedRoutes.length === 0) {
  console.error("E_SEO_NO_MIGRATED_ROUTES");
  process.exit(1);
}

let { canonical, sitemap } = validateFromDist(sitePrefix, migratedRoutes);
if ((canonical < 100 || sitemap < 100) && !runBuild()) {
  console.error("E_SEO_BUILD_FAILED");
  process.exit(1);
}
if (canonical < 100 || sitemap < 100) {
  ({ canonical, sitemap } = validateFromDist(sitePrefix, migratedRoutes));
}

if (canonical < 100 || sitemap < 100) {
  console.error(`E_SEO_LOW canonical=${canonical} sitemap=${sitemap}`);
  process.exit(1);
}

console.log(`OK_SEO canonical=${canonical} sitemap=${sitemap}`);
