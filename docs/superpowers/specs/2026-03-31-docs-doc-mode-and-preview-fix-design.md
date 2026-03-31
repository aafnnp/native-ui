# 2026-03-31 Docs 文档模式重构与预览交互修复设计

## 背景

当前 `packages/docs` 已完成基础排版统一，但仍存在两类核心问题：

1. 页面结构仍偏“单栏正文”，信息架构不够接近成熟文档站（参考 Chakra 文档结构）
2. 组件示例预览存在交互失效问题（典型报错：`Cannot read properties of null (reading 'useState')`），导致“可见但不可交互”

## 目标

本次设计聚焦 `packages/docs`，目标如下：

1. 重构为文档模式三栏布局（桌面端）：左侧导航树 + 主内容 + 右侧目录
2. 增加顶部最简搜索（先支持页面标题/组件名过滤）
3. 修复示例预览交互链路，确保按钮等组件有视觉反馈且 `onPress` 可触发
4. 保持最小改动范围，不改 MDX 内容，不扩大到其他包

## 非目标

1. 不实现全文搜索索引（例如 Algolia/Lunr 等）
2. 不大规模重构 demo 注册模型
3. 不改动组件库业务逻辑，仅修复 docs 侧运行时接入问题
4. 不引入额外重型 UI 框架

## 用户确认的方向

在布局方向选择中，已确认采用：

- 主方向：**B（三栏：左侧导航 + 主内容 + 右侧目录）**
- 增量能力：**1 左侧导航树 / 2 右侧目录 / 3 顶部最简搜索**

在预览问题定位中，已确认：

- 主要问题类型：**交互失效（C）**
- 典型组件：**Button**
- 期望标准：**视觉反馈 + 事件触发均有效（C）**

## 总体方案（推荐）

采用“先止血、后重构”的顺序：

1. 先修复 demo 运行时一致性与交互链路（解决 `useState` 空指针）
2. 再接入三栏文档壳层与导航能力
3. 最后补顶部最简搜索

这样可以避免布局重构阶段被运行时故障干扰，并保证每一步可独立验收。

## 范围边界约束（防止扩 scope）

1. 本次仅接入以下页面做文档壳层验收闭环：
   - `/guide/getting-started`
   - `/guide/components`
   - `/guide/components/button`
2. 其他 `guide` 页面可按同样方式渐进迁移，但不作为本次强制范围
3. 不修改 `packages/ui/**` 业务实现
4. 不改 `src/demos/registry.ts` 的数据结构，仅允许补充字段内容

## 架构设计

### 1) 分层结构

- `DocShell`（文档壳层）
  - 负责页面骨架与区域编排：顶部栏、左导航、主内容、右 TOC
- `DocContent`（内容承载层）
  - 承载现有 MDX/Astro 页面内容，保持内容文件最小改动
- `DemoRuntime`（示例运行时层）
  - 负责 demo 动态加载、错误边界、交互渲染，不与布局层耦合

### 2) 模块边界

- `src/layouts/`
  - 在现有 `BaseLayout.astro` 基础上演进文档壳层能力，保留 `title/canonical/description` 兼容入口
- `src/components/docs/`（新增）
  - 放置纯展示组件：`SidebarNav`、`RightToc`、`TopSearchLite`
- `src/components/demos/`
  - 保留 `DemoBlock.astro`、`DemoRenderer.tsx`，仅做运行时修复与必要增强
- `src/demos/registry.ts`
  - 保持为 demo 注册中心，不混入导航与布局数据

## 数据流与交互设计

### 1) 页面装配流

路由页（`src/pages/guide/**`）继续只做内容引入与 meta 传递，统一通过文档布局装配：

1. `DocShell` 读取当前路径
2. 左侧 `SidebarNav` 根据路径高亮
3. 中间渲染 `<slot />` 内容
4. 右侧 `RightToc` 根据页面标题锚点生成目录

### 2) 左侧导航树（能力 1）

- 初期数据来源：
  - Guide 固定页面列表
  - Components 复用现有 `componentSlugs`
- 高亮规则：基于 `Astro.url.pathname` 精确匹配
- 移动端策略：先做最简折叠/抽屉，不引入复杂交互库

### 3) 右侧目录 TOC（能力 2）

- 目录来源：当前主内容中的 `h2/h3[id]`
- 功能：
  - 点击跳转锚点
  - 滚动高亮当前章节
- 容错：若页面不存在可用标题，显示空态提示，不影响正文

### 4) 顶部最简搜索（能力 3）

- 范围：仅页面标题/组件名过滤
- 数据：预置轻量索引（title + path）
- 行为：输入即过滤，点击跳转
- 非目标：不做全文检索

### 5) 示例预览链路修复

链路保持不变：`DemoBlock` -> `DemoRenderer` -> `demoRegistry.load()`

修复重点：

1. 保证 docs 端 React runtime 一致性，消除 `useState` 空指针
2. 确保 `DemoRenderer` 客户端水合后，事件系统正常工作
3. 增加可观察反馈（至少一个可验证 demo）用于确认事件触发与视觉按压态

最小技术路径（按顺序执行）：

1. 检查 docs 侧 React/ReactDOM 解析来源，确保 demo 运行时为单实例
2. 校验 `DemoRenderer` 的客户端加载边界（仅在客户端执行 hooks）
3. 在 `button-basic` 添加可见交互观测点（例如点击计数）
4. 再回归其他交互组件（Accordion/Modal/Tabs）

## 错误处理设计

### DemoRuntime

- `load` 失败：提示“示例加载失败（id）”
- `render` 失败：提示“示例渲染失败（id）”
- runtime 异常：输出可诊断日志（避免“无反应但无说明”）

### 文档壳层

- `RightToc` 无数据时空态显示
- 搜索无结果时显示空结果提示
- 任一侧栏异常不阻塞主内容展示

## 实施步骤

1. 修复 docs 端 demo 运行时一致性问题（优先）
2. 抽出/扩展文档壳层为三栏结构
3. 新增左侧导航树组件并接入页面路由高亮
4. 新增右侧 TOC 组件并接入锚点滚动高亮
5. 新增顶部最简搜索并接入静态索引
6. 校验移动端折叠体验与降级路径
7. 回归 demo 交互行为，确认 Button 等示例可点击且有反馈

## 里程碑与完成定义（DoD）

### M1：预览交互修复

- 完成项：
  1. 消除 `DemoRenderer` 相关 `useState` 空指针报错
  2. `button-basic` 增加可观察交互反馈（例如点击计数或可见文案变化）
- DoD：
  - `/guide/components/button` 在浏览器内连续点击可触发事件
  - 控制台无 `Cannot read properties of null (reading 'useState')`

### M2：三栏文档壳层

- 完成项：
  1. 桌面端三栏结构接入主文档页面
  2. 左侧导航树可分组并高亮当前项
  3. 右侧 TOC 可渲染并跳转
- DoD：
  - 断点 `>= 1280px` 时页面为三栏（左/中/右）
  - 断点 `769px - 1279px` 时页面为双栏（左/中，右 TOC 收起）
  - 以下页面均可正常访问且布局一致：
    - `/guide/getting-started`
    - `/guide/components`
    - `/guide/components/button`

### M3：顶部最简搜索与移动端降级

- 完成项：
  1. 顶部搜索支持标题/组件名过滤
  2. 移动端导航折叠/抽屉可用
- DoD：
  - 输入 `button` 可命中并跳转 `/guide/components/button`
  - 搜索匹配规则：大小写不敏感，支持子串匹配（标题与组件名）
  - 断点 `<= 768px` 时右侧 TOC 不阻塞正文阅读，左导航可展开/收起

## 验收标准

### A. 预览交互修复

1. `/guide/components/button` 示例点击可触发 `onPress`
2. hover/active/pressed 状态可见
3. 浏览器控制台不再出现 `Cannot read properties of null (reading 'useState')`

### B. 文档模式（B + 1/2/3）

1. 在 `>= 1280px` 下，桌面端三栏布局稳定显示
2. 左导航树至少包含 `Guide` 与 `Components` 两组，当前页路径匹配时高亮
3. 右 TOC 基于 `h2/h3[id]` 生成，可跳转并滚动高亮
4. 顶部搜索可按标题/组件名筛选并跳转

### C. 响应式与可用性

1. 移动端可阅读，导航可折叠
2. 右 TOC 在小屏可隐藏，不影响正文
3. 无目录页面、无搜索结果页面均有合理空态

## 验收方法（手动）

1. 运行 `pnpm dev:docs`，访问 `/guide/components/button`
2. 在按钮示例区点击按钮，观察可见反馈（文案/计数变化）与按压样式
3. 打开浏览器控制台，确认不存在 `useState` 空指针错误
4. 访问 `/guide/components/button`，桌面宽屏下确认三栏结构
5. 点击左侧导航与右侧 TOC，确认跳转与高亮逻辑一致
6. 在顶部搜索输入 `button`，选择结果并跳转
7. 切换到移动端宽度（`<= 768px`），确认导航可折叠且正文可连续阅读

## 验收方法（异常场景）

1. 打开无 `h2/h3[id]` 的页面，确认右 TOC 显示空态且不报错
2. 在搜索框输入不存在关键词，确认显示“无结果”状态且页面不抖动
3. 人工制造一个不存在 demo id（仅本地临时验证），确认显示“示例加载失败（id）”

## 风险与缓解

1. **风险：React runtime 不一致定位耗时**
   - 缓解：先最小复现 Button demo，检查依赖树与打包产物中 React 实例来源，确认运行时单实例
2. **风险：TOC 抽取在不同页面结构不稳定**
   - 缓解：限定仅识别 `h2/h3[id]`，无 id 则忽略
3. **风险：搜索范围扩张导致复杂度上升**
   - 缓解：明确本次仅做标题/组件名过滤

## 影响范围

主要影响：

- `packages/docs/src/layouts/*`
- `packages/docs/src/components/docs/*`（新增）
- `packages/docs/src/components/demos/*`（小幅修改）
- `packages/docs/src/pages/guide/**/*.astro`（小幅接入）

不影响：

- `packages/ui` 组件业务逻辑
- 非 docs 包

## 参考

- Chakra UI 文档信息架构与组件文档组织：<https://chakra-ui.com/>
