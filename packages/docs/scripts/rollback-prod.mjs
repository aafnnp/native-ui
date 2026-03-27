import { spawnSync } from "node:child_process";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const versionIdArg = args.find((arg) => arg.startsWith("--version-id="));
const versionId =
  versionIdArg?.slice("--version-id=".length) ??
  args[args.indexOf("--version-id") + 1];
const dryRun = args.includes("--dry-run");

if (!versionId) {
  console.error("E_ROLLBACK_MISSING_VERSION_ID");
  console.error("用法: pnpm run rollback:prod -- --version-id <id> [--dry-run]");
  process.exit(1);
}

if (dryRun) {
  console.log(`OK_ROLLBACK_DRY_RUN version=${versionId}`);
  process.exit(0);
}

const deployResult = spawnSync(
  "pnpm",
  ["exec", "wrangler", "versions", "deploy", versionId],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

if (typeof deployResult.status === "number" && deployResult.status === 0) {
  console.log(`OK_ROLLBACK version=${versionId}`);
  process.exit(0);
}

console.error(`E_ROLLBACK_FAILED version=${versionId}`);
process.exit(deployResult.status ?? 1);
