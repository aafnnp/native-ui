# 2026-03-31 Docs 样式统一设计

## 背景与问题

当前 `packages/docs` 的页面与示例区域样式主要依赖各页面重复的最小 HTML 结构以及组件示例区 `DemoBlock.astro` 内部的局部 `<style>`。

这会带来两个问题：

1. 文档的“正文排版”和“示例卡片外观”难以统一（缺少统一入口）
2. 暗色模式下示例卡片/代码块边框与背景若仍写死浅色，将出现明显观感不一致

## 目标

本次修改聚焦在 `packages/docs`：

1. 全局统一文档正文的基础排版（标题层级、段落间距、链接样式、代码/代码块观感）
2. 统一示例卡片 `DemoBlock.astro` 的外观（卡片背景、边框、代码区与展开按钮区域）
3. 暗色/浅色模式跟随系统 `prefers-color-scheme` 自动切换
4. 保持改动边界尽量清晰，避免影响非文档包

## 非目标（不做）

1. 不引入或重构完整导航/侧边栏（当前 docs 页面结构较简化）
2. 不强绑定 `kra-ui` 主题令牌（本次选择文档侧 CSS 变量驱动颜色）
3. 不改变各 MDX 内容本身（仅调整外层样式与排版容器）

## 约束与设计原则

1. 样式入口尽量“唯一”：新增 `global.css` 作为文档样式源，并由布局组件只注入一次
2. 深浅色通过 CSS 变量 + `prefers-color-scheme: dark` 覆盖，而不是在多个文件里写死颜色
3. 维护性优先：后续要微调观感时，只需改 `global.css` 或极少数局部样式

## 方案概述（推荐方案）

采用“布局 + 全局样式 + 组件示例变量化”的组合：

1. 新增 `packages/docs/src/styles/global.css`
2. 新增 `packages/docs/src/layouts/BaseLayout.astro`：只在布局里引入 `global.css`，并提供 `main` 的容器与排版 class
3. 将 `packages/docs/src/pages/**.astro` 统一改为使用 `BaseLayout`（减少每个页面重复的 `<html>/<head>/<body>/<main>`）
4. 将 `packages/docs/src/components/demos/DemoBlock.astro` 中写死的浅色（例如 `#fff`、`#e5e7eb`）替换为读取文档 CSS 变量

## 详细设计

### 1) BaseLayout 的接口

`BaseLayout.astro` 需要接收：

1. `title`：页面标题
2. `canonical`：规范链接（可选）
3. `description`：SEO 描述（可选）
4. 页面内容：通过 Astro 的 `<slot />` 注入（即页面在布局内渲染自己的 MDX 内容）

布局输出：

- `<html lang="zh-CN">` 固定语言
- `<head>` 最小清单：
  - `<meta charset="utf-8" />`
  - `<meta name="viewport" content="width=device-width, initial-scale=1" />`
  - `<title>{title}</title>`
  - `canonical` 存在时输出：`<link rel="canonical" href={canonical} />`
  - `description` 存在时输出：`<meta name="description" content={description} />`
- `<body class="doc-root">`
- `<main class="doc-main">` 承载正文内容（正文宽度与留白由 `global.css` 控制）
- `BaseLayout.astro` 中通过 `import "../styles/global.css";`（或等价路径）只注入一次全局样式

页面迁移对照规则（用于实现落地与验收）：

1. 旧页面的 `<title>` -> `BaseLayout` 的 `title` prop
2. 旧页面的 `<link rel="canonical" href="...">` -> `canonical` prop（页面没有则可不传）
3. 旧页面的 `<meta name="description" content="...">` -> `description` prop（页面没有则布局不输出该 meta）
4. 旧页面里原先重复的 charset/viewport head 元素在迁移后删除（交由 `BaseLayout` 统一生成）

迁移范围说明：

- 当前 `packages/docs/src/pages/**.astro` 的 head 元素主要围绕 `title` / `canonical` / `description` 展开，因此三项映射足以覆盖本次样式统一的迁移需求。
- 若未来出现额外的页面级 head 元素，本次可以通过扩展 `BaseLayout` 的“可插槽 head Extras”策略或对单页保留特殊实现来处理（本次不纳入范围）。

### 2) global.css 的 CSS 变量与暗色实现

新增文档语义变量（建议命名以 `--doc-*` 开头）：

- `--doc-bg`：页面背景
- `--doc-fg`：正文文字颜色
- `--doc-muted`：次级文字（段落说明/注释）
- `--doc-border`：边框与分隔线
- `--doc-card-bg`：示例卡片背景
- `--doc-code-bg`：代码块背景
- `--doc-link`：链接颜色
- `--doc-radius`：统一圆角

实现：

- 浅色：在 `:root` 定义默认变量值
- 深色：通过 `@media (prefers-color-scheme: dark)` 覆盖上述变量值

落点（关键选择器最小定义）：

1. `.doc-root`：
   - `background: var(--doc-bg)`
   - `color: var(--doc-fg)`
   - （建议）`min-height: 100vh`
2. `.doc-main`：
   - 链接/代码样式限制在 `.doc-main` 作用域下，避免影响其它区域：
     - `a { color: var(--doc-link) }`
     - `code` / `pre` 背景使用 `--doc-code-bg`

变量取值建议（便于实现时形成可验收的“初始效果”，后续可再微调）：
| 变量 | 浅色（默认） | 深色（dark） |
| --- | --- | --- |
| `--doc-bg` | `#ffffff` | `#0b1220` |
| `--doc-fg` | `#111827` | `#e5e7eb` |
| `--doc-muted` | `#4b5563` | `#9ca3af` |
| `--doc-border` | `#e5e7eb` | `#1f2937` |
| `--doc-card-bg` | `#ffffff` | `#111827` |
| `--doc-code-bg` | `#f3f4f6` | `#0f172a` |
| `--doc-link` | `#2563eb` | `#60a5fa` |
| `--doc-radius` | `12px` | `12px` |

### 3) 正文排版规则（doc-main 作用域）

在 `.doc-main` 下定义：

1. `max-width: 960px`，居中布局；`padding: 32px 16px`
2. 基础排版（建议起始值，后续可微调）：
   - `line-height: 1.7`
   - `h1`: `font-size: 30px; margin: 0 0 16px; font-weight: 800`
   - `h2`: `font-size: 24px; margin: 28px 0 12px; font-weight: 800`
   - `h3`: `font-size: 18px; margin: 20px 0 10px; font-weight: 700`
   - `p`: `margin: 0 0 12px; color: var(--doc-fg)`
   - `ul/ol`: `margin: 0 0 12px; padding-left: 1.25em`
   - `li`: `margin: 0 0 8px`
   - `hr`: `border: none; border-top: 1px solid var(--doc-border); margin: 24px 0`
3. 文本与代码：
   - `a`: `color: var(--doc-link); text-decoration: underline; text-underline-offset: 2px`
   - 行内 `code`: `background: var(--doc-code-bg); padding: 0.2em 0.45em; border-radius: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 0.95em`
   - 代码块 `pre`: `background: var(--doc-code-bg); padding: 14px; border-radius: 10px; overflow-x: auto`
4. 与 `DemoBlock` 的关系：
   - `DemoBlock` 的卡片/代码块样式仍由它自身局部 `<style>` 决定，但其颜色变量读取自 `global.css`，避免暗色突兀

### 4) DemoBlock.astro 的变量化

保持 `DemoBlock.astro` 结构与局部 CSS 组织方式不大幅改变，只替换颜色来源：

1. `.demo-block` 背景、边框、圆角与溢出裁剪改用文档变量
2. `.demo-block__preview` 与 `.demo-block__source` 的边框/背景改用文档变量
3. `.demo-block__source pre` 的 `background`、文字颜色、字体大小与行高读取文档变量（必要时可继续保留原有尺寸值）

硬编码色到变量的映射（用于实现时减少选择偏差）：

- `#e5e7eb`（边框、分隔线） -> `var(--doc-border)`
- `#fff`（卡片/预览区域背景） -> `var(--doc-card-bg)`
- 链接/默认文字颜色未在 `DemoBlock` 中显式设置时，依赖 `.doc-root` 的 `color: var(--doc-fg)` 即可
- 代码块背景（若 DemoBlock 后续扩展为代码区背景） -> `var(--doc-code-bg)`

目标是：暗色模式下卡片与代码区域观感一致，不出现“白底突兀”的问题。

## 受影响文件（范围）

1. 新增
   - `packages/docs/src/styles/global.css`
   - `packages/docs/src/layouts/BaseLayout.astro`
2. 修改
   - `packages/docs/src/pages/**.astro`：将页面顶层 HTML 结构迁移到布局（保留 MDX 内容不动）
   - `packages/docs/src/components/demos/DemoBlock.astro`：用 CSS 变量替换写死颜色

## 实现步骤（概要）

1. 新建 `global.css`：实现 CSS 变量、深浅色覆盖、正文排版规则
2. 新建 `BaseLayout.astro`：在布局内引入 `global.css`，并统一 `main` 容器结构
3. 批量将 `packages/docs/src/pages/**.astro` 改为使用 `BaseLayout`：
   - 删除旧页面重复的 `<html>/<head>/<body>/<main>` 结构
   - 保留各自的 MDX 内容，并将旧的 `<title>`/`canonical`/`description` 映射到布局 props
4. 更新 `DemoBlock.astro`：用 `--doc-*` 变量替换 `#fff/#e5e7eb` 等写死值
5. 本地验证：运行 `pnpm dev:docs`，检查浅/暗色模式切换效果与代码块溢出行为

## 验证与测试

手动验证（优先）：

1. 浏览器里将系统颜色模式切换为浅色/深色（或通过开发者工具模拟 `prefers-color-scheme`）
2. 检查 `main` 的宽度是否为约 `960px`，以及页面留白是否符合“宽松现代”
3. 展开 `DemoBlock` 的“查看源码”区域，确认 `pre` 的背景、边框与文字颜色在深色下仍清晰可读

自动校验（如可用）：

1. 运行 `pnpm` docs 侧已有的 `check:smoke`（若不受限于样式改动）
