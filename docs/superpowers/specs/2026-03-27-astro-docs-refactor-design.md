# Astro 重构 `packages/docs` 设计说明

## 1. 背景与目标

当前文档站基于 React Router 7 + Markdown 路由生成，用户希望：

- 全量迁移到 Astro（替换现有站点）
- 在文档内实现组件效果预览
- 预览使用真实 `kra-ui` 组件直渲染（非 mock）
- 部署链路允许调整，以简单稳定为优先

本设计聚焦首阶段可落地方案：**静态代码块 + 实时渲染结果**，暂不包含在线可编辑 Playground。

## 2. 范围

### 2.1 In Scope

- `packages/docs` 重构为 Astro 工程
- 文档内容迁移到 MDX
- 建立统一 demo 渲染机制（`DemoBlock` + registry）
- 文档内示例渲染真实 `kra-ui` 组件
- 构建、开发、部署脚本切换到 Astro 方案

### 2.2 Out of Scope

- 在线可编辑 Playground（后续增量）
- 与本次目标无关的 UI 重做
- `packages/ui` 对外 API 语义调整

## 3. 方案对比与结论

### 3.1 方案 A（推荐）

**Astro + MDX + React Islands + Demo 注册表**

- 文档页由 Astro 路由与布局负责
- 示例预览由 React island 挂载
- 每个 demo 通过 registry 进行受控映射

优点：落地快、与现有 React 生态兼容、迁移风险最低。  
缺点：需要处理 `kra-ui` 在 web 渲染时的依赖与 alias。

### 3.2 方案 B

**MDX 内直接书写示例 JSX（弱约束）**

优点：上手快。  
缺点：长期维护困难，示例分散且难校验，不利于批量治理。

### 3.3 方案 C

**运行时代码编译执行（轻 sandbox）**

优点：可自然扩展为 Playground。  
缺点：复杂度和风险高，不符合当前快速稳定迁移目标。

### 3.4 结论

采用方案 A，后续如需 Playground，在方案 A 基础上增量扩展。

## 4. 目标架构

```text
MDX 文档
  -> <DemoBlock id="..."/>
    -> demo registry（id -> DemoComponent/source/meta）
      -> DemoRenderer（React island + ErrorBoundary）
        -> 真实 kra-ui 组件渲染
```

分层职责：

- `Astro 页面层`：路由、布局、SEO、静态内容组织
- `DemoBlock`：预览容器、标题描述、源码展示、容错外壳
- `DemoRenderer`：运行时挂载与错误隔离
- `registry`：统一映射与元数据源
- `demo components`：按组件维度组织示例实现

## 5. 目录与模块设计（建议）

```text
packages/docs/
  src/
    content/
      docs/
        guide/components/*.mdx
    components/
      docs/DocsLayout.astro
      demos/DemoBlock.astro
      demos/DemoRenderer.tsx
    demos/
      registry.ts
      components/
        accordion/
          basic.tsx
          multiple.tsx
          variants.tsx
      sources/
        accordion.ts
```

说明：

- `components/demos` 仅负责“展示容器”
- `demos/components` 仅负责“示例逻辑”
- `demos/sources` 用于源码字符串集中管理，避免文档与示例分离失真

## 6. 示例渲染与代码展示设计

## 6.1 MDX 用法

在文档中使用：

```mdx
<DemoBlock id="accordion-basic" />
```

## 6.2 registry 结构

建议结构：

```ts
type DemoDefinition = {
  id: string;
  title: string;
  description?: string;
  DemoComponent: React.ComponentType;
  sourceCode: string;
};
```

约束：

- `id` 全局唯一
- `sourceCode` 与 `DemoComponent` 对应同一示例语义
- 缺失映射在构建阶段报错（避免运行时发现）

## 6.3 渲染策略

- 默认 `client:visible` 减少首页脚本负担
- 必须首屏即时可见的 demo 可局部改为 `client:load`
- 不使用运行时代码编译，保持稳定和可调试性

## 6.4 错误隔离

- `DemoRenderer` 内置 ErrorBoundary
- 单个 demo 失败不影响整页内容
- 错误 UI 展示 demo id 与最小可读信息，便于定位

## 7. 与 `kra-ui` 的兼容策略

为确保“真实组件直渲染”：

- 文档站直接依赖工作区 `kra-ui` 包
- 配置 React Native Web alias 以适配浏览器环境
- 在 docs 入口集中注入必要样式与主题 Provider
- 对个别不兼容组件建立显式降级策略（告警但不阻塞全站构建）

### 7.1 兼容性矩阵（首版）

| 类别 | 判定标准 | 上线策略 | 用户可见行为 |
| --- | --- | --- | --- |
| 可直渲染 | 浏览器可正常渲染、交互正确、无严重样式错位 | 必须通过 | 展示实时预览 |
| 需降级 | 功能可展示但交互或样式存在可接受偏差 | 允许上线，需在文档注明“受限预览” | 展示静态说明 + 简化预览 |
| 阻断项 | 运行时报错、页面崩溃、严重误导示例行为 | 阻断上线 | 不展示预览，构建失败并报错 |

### 7.2 首批高风险组件清单

- `Modal` / `Popup`（Portal、层级、滚动锁定）
- `Toast`（挂载容器与时序）
- `ScrollArea`（滚动行为差异）
- `Tabs` / `SegmentedControl`（交互状态同步）
- `PinInput` / `NumberInput`（输入行为与键盘差异）

## 8. 路由与内容迁移策略

- 从 `content/**/*.md` 迁移到 `src/content/docs/**/*.mdx`
- 旧的 `app/routes/*.tsx` 自动生成链路下线
- 旧 `scripts/generate-docs-routes.mjs` 与其测试由新校验脚本替代
- 导航统一迁移到 `src/content.config.ts`（单一来源），不再保留双源维护

### 8.1 迁移映射与覆盖率对账

新增 `docs/superpowers/specs/2026-03-27-docs-migration-map.md` 维护映射表，字段至少包含：

- 旧路径（React Router）
- 新路径（Astro）
- 页面类型（组件/指南/主题/迁移）
- 状态（未迁移/已迁移/已废弃）
- 验收结果（通过/失败）

完成定义：

- 映射表中“未迁移”数量为 0
- 旧路径命中率 100%（可重定向或直接访问）
- 链接检查无死链

### 8.2 SEO 与重定向策略

- 保持原有 slug 优先，不必要不改 URL 语义
- 变更路径统一配置 301 重定向表
- 生成并校验 sitemap
- 对规范 URL 设置 canonical，避免重复收录

## 9. 构建与部署方案

## 9.1 本地开发

- `pnpm dev:docs` 切换为 Astro dev
- 保留 monorepo 命令入口不变（减少外层脚本改动）

## 9.2 构建

- `pnpm build:docs` 改为 Astro build
- 保留 typecheck 流程，但替换为 Astro/TS 对应命令

## 9.3 部署

优先采用 Astro 的 Cloudflare 适配方案（推荐 Pages adapter），原则：

- 减少自定义脚本
- 保持产物可预测
- 便于后续升级

### 9.4 发布与回滚

- 发布策略：先在预发布环境做完整 smoke test，再切生产
- 切换方式：保留旧站可回切窗口（至少 1 个发布周期）
- 责任角色：
  - 发布执行人：docs 维护者
  - 审批人：仓库 Owner 或指定 Reviewer
- 切换门槛：
  - 预发布 smoke 成功率 100%
  - 重定向命中率 >= 99%
  - 阻断级兼容问题数量 = 0
- RTO 目标：触发回滚后 15 分钟内恢复旧站可用
- 回滚触发：
  - 关键路由不可访问
  - 关键 demo 渲染失败
  - 大面积 5xx/白屏
- 回滚动作：
  1. 切回旧站构建产物
  2. 关闭新站流量入口
  3. 清理 CDN 缓存并复检关键路由
  4. 记录事故与补丁计划

建议 runbook 命令（以最终 CI 脚本名为准）：

1. 发布前检查  
   `pnpm --filter kra-ui-docs run check:smoke`
2. 生产切换  
   `pnpm --filter kra-ui-docs run deploy:prod`
3. 一键回滚  
   `pnpm --filter kra-ui-docs run rollback:prod`
4. 回滚后验证  
   `pnpm --filter kra-ui-docs run verify:prod`

## 10. 分阶段执行（全量迁移）

1. 搭建 Astro 基础工程与 Cloudflare 适配器  
   DoD：`pnpm dev:docs`、`pnpm build:docs` 基本可运行
2. 迁移全量文档为 MDX（先结构后细节）  
   DoD：迁移映射表覆盖 100%，页面可访问
3. 建立 `DemoBlock` + `DemoRenderer` + registry  
   DoD：至少 5 个组件 demo 可稳定渲染
4. 打通核心组件 demo 渲染链路  
   DoD：高风险组件清单完成兼容结论（可直渲染/降级/阻断）
5. 批量迁移其余组件文档示例  
   DoD：registry 引用完整率 100%
6. 切换构建/部署命令并完成回归验证  
   DoD：预发布 smoke test 全通过
7. 删除旧站遗留路由生成链路  
   DoD：仓库内无旧链路残留调用

## 11. 验收标准

- 路由覆盖率 100%（以迁移映射表对账）
- demo 注册完整率 100%（无悬空 `id`）
- 关键组件（`accordion/button/input/modal/tabs/toast`）页面均可看到“示例代码 + 实时预览”
- 预览使用真实 `kra-ui` 组件渲染
- 单 demo 异常不会导致整页崩溃
- `dev/build/typecheck` 在 CI 与本地均可执行
- 部署到 Cloudflare 后路由、静态资源与重定向规则正常
- 301 重定向命中率 >= 99%
- canonical 覆盖率 100%

建议验证命令（以最终脚本名为准）：

- `pnpm dev:docs`
- `pnpm build:docs`
- `pnpm --filter kra-ui-docs typecheck`
- `pnpm --filter kra-ui-docs run check:links`
- `pnpm --filter kra-ui-docs run check:demo-registry`
- `pnpm --filter kra-ui-docs run check:redirects`
- `pnpm --filter kra-ui-docs run check:seo`

## 14. 执行台账与防回退机制

- 迁移映射台账文件：`docs/superpowers/specs/2026-03-27-docs-migration-map.md`
- 兼容性台账建议文件：`docs/superpowers/specs/2026-03-27-demo-compat-matrix.md`
- smoke 清单建议文件：`docs/superpowers/specs/2026-03-27-docs-smoke-list.md`

防回退检查建议：

- 若检测到 `src/content.config.ts` 之外的第二导航源，则 CI 失败
- 若存在未映射旧路由，则 CI 失败
- 若 demo `id` 无对应 registry 条目，则 CI 失败

## 12. 风险与缓解

- **RN Web 兼容风险**：提前建立最小 demo 验证清单，先打通高频组件
- **批量迁移遗漏风险**：建立脚本检查“文档文件与导航一致性”
- **性能风险**：默认 `client:visible`，并监控页面首屏脚本体积
- **维护风险**：强制通过 registry 接入 demo，避免散落实现

## 13. 后续演进

- 在现有 registry 基础上扩展可编辑 Playground
- 增加 demo 自动截图或可视回归
- 增加 demo 元数据（难度、适用场景、最佳实践提示）
