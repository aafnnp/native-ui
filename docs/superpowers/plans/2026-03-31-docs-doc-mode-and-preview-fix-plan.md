# Docs 文档模式与预览修复实施计划

> 基于规格：`docs/superpowers/specs/2026-03-31-docs-doc-mode-and-preview-fix-design.md`

## 目标

1. 修复 docs 中 demo 预览交互失效（`useState` 空指针、Button 点击无效）
2. 落地三栏文档模式（左导航树 + 主内容 + 右 TOC）
3. 增加顶部最简搜索（标题/组件名过滤）

## 执行原则

1. 先修运行时，再改布局，最后补搜索
2. 最小改动，优先集中在 `packages/docs`
3. 每个里程碑可独立验收与回归

---

## M1: 预览交互修复（优先）

**涉及文件（预估）**

- `packages/docs/astro.config.*`（若需补别名/去重）
- `packages/docs/vite.config.*`（若存在并需补 `resolve.dedupe`）
- `packages/docs/src/components/demos/DemoRenderer.tsx`
- `packages/docs/src/demos/components/button/basic.tsx`（增加可观察交互反馈）

### 任务清单

- [ ] 定位 React runtime 不一致根因（依赖解析来源、打包产物、客户端水合边界）
- [ ] 保证 docs 侧 React 单实例运行时（必要时补 dedupe/alias）
- [ ] 校验 `DemoRenderer` 仅在客户端运行 hooks，避免空运行时
- [ ] 在 `button-basic` 增加可见反馈（例如点击计数）便于验收
- [ ] 回归 `Accordion` / `Modal` / `Tabs` 基础交互

### 验收

- [ ] `/guide/components/button` 点击可触发行为且有视觉反馈
- [ ] Console 无 `Cannot read properties of null (reading 'useState')`

---

## M2: 三栏文档壳层

**涉及文件（预估）**

- `packages/docs/src/layouts/BaseLayout.astro`（扩展为 DocShell）
- `packages/docs/src/styles/global.css`
- `packages/docs/src/components/docs/SidebarNav.astro`（新增）
- `packages/docs/src/components/docs/RightToc.astro` 或 `.tsx`（新增）
- `packages/docs/src/pages/guide/getting-started.astro`
- `packages/docs/src/pages/guide/components/index.astro`
- `packages/docs/src/pages/guide/components/button.astro`

### 任务清单

- [ ] 在布局层实现桌面三栏区域编排
- [ ] 新增左侧导航树（Guide + Components）并接入当前路径高亮
- [ ] 新增右侧 TOC（读取 `h2/h3[id]`，支持跳转与高亮）
- [ ] 定义断点行为：
  - `>=1280px` 三栏
  - `769-1279px` 双栏（右 TOC 收起）
  - `<=768px` 移动端（右 TOC 隐藏）

### 验收

- [ ] `/guide/getting-started`、`/guide/components`、`/guide/components/button` 在桌面端均为三栏
- [ ] 左导航当前项高亮准确
- [ ] 右 TOC 可跳转并跟随滚动高亮

---

## M3: 顶部最简搜索与移动端降级

**涉及文件（预估）**

- `packages/docs/src/components/docs/TopSearchLite.astro` 或 `.tsx`（新增）
- `packages/docs/src/components/docs/search-index.ts`（新增）
- `packages/docs/src/layouts/BaseLayout.astro`（接入搜索栏）

### 任务清单

- [ ] 构建轻量索引（title + path）
- [ ] 实现大小写不敏感 + 子串匹配过滤
- [ ] 实现结果点击跳转
- [ ] 实现“无结果”空态
- [ ] 移动端导航抽屉/折叠开关接入

### 验收

- [ ] 输入 `button` 可命中并跳转 `/guide/components/button`
- [ ] 输入不存在关键词显示空态，不影响页面稳定性
- [ ] `<=768px` 下导航可展开/收起，正文可连续阅读

---

## 统一回归清单

- [ ] 运行 `pnpm --filter kra-ui-docs dev`，手工检查关键页面
- [ ] 运行 `pnpm -C packages/docs run typecheck`
- [ ] 运行 `pnpm -C packages/docs run check:smoke:core`
- [ ] 深浅色模式下检查 DemoBlock、代码块、导航对比度

## 风险与处理

1. React runtime 问题定位不稳定
   - 先固定最小复现（Button），再扩展到其他 demo
2. TOC 提取受页面结构影响
   - 严格限定 `h2/h3[id]`，无 id 即忽略
3. 范围漂移
   - 本次仅保证 3 个核心页面闭环，其他页面后续渐进迁移
