# Kra-UI 文档站

基于 **Astro 5** + **Vite** + **Cloudflare Workers**，部署到 Cloudflare。

## 本地开发

```bash
# 在仓库根目录
pnpm dev:docs
```

开发前会自动执行 `generate`，根据 `content/` 下 Markdown 生成 `app/routes` 下的路由模块。

## 构建

```bash
pnpm build:docs
```

会依次：生成路由 → 校验侧栏链接 → `astro build`。产物在 `dist/`。

## 类型与检查

```bash
pnpm --filter kra-ui-docs typecheck   # wrangler types + react-router typegen + tsc
pnpm --filter kra-ui-docs test:scripts # 路由映射单元测试
```

`worker-configuration.d.ts` 由 `wrangler types` 生成且已加入 `.gitignore`，克隆后首次执行 `typecheck` 或 `typegen` 即可生成。

修改 `wrangler.toml` 后请重新执行 `pnpm --filter kra-ui-docs run typegen`。

## 预览（生产构建）

```bash
pnpm --filter kra-ui-docs preview
```

使用 Astro 预览服务启动生产构建（需先 build）。

## 发布门禁（Task7）

```bash
# 全量 smoke（核心页面 + 高风险 demo）
pnpm --filter kra-ui-docs run check:smoke

# 迁移路由重定向覆盖率（必须 >= 99）
pnpm --filter kra-ui-docs run check:redirects

# SEO 基线（canonical / sitemap）
pnpm --filter kra-ui-docs run check:seo

# 发布前总验收
pnpm --filter kra-ui-docs run verify:release
```

输出约定：

- `check:smoke` 成功：`OK_SMOKE_FULL`
- `check:redirects` 成功：`OK_REDIRECTS rate=XX`
- `check:seo` 成功：`OK_SEO canonical=100 sitemap=100`

重定向规则维护位置：

- `packages/docs/config/redirects.json`（旧路由 -> 新路由）
- `check:redirects` 会读取该文件并校验映射完整率及 dist 目标页面可用性

## 部署与回滚

```bash
# 生产部署（先执行门禁 + typecheck + build）
pnpm --filter kra-ui-docs run deploy:prod

# 生产回滚（先 dry-run，再正式执行）
pnpm --filter kra-ui-docs run rollback:prod -- --version-id <VERSION_ID> --dry-run
pnpm --filter kra-ui-docs run rollback:prod -- --version-id <VERSION_ID>
```

`VERSION_ID` 可通过 Wrangler 的版本列表命令获取（例如 `pnpm --filter kra-ui-docs exec wrangler versions list`）。

## 内容目录

- 文档源文件：`content/**/*.md`（首页为 `content/index.md`）
- 导航配置：`app/lib/docs-nav.json`（与 `app/lib/docs-nav.ts` 类型导出配合使用）

## Cloudflare Pages

构建命令（仓库根）：`pnpm install --frozen-lockfile && pnpm --filter kra-ui-docs build`  
Node 版本：**20+**

具体输出目录与 Worker 入口以 `build/server/wrangler.json` 为准（由框架生成）。
