# Docs Style Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一 `packages/docs` 文档站的全局排版与示例卡片（`DemoBlock`）外观，并让浅/暗色模式随系统自动切换。

**Architecture:** 在文档站新增唯一样式入口 `global.css`（通过 CSS 变量 + `prefers-color-scheme` 控制颜色），并新增 `BaseLayout.astro` 作为页面模板，把全局样式只注入一次。所有 `src/pages/**.astro` 改为复用 `BaseLayout`，正文排版在 `doc-main` 作用域生效。`DemoBlock.astro` 把写死颜色替换为 `--doc-*` 变量，确保暗色观感一致。

**Tech Stack:** Astro 5、CSS variables、`prefers-color-scheme`、现有的 `DemoBlock.astro` 局部样式注入。

---

## Task 1: 新增全局样式与布局模板

**Files:**

- Create: `packages/docs/src/styles/global.css`
- Create: `packages/docs/src/layouts/BaseLayout.astro`

### Step 1: 创建 `global.css`（CSS 变量 + 作用域排版）

- [ ] 创建 `packages/docs/src/styles/global.css`
  - 在 `:root` 定义 `--doc-bg/--doc-fg/--doc-muted/--doc-border/--doc-card-bg/--doc-code-bg/--doc-link/--doc-radius`
  - 在 `@media (prefers-color-scheme: dark)` 覆盖变量值
  - 定义 `.doc-root`：`background/color/min-height`
  - 定义 `.doc-main`：`max-width: 960px`、`padding: 32px 16px`，并覆盖正文排版（建议以下最小起始值）
    - `line-height: 1.7`
    - `h1`: `font-size: 30px; margin: 0 0 16px; font-weight: 800`
    - `h2`: `font-size: 24px; margin: 28px 0 12px; font-weight: 800`
    - `h3`: `font-size: 18px; margin: 20px 0 10px; font-weight: 700`
    - `p`: `margin: 0 0 12px`
    - `ul/ol`: `margin: 0 0 12px; padding-left: 1.25em`
    - `li`: `margin: 0 0 8px`
    - `hr`: `border: none; border-top: 1px solid var(--doc-border); margin: 24px 0`
    - `a`: `color: var(--doc-link); text-decoration: underline; text-underline-offset: 2px`
    - 行内 `code`: `background: var(--doc-code-bg); padding: 0.2em 0.45em; border-radius: 6px; font-size: 0.95em; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`
    - 代码块 `pre`: `background: var(--doc-code-bg); padding: 14px; border-radius: 10px; overflow-x: auto; color: var(--doc-fg)`
  - 确保正文选择器限定在 `.doc-main`，避免污染其它区域

```bash
git status --porcelain=v1
Expected: working tree 未报错（不要求无改动）
```

### Step 2: 创建 `BaseLayout.astro`（head/body/main + 引入全局样式）

- [ ] 创建 `packages/docs/src/layouts/BaseLayout.astro`
  - props：`title: string`, `canonical?: string`, `description?: string`
  - 使用 Astro `<slot />` 注入页面内容
  - 输出：
    - `<html lang="zh-CN">`
    - `<head>`：必须包含 `charset/viewport/title`，`canonical` 输出 `<link rel="canonical">`，`description` 输出 `<meta name="description">`
    - `<body class="doc-root">`
    - `<main class="doc-main"><slot /></main>`
  - 只在 `BaseLayout` 内引入一次：`import "../styles/global.css";`

```bash
pnpm -C packages/docs run typecheck
Expected: 命令退出码为 0
```

### Step 3: 提交

- [ ] `git add` 新文件并提交

```bash
git add packages/docs/src/styles/global.css packages/docs/src/layouts/BaseLayout.astro
git commit -m "docs: add global css and base layout"
Expected: commit 成功
```

---

## Task 2: 统一 `DemoBlock` 外观（变量化颜色）

**Files:**

- Modify: `packages/docs/src/components/demos/DemoBlock.astro`

### Step 1: 把写死颜色替换为 `--doc-*` 变量

- [ ] 修改 `DemoBlock.astro`
  - `.demo-block`：
    - `border` 从 `#e5e7eb` 改为 `var(--doc-border)`
    - `background` 从 `#fff` 改为 `var(--doc-card-bg)`
    - `border-radius` 从 `12px` 改为 `var(--doc-radius)`（或保留 `12px` 但需与 spec 一致）
    - `overflow: hidden` 保持不变
  - `.demo-block__preview`：
    - `border-bottom` 从 `#e5e7eb` 改为 `var(--doc-border)`
    - 背景使用组件容器的卡片背景（如需明确，可设置 `background: var(--doc-card-bg)`）
  - `.demo-block__source pre`（“查看源码”展开区的关键点）：
    - `background: var(--doc-code-bg)`
    - `color: var(--doc-fg)`
    - 保持现有 `font-size: 13px; line-height: 1.5`（或若你在实现中调整，需要同步到 spec 的最小值/一致性）
  - `.demo-block__source`：
    - 如 spec 需要“展开区背景一致”，确保展开区域不出现与卡片容器不同的背景色（实现时可显式 `background: var(--doc-card-bg)` 或依赖父容器背景；两者二选一并保持一致）

```bash
pnpm -C packages/docs run check:smoke:core
Expected: 命令退出码为 0
```

### Step 2: 提交

- [ ] `git add` 并提交

```bash
git add packages/docs/src/components/demos/DemoBlock.astro
git commit -m "docs: theme demo blocks via css variables"
Expected: commit 成功
```

---

## Task 3: 批量迁移页面以复用 `BaseLayout`

**Files:**

- Modify: `packages/docs/src/pages/index.astro`
- Modify: `packages/docs/src/pages/guide/getting-started.astro`
- Modify: `packages/docs/src/pages/guide/migration.astro`
- Modify: `packages/docs/src/pages/guide/theme.astro`
- Modify: `packages/docs/src/pages/guide/components/index.astro`
- Modify: `packages/docs/src/pages/guide/components/getting-started.astro`
- Modify: `packages/docs/src/pages/guide/components/accordion.astro`
- Modify: `packages/docs/src/pages/guide/components/alert.astro`
- Modify: `packages/docs/src/pages/guide/components/aspect-ratio.astro`
- Modify: `packages/docs/src/pages/guide/components/avatar.astro`
- Modify: `packages/docs/src/pages/guide/components/badge.astro`
- Modify: `packages/docs/src/pages/guide/components/box.astro`
- Modify: `packages/docs/src/pages/guide/components/button.astro`
- Modify: `packages/docs/src/pages/guide/components/card.astro`
- Modify: `packages/docs/src/pages/guide/components/center.astro`
- Modify: `packages/docs/src/pages/guide/components/checkbox.astro`
- Modify: `packages/docs/src/pages/guide/components/code.astro`
- Modify: `packages/docs/src/pages/guide/components/divider.astro`
- Modify: `packages/docs/src/pages/guide/components/dropdown.astro`
- Modify: `packages/docs/src/pages/guide/components/flex.astro`
- Modify: `packages/docs/src/pages/guide/components/grid.astro`
- Modify: `packages/docs/src/pages/guide/components/group.astro`
- Modify: `packages/docs/src/pages/guide/components/heading.astro`
- Modify: `packages/docs/src/pages/guide/components/highlight.astro`
- Modify: `packages/docs/src/pages/guide/components/icon.astro`
- Modify: `packages/docs/src/pages/guide/components/input.astro`
- Modify: `packages/docs/src/pages/guide/components/list.astro`
- Modify: `packages/docs/src/pages/guide/components/link.astro`
- Modify: `packages/docs/src/pages/guide/components/modal.astro`
- Modify: `packages/docs/src/pages/guide/components/number-input.astro`
- Modify: `packages/docs/src/pages/guide/components/page-container.astro`
- Modify: `packages/docs/src/pages/guide/components/password-input.astro`
- Modify: `packages/docs/src/pages/guide/components/pin-input.astro`
- Modify: `packages/docs/src/pages/guide/components/popup.astro`
- Modify: `packages/docs/src/pages/guide/components/radio.astro`
- Modify: `packages/docs/src/pages/guide/components/rating.astro`
- Modify: `packages/docs/src/pages/guide/components/scroll-area.astro`
- Modify: `packages/docs/src/pages/guide/components/segmented-control.astro`
- Modify: `packages/docs/src/pages/guide/components/separator.astro`
- Modify: `packages/docs/src/pages/guide/components/spinner.astro`
- Modify: `packages/docs/src/pages/guide/components/stack.astro`
- Modify: `packages/docs/src/pages/guide/components/steps.astro`
- Modify: `packages/docs/src/pages/guide/components/switch.astro`
- Modify: `packages/docs/src/pages/guide/components/tabs.astro`
- Modify: `packages/docs/src/pages/guide/components/text.astro`
- Modify: `packages/docs/src/pages/guide/components/textarea.astro`
- Modify: `packages/docs/src/pages/guide/components/toast.astro`

### Step 1: 为每个页面改为使用 `BaseLayout`

- [ ] 对上述每个页面执行统一迁移模板：
  - `import BaseLayout from "../../layouts/BaseLayout.astro"`（按相对路径调整）
  - 删除页面内重复的 `<html>/<head>/<body>/<main>`
  - `<main>` 内容替换为 `BaseLayout` 的 `<slot />` 注入（即页面里只保留原来的 MDX/组件渲染内容）
  - 将旧页面的：
    - `<title>` -> `BaseLayout` 的 `title`
    - `<link rel="canonical" href="...">` -> `canonical`
    - `<meta name="description" content="...">` -> `description`

```bash
pnpm -C packages/docs run typecheck
Expected: 命令退出码为 0，且无 Astro/TS 编译错误
```

### Step 1.5: 覆盖率确认（避免漏迁移）

- [ ] 用静态检查确认“没有页面还残留旧 HTML 结构”，例如：

```bash
rg '<html lang="zh-CN">' packages/docs/src/pages -g"*.astro"
Expected: 输出为空（0 行）
```

- [ ] 再确认所有页面都引用了 `BaseLayout`（至少包含关键页面目录）：

```bash
rg 'BaseLayout' packages/docs/src/pages -g"*.astro"
Expected: 输出包含上述所有迁移目标文件（无明显漏改）
```

### Step 2: 提交（建议分两次：先 guide，再 guide/components）

- [ ] 为降低回滚成本，先提交：
  - `packages/docs/src/pages/index.astro`
  - `packages/docs/src/pages/guide/*.astro`
- [ ] 再提交：
  - `packages/docs/src/pages/guide/components/**/*.astro`

```bash
git add packages/docs/src/pages/index.astro packages/docs/src/pages/guide/*.astro
git commit -m "docs: migrate top pages to BaseLayout"
Expected: commit 成功
```

```bash
git add packages/docs/src/pages/guide/components/**/*.astro
git commit -m "docs: migrate component pages to BaseLayout"
Expected: commit 成功
```

---

## Task 4: 验证样式效果（浅/深色 + 关键元素）

**Files:**

- Modify: none（验证）

### Step 1: 本地运行并手动核对（浅色/深色）

- [ ] 在开发环境中验证关键页面：
  - `/`（`packages/docs/src/pages/index.astro`）
  - `/guide/getting-started`
  - `/guide/components`
  - `/guide/components/button`（挑一个代表组件页）
- [ ] 核对点：
  - `.doc-main` 的最大宽度与边距是否符合“宽松现代”（max-width 960px，padding 32px 16px）
  - 正文标题层级间距是否清晰
  - 链接、行内 code、代码块 `pre` 的背景/圆角是否在浅/深色下都可读
  - `DemoBlock` 的卡片边框和背景在浅/深色下是否一致且不“突兀”
  - `DemoBlock` 展开后的“查看源码”区域（`details > pre`）在浅/深色下的：
    - `pre` 背景（必须来自 `--doc-code-bg`）
    - `pre` 文字颜色（必须来自 `--doc-fg`）

```bash
pnpm -C packages/docs run dev:docs
Expected: dev server 正常启动（命令未立刻退出，浏览器可访问）
```

### Step 2: Smoke 校验

- [ ] 再次运行：

```bash
pnpm -C packages/docs run check:smoke:core
Expected: 退出码为 0
```

### Step 3:（可选）提交验证后的小修

- [ ] 如果发现正文选择器遗漏（例如 blockquote/table），补齐 `global.css` 并提交

---

## Execution Choice Handoff（给最终执行者）

Plan complete and saved.

Two execution options:

1. Subagent-Driven (recommended) - dispatch a fresh subagent per task, review between tasks.
2. Inline Execution - execute tasks in this session using executing-plans.

Which approach?

（本 plan 默认选择 Option 1。）
