# Task7 验证记录（部署回滚链路与门禁）

## 1) fail-first 证据（check:smoke full）

历史执行（实现前）：

- 命令：`pnpm --filter kra-ui-docs run check:smoke -- --scope full`
- 输出摘要：`E_SMOKE_SCOPE_UNSUPPORTED`
- 结论：实现前 full 模式未支持，符合 fail-first。

可复现实验（当前版本）：

- 命令：`pnpm --filter kra-ui-docs run check:smoke`
- 输出摘要：`OK_SMOKE_FULL`
- 结论：实现后 full 模式通过。

## 2) 本次修复验收（Task7 补强）

### 2.1 deploy 链路目录对齐

- 变更：`packages/docs/wrangler.toml` 中 `assets.directory` 从 `./build/client` 调整为 `./dist`。
- 验证：`pnpm --filter kra-ui-docs run deploy:prod -- --dry-run` 不再因 assets 目录不存在失败。

### 2.2 redirects 门禁补强

- 增加“重定向规则源”最小实现：在 `check-redirects.mjs` 内维护 `redirectRules` 映射。
- 校验项：
  - 迁移台账中的已迁移路由必须存在映射规则；
  - 映射目标必须与台账新路径一致；
  - 新路径必须有可用页面来源（`src/pages` 或 `src/content/docs`）。
- 成功输出契约：`OK_REDIRECTS rate=XX`（本次为 `rate=100`）。

### 2.3 seo 门禁补强

- 校验基于 `dist` 产物：
  - 核心页面 HTML（最小实现：`/`）必须存在 canonical；
  - canonical 必须以 `astro.config.mjs` 的 `site` 为前缀；
  - `dist/sitemap.xml` 必须存在并包含核心路由。
- 成功输出契约：`OK_SEO canonical=100 sitemap=100`。
