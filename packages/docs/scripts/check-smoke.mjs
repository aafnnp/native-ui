import { existsSync, readFileSync } from "node:fs";
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
/**
 * 高风险组件 demo smoke 检查所需文件
 */
const riskyDemosRequiredFiles = [
  "src/demos/registry.ts",
  "src/demos/components/modal/basic.tsx",
  "src/demos/components/toast/basic.tsx",
  "src/demos/components/tabs/basic.tsx",
];
/**
 * 高风险 demo 必须注册的 id
 */
const riskyDemoIds = ["modal-basic", "toast-basic", "tabs-basic"];

/**
 * 生成 registry key 严格匹配正则
 */
function createRegistryKeyRegex(demoId) {
  return new RegExp(`(^|\\n)\\s*["']${demoId}["']\\s*:`, "m");
}

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const scopeArg = args.find((arg) => arg.startsWith("--scope"));
const scope = scopeArg?.includes("=")
  ? scopeArg.split("=")[1]
  : args[args.indexOf("--scope") + 1] ?? "core-pages";

if (!["core-pages", "risky-demos"].includes(scope)) {
  console.error("E_SMOKE_SCOPE_UNSUPPORTED");
  process.exit(1);
}

const requiredFiles =
  scope === "risky-demos" ? riskyDemosRequiredFiles : corePagesRequiredFiles;

const missingFiles = requiredFiles.filter((filePath) => {
  const absolutePath = resolve(docsRootDir, filePath);
  return !existsSync(absolutePath);
});

if (missingFiles.length > 0) {
  if (scope === "risky-demos") {
    for (const filePath of missingFiles) {
      console.error(`E_SMOKE_RISKY_DEMOS_MISSING file:${filePath}`);
    }
    process.exit(1);
  }

  console.error("E_SMOKE_CORE_PAGES_MISSING");
  process.exit(1);
}

if (scope === "risky-demos") {
  const registryPath = resolve(docsRootDir, "src/demos/registry.ts");
  const registryContent = readFileSync(registryPath, "utf8");
  const missingRiskyIds = riskyDemoIds.filter(
    (demoId) => !createRegistryKeyRegex(demoId).test(registryContent),
  );

  if (missingRiskyIds.length > 0) {
    for (const demoId of missingRiskyIds) {
      console.error(`E_SMOKE_RISKY_DEMOS_MISSING registry:${demoId}`);
    }
    process.exit(1);
  }

  console.log("OK_SMOKE_RISKY_DEMOS");
  process.exit(0);
}

console.log("OK_SMOKE_CORE_PAGES");
process.exit(0);
