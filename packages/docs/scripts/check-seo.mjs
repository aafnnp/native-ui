import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const astroConfigPath = resolve(docsRootDir, "astro.config.mjs");
const distDir = resolve(docsRootDir, "dist");
const sitemapPath = resolve(distDir, "sitemap.xml");

/**
 * 核心路由（最小实现）
 */
const coreRoutes = ["/"];

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
 * 基于 dist 做 SEO 校验
 * @param {string} sitePrefixValue
 * @returns {{ canonical: number; sitemap: number }}
 */
function validateFromDist(sitePrefixValue) {
  if (!existsSync(distDir)) {
    return { canonical: 0, sitemap: 0 };
  }

  const canonicalOk = coreRoutes.every((route) => {
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
  });

  const sitemapOk =
    existsSync(sitemapPath) &&
    coreRoutes.every((route) => {
      const expectedLoc = `<loc>${sitePrefixValue}${route === "/" ? "/" : route}</loc>`;
      return readFileSync(sitemapPath, "utf8").includes(expectedLoc);
    });

  return {
    canonical: canonicalOk ? 100 : 0,
    sitemap: sitemapOk ? 100 : 0,
  };
}

const astroConfig = readFileSync(astroConfigPath, "utf8");
const sitePrefix = extractSitePrefix(astroConfig);

if (!sitePrefix) {
  console.error("E_SEO_SITE_PREFIX_MISSING");
  process.exit(1);
}

let { canonical, sitemap } = validateFromDist(sitePrefix);
if ((canonical < 100 || sitemap < 100) && !runBuild()) {
  console.error("E_SEO_BUILD_FAILED");
  process.exit(1);
}
if (canonical < 100 || sitemap < 100) {
  ({ canonical, sitemap } = validateFromDist(sitePrefix));
}

if (canonical < 100 || sitemap < 100) {
  console.error(`E_SEO_LOW canonical=${canonical} sitemap=${sitemap}`);
  process.exit(1);
}

console.log(`OK_SEO canonical=${canonical} sitemap=${sitemap}`);
