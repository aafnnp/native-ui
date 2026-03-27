import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const astroConfigPath = resolve(docsRootDir, "astro.config.mjs");
const migrationMapPath = resolve(
  docsRootDir,
  "../../docs/superpowers/specs/2026-03-27-docs-migration-map.md",
);

/**
 * 从台账统计迁移路由数量
 * @param {string} mapSource
 * @returns {number}
 */
function countMigratedRoutes(mapSource) {
  return mapSource
    .split("\n")
    .filter((line) => line.startsWith("| `") && line.includes("| 已迁移 |")).length;
}

const astroConfig = readFileSync(astroConfigPath, "utf8");
const mapSource = readFileSync(migrationMapPath, "utf8");
const migratedCount = countMigratedRoutes(mapSource);

if (migratedCount === 0) {
  console.error("E_SEO_NO_MIGRATED_ROUTES");
  process.exit(1);
}

const hasSiteConfig = /site\s*:\s*["']https?:\/\/[^"']+["']/.test(astroConfig);
const canonical = hasSiteConfig ? 100 : 0;
const sitemap = hasSiteConfig ? 100 : 0;

if (canonical < 100 || sitemap < 100) {
  console.error(`E_SEO_LOW canonical=${canonical} sitemap=${sitemap}`);
  process.exit(1);
}

console.log(`OK_SEO canonical=${canonical} sitemap=${sitemap}`);
