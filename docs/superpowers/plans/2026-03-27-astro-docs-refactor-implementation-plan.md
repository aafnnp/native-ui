# Astro Docs Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `packages/docs` 全量迁移到 Astro，并在文档页实现基于真实 `kra-ui` 组件的“代码 + 实时预览”能力，完成可上线替换。

**Architecture:** 采用 Astro + MDX + React Islands。文档内容迁移到 `src/content`，预览链路通过 `DemoBlock` + `DemoRenderer` + `registry` 受控实现，并以兼容性台账、迁移映射台账、CI 校验保证迁移可追踪与可回滚。

**Tech Stack:** Astro、MDX、React、TypeScript、pnpm、Cloudflare（Pages/Workers 适配器）

---

## 任务前置约束

- 实施前先阅读：
  - `docs/superpowers/specs/2026-03-27-astro-docs-refactor-design.md`
  - `docs/superpowers/specs/2026-03-27-docs-migration-map.md`
- 严格小步提交，每个任务独立可回归。
- 任何改动先写失败校验（测试/检查脚本），再做最小实现。

### Task 0: 先落地可机器判定的检查脚手架（Fail-first 基线）

**Files:**

- Modify: `packages/docs/package.json`
- Create: `packages/docs/scripts/check-demo-registry.mjs`
- Create: `packages/docs/scripts/check-links.mjs`
- Create: `packages/docs/scripts/check-legacy.mjs`
- Create: `packages/docs/scripts/check-redirects.mjs`
- Create: `packages/docs/scripts/check-seo.mjs`
- Create: `packages/docs/scripts/check-smoke.mjs`
- Create: `packages/docs/scripts/check-astro-bootstrap.mjs`
- Test: `packages/docs/scripts/*.mjs`（退出码契约）

- [ ] **Step 1: 写失败校验**

  先定义所有 `check:*` 命令契约（失败返回非 0，成功返回 0）。

- [ ] **Step 2: 运行确认失败**

  Run: `pnpm --filter kra-ui-docs run check:astro-bootstrap`  
  Expected: script missing（退出码非 0）。

- [ ] **Step 3: 写最小实现**

  实现 7 个检查脚本最小版本，并在 `package.json` 注册对应 scripts。

- [ ] **Step 4: 验证通过**

  Run: `pnpm --filter kra-ui-docs run check:astro-bootstrap`  
  Expected: 在未完成 Astro 基础配置前，输出 `E_ASTRO_NOT_BOOTSTRAPPED` 且退出码为 1。

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add packages/docs/package.json packages/docs/scripts/check-demo-registry.mjs packages/docs/scripts/check-links.mjs packages/docs/scripts/check-legacy.mjs packages/docs/scripts/check-redirects.mjs packages/docs/scripts/check-seo.mjs packages/docs/scripts/check-smoke.mjs packages/docs/scripts/check-astro-bootstrap.mjs
  git commit -m "chore(docs): add deterministic check scripts for migration gates"
  ```

### Task 1: 建立 Astro 工程骨架并保持命令入口兼容

**Files:**

- Create: `packages/docs/astro.config.mjs`
- Create: `packages/docs/src/env.d.ts`
- Create: `packages/docs/src/pages/index.astro`
- Modify: `packages/docs/package.json`
- Modify: `pnpm-lock.yaml`
- Test: `pnpm dev:docs`、`pnpm build:docs` 退出码

- [ ] **Step 1: 写失败校验**

  将 `pnpm dev:docs` / `pnpm build:docs` 视为强契约，当前不满足 Astro 目标即失败。

- [ ] **Step 2: 运行确认失败**

  Run: `pnpm --filter kra-ui-docs run check:astro-bootstrap`  
  Expected: 输出 `E_ASTRO_NOT_BOOTSTRAPPED` 且退出码为 1。

- [ ] **Step 3: 写最小实现**

  新增 Astro 基础配置 + 最小首页，并将 docs 包脚本切换到 Astro。

- [ ] **Step 4: 验证通过**

  Run: `pnpm --filter kra-ui-docs run check:astro-bootstrap`  
  Expected: 输出 `OK_ASTRO_BOOTSTRAPPED` 且退出码为 0。  
  Run: `pnpm build:docs`  
  Expected: 构建成功（退出码 0）。

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add packages/docs/astro.config.mjs packages/docs/src/env.d.ts packages/docs/src/pages/index.astro packages/docs/package.json pnpm-lock.yaml
  git commit -m "feat(docs): bootstrap Astro docs app"
  ```

### Task 2: 建立内容集合并迁移主干页面（首页+3个指南）

**Files:**

- Create: `packages/docs/src/content.config.ts`
- Create: `packages/docs/src/content/docs/index.mdx`
- Create: `packages/docs/src/content/docs/guide/getting-started.mdx`
- Create: `packages/docs/src/content/docs/guide/theme.mdx`
- Create: `packages/docs/src/content/docs/guide/migration.mdx`
- Modify: `docs/superpowers/specs/2026-03-27-docs-migration-map.md`
- Test: `packages/docs/src/content.config.ts` schema 校验

- [ ] **Step 1: 写失败校验**

  使用 `check:links` 与 typecheck 作为失败基线：内容集合未配置前必须失败。

- [ ] **Step 2: 运行校验确认失败**

  Run: `pnpm --filter kra-ui-docs typecheck`  
  Expected: 缺失 content collection 定义时报错并退出非 0。

- [ ] **Step 3: 写最小实现**
  - 建立 `content.config.ts` 与 docs collection。
  - 先迁移首页与 3 个指南页（getting-started/theme/migration）到 MDX。
  - 在迁移映射台账中将对应条目标记为 `已迁移`（若页面可访问再置验收通过）。

- [ ] **Step 4: 验证通过**

  Run: `pnpm --filter kra-ui-docs run check:smoke -- --scope core-pages`  
  Expected: 输出 `OK_SMOKE_CORE_PAGES` 且退出码为 0。  
  Run: `pnpm --filter kra-ui-docs run check:links`  
  Expected: 主干页面无死链（退出码 0）。

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add packages/docs/src/content.config.ts packages/docs/src/content/docs docs/superpowers/specs/2026-03-27-docs-migration-map.md
  git commit -m "feat(docs): migrate core guide pages to Astro content collections"
  ```

### Task 3: 先打通高风险兼容闸门（Modal/Toast/Tabs 最小样例）

**Files:**

- Create: `packages/docs/src/demos/components/modal/basic.tsx`
- Create: `packages/docs/src/demos/components/toast/basic.tsx`
- Create: `packages/docs/src/demos/components/tabs/basic.tsx`
- Modify: `packages/docs/src/demos/registry.ts`
- Create: `docs/superpowers/specs/2026-03-27-demo-compat-matrix.md`
- Test: `packages/docs/scripts/check-smoke.mjs`

- [ ] **Step 1: 写失败校验**

  在 `check:smoke` 中加入高风险 demo 页面探测，缺失即失败。

- [ ] **Step 2: 运行确认失败**

  Run: `pnpm --filter kra-ui-docs run check:smoke -- --scope risky-demos`  
  Expected: 输出 `E_SMOKE_RISKY_DEMOS_MISSING` 且退出码为 1。

- [ ] **Step 3: 写最小实现**

  先为 `modal/toast/tabs` 提供最小可运行 demo，并更新兼容性台账结论。

- [ ] **Step 4: 验证通过**

  Run: `pnpm --filter kra-ui-docs run check:smoke -- --scope risky-demos`  
  Expected: 输出 `OK_SMOKE_RISKY_DEMOS` 且退出码为 0。

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add packages/docs/src/demos/components/modal/basic.tsx packages/docs/src/demos/components/toast/basic.tsx packages/docs/src/demos/components/tabs/basic.tsx packages/docs/src/demos/registry.ts docs/superpowers/specs/2026-03-27-demo-compat-matrix.md
  git commit -m "feat(docs): add high-risk demo compatibility gate"
  ```

### Task 4: 实现 DemoBlock 预览链路（registry + island + 错误隔离）

**Files:**

- Create: `packages/docs/src/components/demos/DemoBlock.astro`
- Create: `packages/docs/src/components/demos/DemoRenderer.tsx`
- Modify: `packages/docs/src/demos/registry.ts`
- Create: `packages/docs/src/demos/components/accordion/basic.tsx`
- Create: `packages/docs/src/demos/sources/accordion.ts`
- Modify: `packages/docs/src/content/docs/guide/components/accordion.mdx`
- Test: `packages/docs/src/demos/registry.test.ts`（或等价校验脚本）

- [ ] **Step 1: 写失败测试（registry id 校验）**

  新增测试：当 MDX 使用未注册 `id` 时应报错。

- [ ] **Step 2: 运行测试确认失败**

  Run: `pnpm --filter kra-ui-docs run check:demo-registry`  
  Expected: 报出 demo id 未注册错误。

- [ ] **Step 3: 写最小实现**
  - `DemoBlock` 提供预览容器与源码展示区域。
  - `DemoRenderer` 负责挂载真实 `kra-ui` 示例，并带 ErrorBoundary。
  - `registry.ts` 建立 `id -> DemoComponent/sourceCode/meta` 映射。
  - 以 `accordion-basic` 作为首个可运行示例接入 MDX 页面。

- [ ] **Step 4: 运行测试与页面验证**

  Run: `pnpm --filter kra-ui-docs run check:demo-registry`  
  Expected: registry 校验通过。  
  Run: `pnpm dev:docs` 并访问 accordion 页面  
  Expected: 页面出现“源码 + 实时预览”，示例正常交互。

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add packages/docs/src/components/demos packages/docs/src/demos packages/docs/src/content/docs/guide/components/accordion.mdx
  git commit -m "feat(docs): add DemoBlock rendering pipeline for real kra-ui previews"
  ```

### Task 5: 迁移组件文档（批次 A：基础展示类）

**Files:**

- Modify: `packages/docs/src/content/docs/guide/components/accordion.mdx`
- Modify: `packages/docs/src/content/docs/guide/components/alert.mdx`
- Modify: `packages/docs/src/content/docs/guide/components/avatar.mdx`
- Modify: `packages/docs/src/content/docs/guide/components/badge.mdx`
- Modify: `packages/docs/src/content/docs/guide/components/button.mdx`
- Modify: `packages/docs/src/demos/registry.ts`
- Create: `packages/docs/src/demos/components/alert/basic.tsx`
- Create: `packages/docs/src/demos/components/avatar/basic.tsx`
- Create: `packages/docs/src/demos/components/badge/basic.tsx`
- Create: `packages/docs/src/demos/components/button/basic.tsx`
- Modify: `docs/superpowers/specs/2026-03-27-docs-migration-map.md`
- Test: `packages/docs/scripts/check-demo-registry.mjs`

- [ ] **Step 1: 写失败校验（覆盖率与悬空 id）**

  新增/完善校验脚本：
  - 所有 `<DemoBlock id="...">` 必须在 registry 有映射。
  - 迁移映射台账中的组件页状态与实际文件一致。

- [ ] **Step 2: 运行校验确认失败**

  Run: `pnpm --filter kra-ui-docs run check:demo-registry`  
  Expected: 在批量迁移前出现缺失项。

- [ ] **Step 3: 写最小实现**

  只迁移批次 A 文件，并同步更新 registry 与 migration-map。

- [ ] **Step 4: 验证通过**

  Run: `pnpm --filter kra-ui-docs run check:demo-registry`  
  Expected: 输出 `OK_DEMO_REGISTRY` 且退出码为 0。  
  Run: `pnpm --filter kra-ui-docs run check:links`  
  Expected: 输出 `OK_LINKS` 且退出码为 0。

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add packages/docs/src/content/docs/guide/components/accordion.mdx packages/docs/src/content/docs/guide/components/alert.mdx packages/docs/src/content/docs/guide/components/avatar.mdx packages/docs/src/content/docs/guide/components/badge.mdx packages/docs/src/content/docs/guide/components/button.mdx packages/docs/src/demos/registry.ts packages/docs/src/demos/components/alert/basic.tsx packages/docs/src/demos/components/avatar/basic.tsx packages/docs/src/demos/components/badge/basic.tsx packages/docs/src/demos/components/button/basic.tsx docs/superpowers/specs/2026-03-27-docs-migration-map.md
  git commit -m "feat(docs): migrate component docs batch A"
  ```

### Task 6.1: 迁移组件文档（批次 B-1：输入类）

**Files:**

- Modify: `packages/docs/src/content/docs/guide/components/input.mdx`
- Modify: `packages/docs/src/content/docs/guide/components/textarea.mdx`
- Modify: `packages/docs/src/content/docs/guide/components/checkbox.mdx`
- Modify: `packages/docs/src/content/docs/guide/components/radio.mdx`
- Modify: `packages/docs/src/demos/registry.ts`
- Create: `packages/docs/src/demos/components/input/basic.tsx`
- Create: `packages/docs/src/demos/components/textarea/basic.tsx`
- Create: `packages/docs/src/demos/components/checkbox/basic.tsx`
- Create: `packages/docs/src/demos/components/radio/basic.tsx`
- Modify: `docs/superpowers/specs/2026-03-27-docs-migration-map.md`

- [ ] **Step 1: 写失败校验**

  在 `packages/docs/src/content/docs/guide/components/input.mdx` 中先加入一个临时占位 demo id（如 `input-b1-temp`）且不注册。

- [ ] **Step 2: 运行确认失败**

  Run: `pnpm --filter kra-ui-docs run check:demo-registry`  
  Expected: 输出 `E_DEMO_ID_UNREGISTERED input-b1-temp` 且退出码为 1。

- [ ] **Step 3: 写最小实现并更新台账**

- [ ] **Step 4: 验证通过**

  Run: `pnpm --filter kra-ui-docs run check:demo-registry`  
  Expected: 输出 `OK_DEMO_REGISTRY` 且退出码为 0。

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add packages/docs/src/content/docs/guide/components/input.mdx packages/docs/src/content/docs/guide/components/textarea.mdx packages/docs/src/content/docs/guide/components/checkbox.mdx packages/docs/src/content/docs/guide/components/radio.mdx packages/docs/src/demos/registry.ts packages/docs/src/demos/components/input/basic.tsx packages/docs/src/demos/components/textarea/basic.tsx packages/docs/src/demos/components/checkbox/basic.tsx packages/docs/src/demos/components/radio/basic.tsx docs/superpowers/specs/2026-03-27-docs-migration-map.md
  git commit -m "feat(docs): migrate component docs batch B1 input controls"
  ```

### Task 6.2: 迁移组件文档（批次 B-2：布局类）

**Files:**

- Modify: `packages/docs/src/content/docs/guide/components/grid.mdx`
- Modify: `packages/docs/src/content/docs/guide/components/stack.mdx`
- Modify: `packages/docs/src/demos/registry.ts`
- Create: `packages/docs/src/demos/components/grid/basic.tsx`
- Create: `packages/docs/src/demos/components/stack/basic.tsx`
- Modify: `docs/superpowers/specs/2026-03-27-docs-migration-map.md`

- [ ] **Step 1: 写失败校验**

  在 `packages/docs/src/content/docs/guide/components/grid.mdx` 中先写入一个可控的临时断链（如 `/__b2-broken-link__`）。

- [ ] **Step 2: 运行确认失败**

  Run: `pnpm --filter kra-ui-docs run check:links -- --file src/content/docs/guide/components/grid.mdx`  
  Expected: 输出 `E_LINKS_INVALID /__b2-broken-link__` 且退出码为 1。

- [ ] **Step 3: 写 demo-registry 失败校验**

  在 `grid.mdx` 中临时加入未注册 demo id（如 `grid-b2-temp`），用于制造可重复失败。

- [ ] **Step 4: 运行 demo-registry 失败确认**

  Run: `pnpm --filter kra-ui-docs run check:demo-registry`  
  Expected: 输出 `E_DEMO_ID_UNREGISTERED grid-b2-temp` 且退出码为 1。

- [ ] **Step 5: 写最小实现并更新台账**

  移除临时断链，完成 `grid/stack` 的 demo 与 registry 更新，并更新迁移台账。

- [ ] **Step 6: 验证通过**

  Run: `pnpm --filter kra-ui-docs run check:links -- --file src/content/docs/guide/components/grid.mdx`  
  Expected: 输出 `OK_LINKS` 且退出码为 0。  
  Run: `pnpm --filter kra-ui-docs run check:demo-registry`  
  Expected: 输出 `OK_DEMO_REGISTRY` 且退出码为 0。

- [ ] **Step 5: Commit**
- [ ] **Step 7: Commit**

  Run:

  ```bash
  git add packages/docs/src/content/docs/guide/components/grid.mdx packages/docs/src/content/docs/guide/components/stack.mdx packages/docs/src/demos/registry.ts packages/docs/src/demos/components/grid/basic.tsx packages/docs/src/demos/components/stack/basic.tsx docs/superpowers/specs/2026-03-27-docs-migration-map.md
  git commit -m "feat(docs): migrate component docs batch B2 layout components"
  ```

### Task 7: Cloudflare 部署链路切换与回滚脚本落地

**Files:**

- Modify: `packages/docs/package.json`
- Modify: `packages/docs/README.md`
- Modify: `packages/docs/wrangler.toml`（若仍使用）
- Create: `packages/docs/scripts/rollback-prod.mjs`（或等价执行脚本）
- Test: 预发布 smoke 与回滚演练结果记录

- [ ] **Step 1: 写失败校验（发布门槛）**

  先落地 `check:smoke`、`check:redirects`、`check:seo` 命令约束；命令缺失时视为失败。

- [ ] **Step 2: 运行确认失败**

  Run: `pnpm --filter kra-ui-docs run check:smoke`  
  Expected: 脚本未实现或检查失败。

- [ ] **Step 3: 写最小实现**
  - 实现检查脚本与 npm scripts。
  - 将发布与回滚命令固化到 `package.json` 和 README。
  - 根据最终适配器方案补齐 Cloudflare 配置。

- [ ] **Step 4: 验证通过**

  Run: `pnpm --filter kra-ui-docs run check:smoke`  
  Expected: 输出 `OK_SMOKE_FULL` 且退出码为 0。  
  Run: `pnpm --filter kra-ui-docs run check:redirects`  
  Expected: 输出 `OK_REDIRECTS rate=XX` 且 `rate>=99`，退出码为 0。  
  Run: `pnpm --filter kra-ui-docs run check:seo`  
  Expected: 输出 `OK_SEO canonical=100 sitemap=100` 且退出码为 0。

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add packages/docs/package.json packages/docs/README.md packages/docs/wrangler.toml packages/docs/scripts
  git commit -m "chore(docs): add deploy, rollback, and release quality gates for Astro docs"
  ```

### Task 8: 清理旧链路并完成最终验收

**Files:**

- Delete: `packages/docs/app/root.tsx`
- Delete: `packages/docs/app/routes.ts`
- Delete: `packages/docs/app/routes/_index.tsx`
- Delete: `packages/docs/app/routes/guide._index.tsx`
- Delete: `packages/docs/app/components/MarkdownPage.tsx`
- Delete: `packages/docs/content/index.md`
- Delete: `packages/docs/content/guide/getting-started.md`
- Delete: `packages/docs/content/guide/theme.md`
- Delete: `packages/docs/content/guide/migration.md`
- Delete: `packages/docs/scripts/generate-docs-routes.mjs`
- Delete: `packages/docs/scripts/path-to-route.mjs`
- Delete: `packages/docs/scripts/path-to-route.test.mjs`（若被新脚本替代）
- Modify: `docs/superpowers/specs/2026-03-27-docs-migration-map.md`
- Test: 全量 CI 命令与手工 smoke

- [ ] **Step 1: 写失败校验（残留检测）**

  增加检查：仓库内若仍存在旧路由生成链路引用则失败。

- [ ] **Step 2: 运行校验确认失败**

  Run: `pnpm --filter kra-ui-docs run check:legacy`  
  Expected: 在清理前检测到旧链路残留。

- [ ] **Step 3: 写最小实现**

  删除已替换的旧目录与脚本，修复相关引用，确保只保留 Astro 链路。

- [ ] **Step 4: 全量验证**

  Run:
  - `pnpm dev:docs`
  - `pnpm build:docs`
  - `pnpm --filter kra-ui-docs typecheck`
  - `pnpm --filter kra-ui-docs run check:links`
  - `pnpm --filter kra-ui-docs run check:demo-registry`
  - `pnpm --filter kra-ui-docs run check:redirects`
  - `pnpm --filter kra-ui-docs run check:seo`
  - `pnpm --filter kra-ui-docs run check:smoke`

  Expected: 全部通过；迁移映射台账覆盖率为 100%。

- [ ] **Step 5: Commit**

  Run:

  ```bash
  git add packages/docs/app/root.tsx packages/docs/app/routes.ts packages/docs/app/routes/_index.tsx packages/docs/app/routes/guide._index.tsx packages/docs/app/components/MarkdownPage.tsx packages/docs/content/index.md packages/docs/content/guide/getting-started.md packages/docs/content/guide/theme.md packages/docs/content/guide/migration.md packages/docs/scripts/generate-docs-routes.mjs packages/docs/scripts/path-to-route.mjs packages/docs/scripts/path-to-route.test.mjs docs/superpowers/specs/2026-03-27-docs-migration-map.md
  git commit -m "refactor(docs): replace legacy React Router docs stack with Astro"
  ```

---

## 实施说明（给执行者）

- 每个 Task 完成后都要更新：
  - `docs/superpowers/specs/2026-03-27-docs-migration-map.md`
  - 相关检查脚本与 README
- 高风险组件（`modal/popup/toast/scroll-area/tabs`）必须优先回归。
- 若出现跨任务阻塞，先提交当前最小可用状态，再开下一任务处理。
