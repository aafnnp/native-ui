# Kra-UI 文档站

基于 **Astro 5** + **MDX** + **Cloudflare Workers**，部署到 Cloudflare。

## 本地开发

```bash
# 在仓库根目录
pnpm dev:docs
```

开发命令直接启动 Astro，本地访问地址由终端输出（默认 `http://localhost:4321`）。

## 构建

```bash
pnpm build:docs
```

执行 `astro build`，构建产物在 `dist/`。

## 类型与检查

```bash
pnpm --filter kra-ui-docs run typecheck
pnpm --filter kra-ui-docs run check:legacy
pnpm --filter kra-ui-docs run check:links
pnpm --filter kra-ui-docs run check:demo-registry
```

`typecheck` 会执行 `astro sync` + `astro check`，用于验证 MDX/页面与类型约束。

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

- 文档内容：`src/content/docs/**/*.mdx`
- 路由壳：`src/pages/**/*.astro`（页面仅 import 对应 MDX，不双写正文）
- demo 预览：`src/components/demos/*` + `src/demos/*`

## Cloudflare Pages

构建命令（仓库根）：`pnpm install --frozen-lockfile && pnpm --filter kra-ui-docs build`  
Node 版本：**20+**

Worker 入口在 `workers/app.ts`，用于将请求分发到静态产物（`assets.directory = ./dist`）。
