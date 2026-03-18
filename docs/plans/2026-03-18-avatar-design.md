# Avatar Design

**Goal:** 完善 `Avatar` 组件能力边界：主题化尺寸与样式、稳健的 initials 规则、图片失败回退、自定义 fallback、可交互与无障碍、状态角标；并新增 `AvatarGroup`（叠放、+N）。

**Non-goals:**
- 不做复合组件形态（`Avatar.Root/Avatar.Image/...`），避免过度设计
- 不引入新的外部依赖
- 不强制破坏性变更（保持现有 API 默认行为）

---

## 1. 现状

当前 `Avatar` 位于 `packages/ui/src/components/Avatar/index.tsx`：

- 仅支持 `source/size/name`
- `sizeMap/fontSizeMap` 为硬编码
- 回退：无图时用 `name` 首字母（最多 2）或 `?`
- 背景色固定 `primaryLight`，文字色使用 `primary`
- 无图片失败回退处理、无状态角标、无 `AvatarGroup`、无交互与 a11y 约定

文档：`packages/docs/guide/components/avatar.md` 仅覆盖基础用法与 Props。

---

## 2. 总体方案（推荐：Avatar + AvatarGroup）

选择方案：**增强 `Avatar` + 新增 `AvatarGroup`**。

理由：
- 覆盖“全面版”诉求（fallback、失败回退、status、group）且保持 API 简洁
- 将尺寸/样式彻底主题化，后续扩展成本低
- 保持向后兼容：现有 `xs/sm/md/lg/xl` 继续可用，同时对外推荐 `sm/md/lg`

---

## 3. 主题设计（Tokens）

在 `packages/ui/src/theme/theme.ts` 与 `packages/ui/src/theme/darkTheme.ts` 同步新增（或补齐）：

### 3.1 `avatarSizes`

以 `sm/md/lg` 为推荐尺寸，并兼容 `xs/xl`。

每个 size 提供：
- `dimension`: number
- `fontSize`: number
- `gap`: number（`AvatarGroup` 用于叠放间距/重叠量的计算基础）
- `ringWidth`: number（叠放描边宽度）
- `statusSize`: number（右下角状态点直径）

> 约定：对外文档推荐 `sm/md/lg`；`xs/xl` 作为兼容项，在类型 JSDoc 标记 `@deprecated`。

### 3.2 `avatarVariants`（轻量）

建议至少提供：
- `solid`（默认）
- `subtle`

用于描述回退态的背景/文字色倾向（颜色仍引用现有语义色 token，如 `primaryLight/textPrimary/primary`）。

### 3.3 `avatarStatusColors`

映射：
- `online` -> `success`
- `offline` -> `border` 或 `textMuted`
- `busy` -> `error`
- `away` -> `warning`

同时允许在组件 props 级别通过 `statusColor` 覆盖（使用主题 `colors` key）。

---

## 4. 组件设计

### 4.1 `Avatar` API

在保持现有 `AvatarProps extends BoxProps` 结构基础上扩展。

#### 基础
- `source?: ImageSourcePropType`
- `name?: string`
- `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'`（默认 `md`）
- `shape?: 'circle' | 'square'`（默认 `circle`）
- `variant?: 'solid' | 'subtle'`（默认 `solid`）

#### 回退与失败处理
- `fallback?: React.ReactNode | ((ctx) => React.ReactNode)`
  - `ctx` 提供：`initials`、`size`（解析后）、`shape`、`colors`（建议至少包含 `backgroundColor/textColor`）
- `onImageError?: (e: unknown) => void`

默认策略：
- 有 `source` 时优先渲染图片
- 图片加载失败时自动切换至 fallback（并触发 `onImageError`）

回退渲染优先级：
1) `fallback`（若传）
2) `initials`（若 `name` 可用）
3) `?`

#### 状态角标（右下）
- `status?: 'online' | 'offline' | 'busy' | 'away'`
- `statusColor?: keyof Theme['colors']`（可选覆盖默认映射）

角标尺寸来自 `avatarSizes[size].statusSize`，默认带轻微描边以避免贴边糊。

#### 可交互性与无障碍
- `onPress?: () => void`
- `isDisabled?: boolean`
- `accessibilityLabel?: string`

行为：
- 当存在 `onPress` 且非 `isDisabled`：使用 `Pressable` 包裹
- a11y：
  - 无 `onPress`：`accessibilityRole="image"`
  - 有 `onPress`：`accessibilityRole="imagebutton"`
  - `accessibilityLabel` 默认：优先 `name`，否则 `"头像"`

---

### 4.2 initials 规则

目标：对中英文名称都稳定、可测试。

规则：
- `name` 为空：`'?'`
- `name` 非空：
  - 去掉首尾空白
  - 若包含空格：按空格拆分取前 2 个词首字符拼接
  - 若不包含空格：取前 2 个可见字符
  - 英文字母转大写
  - 最终截断到最多 2 个字符

实现要求：
- 封装成纯函数，便于单测覆盖

---

### 4.3 `AvatarGroup`（新增）

文件：`packages/ui/src/components/AvatarGroup/index.tsx`。

#### API
- `size?: AvatarSize`（默认 `md`，统一控制子头像尺寸）
- `max?: number`（最多显示数量，超出显示 `+N`）
- `spacing?: 'tight' | 'normal'`（叠放重叠量，默认 `normal`，由 token 决定具体偏移）
- `ringColor?: keyof Theme['colors']`（叠放描边色，默认与背景一致以形成分隔）
- `children: React.ReactElement<typeof Avatar>[]`

#### 展示规则
- 横向叠放，后面的头像覆盖在前面
- 超出 `max` 的数量以一个 “+N” 头像块表示
- `+N` a11y：`"还有 {extra} 个头像"`

---

## 5. 兼容性策略

- 保持现有用法与默认值：`<Avatar size="md" />`、`name` 回退、无图显示 `?`
- `xs/xl`：
  - 继续支持，避免破坏性变更
  - 文档与类型 JSDoc 标记 `@deprecated`，对外推荐 `sm/md/lg`

---

## 6. 测试策略（建议）

使用 `@testing-library/react-native` 覆盖关键行为：

### 6.1 `Avatar`
- 默认：无图渲染 `?`；有 `name` 渲染 initials
- size 兼容：`xs/xl` 与 `sm/md/lg` 都能正确渲染尺寸/字体（至少渲染路径不崩）
- 图片失败回退：触发 `onImageError` 后回退到 initials 或自定义 `fallback`
- `status`：渲染角标并具备可读的 a11y label（若实现）
- 交互：有 `onPress` 时触发；`isDisabled` 时不触发

### 6.2 `AvatarGroup`
- `max` 截断与 `+N` 显示正确
- group size 能统一控制子头像（或至少 group 逻辑不破坏子头像）

---

## 7. 文档与示例更新

- 更新 `packages/docs/guide/components/avatar.md`：
  - 增加 `shape/status/fallback/onPress` 示例
  - 新增 `AvatarGroup` 章节（叠放、+N、`max`）
  - `size`：文档推荐 `sm/md/lg`，`xs/xl` 标记兼容但 deprecated
- 示例应用：新增/补齐 Avatar Demo（状态角标、失败回退、AvatarGroup）

---

## 8. 成功标准

- `Avatar` 与 `AvatarGroup` API 清晰、默认行为向后兼容
- 视觉与主题系统对齐：不再依赖硬编码尺寸映射
- 图片失败能够稳定回退（不出现空白/崩溃）
- 基本 a11y 完整（role/label/disabled）
- 文档与示例覆盖新增能力，能作为使用指南

