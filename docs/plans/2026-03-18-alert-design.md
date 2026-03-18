---
title: Alert 组件设计
date: 2026-03-18
scope: packages/ui
status: approved
---

## 背景与目标

在 `kra-ui` 中新增 **内联提示条（Inline Alert）** 组件，用于在页面/表单内展示提示信息。它应当：

- 支持 4 种语义类型：`info` / `success` / `warning` / `error`
- 默认即可用，外观与主题一致
- 同时支持“简洁 props 用法”和“插槽（compound）用法”，满足从简单到高度自定义的不同需求
- 不内置自动消失（与 Toast 职责区分）

## 范围（In Scope）

- `packages/ui`：新增 `Alert` 组件（含插槽子组件）
- `packages/ui`：新增与 Alert 相关的主题 token（variants、sizes）
- `packages/example`：新增 Alert demo 页面/入口
- `packages/docs`：新增 Alert 文档页（API + 示例）
- 单元测试覆盖基础渲染与交互（Close）

## 不在范围（Out of Scope）

- 浮层提示（Toast-like）/ 模态弹窗（Modal）
- 自动消失、队列管理（由 Toast 负责）
- 复杂富文本解析（由调用方传入 `ReactNode` 自行控制）

## 方案选择

采用 **基于 Restyle 的复合组件（Compound Components）+ 插槽**方案：

- **默认模式（Props）**：一行代码即可渲染常见 Alert
- **插槽模式（Compound）**：通过 `Alert.Icon/Title/Description/Action/Close` 等子组件进行灵活组合
- 两种模式共享同一套主题 token，保证一致性

## API 设计

### 核心 Props（默认模式）

- `variant: 'info' | 'success' | 'warning' | 'error'`
- `size?: 'sm' | 'md'`（默认 `md`）
- `title?: React.ReactNode`
- `message?: React.ReactNode`
- `icon?: boolean | React.ReactNode`
  - `true`：使用内置图标
  - `ReactNode`：使用自定义图标
  - `false`：隐藏图标
- `action?: React.ReactNode`（右侧操作区，如按钮/链接）
- `closable?: boolean`
- `onClose?: () => void`
- RN 常用透传：`testID`、`style` 等（按项目现有组件约定）

### 插槽（Compound Components）

- `Alert.Root`：容器
- `Alert.Icon`
- `Alert.Title`
- `Alert.Description`：等价 message
- `Alert.Action`
- `Alert.Close`

### 用法示例（概念）

- 简洁用法：`<Alert variant="warning" title="..." message="..." />`
- 插槽用法：
  - `<Alert variant="warning">`
  - `  <Alert.Icon />`
  - `  <Alert.Title />`
  - `  <Alert.Description />`
  - `  <Alert.Action />`
  - `  <Alert.Close />`
  - `</Alert>`

## 视觉与布局

### 默认布局

- 左侧：Icon（可选）
- 中间：Title（可选）+ Description（可选，可多行）
- 右侧：Action（可选）与 Close（可选）

### 样式原则

- 默认即可用：统一的间距、圆角、边框/底色
- 最小可扩展：插槽模式下仍沿用 token，保持一致性
- 避免引入过多外观 props：如需特殊圆角/宽度等，优先通过 `style` 或插槽自定义实现

## 主题与 Token 设计（Restyle）

### Variants

在主题中新增 `alertVariants`，为每个 `variant` 提供：

- `backgroundColor`
- `borderColor`
- `iconColor`
- `titleColor`
- `messageColor`

### Sizes

在主题中新增 `alertSizes`，为 `sm/md` 提供：

- `paddingX` / `paddingY`
- `gap`
- `iconSize`
- `radius`
- `titleTextVariant`
- `messageTextVariant`

## 交互与无障碍（RN）

- **关闭**
  - 当 `closable` 为 `true` 时渲染 Close 按钮
  - 点击 Close 触发 `onClose`
  - 不提供“自动消失”
- **可点击区域**
  - `Action` / `Close` 使用 `Pressable` 并提供合理的 `hitSlop`
- **无障碍**
  - 容器使用合适的 `accessibilityRole`（优先考虑 `alert`）
  - Close 按钮提供 `accessibilityLabel="关闭提示"`
  - `testID` 透传便于测试

## 测试策略

- 渲染测试
  - 四种 `variant`
  - 组合：`title/message/icon/action/closable` 的存在与缺失
- 交互测试
  - `closable` 时点击 Close 触发 `onClose`

## 文档与示例

- `packages/example`：新增 Alert demo（基础/带标题/带操作/插槽自定义）
- `packages/docs`：新增 Alert 文档页
  - API 表
  - 示例：基础、带标题、带 action、插槽自定义

## 验收标准

- 在 Example 中可看到 4 种类型与多种组合示例
- 主题切换（含暗色主题）下颜色对比合理、样式一致
- 单测覆盖核心渲染与 `onClose` 交互
- 文档页包含清晰 API 与示例

