# Avatar Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在保持 `Avatar` 向后兼容的前提下，补齐主题化尺寸、图片失败回退、自定义 fallback、交互与 a11y、状态角标，并新增 `AvatarGroup`（叠放、+N），同步更新文档与示例。

**Architecture:** 通过主题新增 `avatarSizes/avatarVariants/avatarStatusColors` 令牌，`Avatar` 读取 token 渲染（不再硬编码 map），内部维护图片失败状态并按优先级回退；`AvatarGroup` 作为独立组件组合 `Avatar` 并实现叠放与 `+N`。对外继续支持 `xs/sm/md/lg/xl`，文档推荐 `sm/md/lg`，`xs/xl` 标记 deprecated。

**Tech Stack:** React Native + TypeScript、@shopify/restyle（Theme tokens）、@testing-library/react-native + Jest、pnpm monorepo

---

## 执行前注意

- 建议在独立 worktree 中执行以隔离风险（本计划不强制，但推荐）。
- 本计划按 TDD 拆分为 2-5 分钟的“小步”，每个 Task 结束都要提交一次。
- 现有测试封装风格参考 `packages/ui/src/components/Alert/__tests__/Alert.test.tsx`（用 `NativeUIProvider` 包裹）。

---

### Task 1: 为 Avatar 新行为补齐单元测试（先写失败）

**Files:**

- Create: `packages/ui/src/components/Avatar/__tests__/Avatar.test.tsx`

**Step 1: 写失败的测试（默认回退与 initials）**

```tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Avatar from '../index';
import { NativeUIProvider } from '../../../provider/NativeUIProvider';

const renderWithProvider = (ui: React.ReactElement) =>
  render(<NativeUIProvider>{ui}</NativeUIProvider>);

test('无 source 且无 name 时显示 ?', () => {
  const { getByText } = renderWithProvider(<Avatar />);
  expect(getByText('?')).toBeTruthy();
});

test('无 source 且有 name 时显示最多 2 个 initials', () => {
  const { getByText, rerender } = renderWithProvider(<Avatar name="张三" />);
  expect(getByText('张三')).toBeTruthy();

  rerender(
    <NativeUIProvider>
      <Avatar name="john smith" />
    </NativeUIProvider>,
  );
  expect(getByText('JS')).toBeTruthy();
});
```

**Step 2: 运行测试确认失败**

Run: `pnpm --filter kra-ui test -- Avatar.test.tsx`
Expected: FAIL（暂未创建测试文件或行为未覆盖）

**Step 3: 写失败的测试（可交互 onPress 与 isDisabled）**

```tsx
test('有 onPress 时点击触发回调', () => {
  const onPress = jest.fn();
  const { getByLabelText } = renderWithProvider(
    <Avatar name="A" onPress={onPress} accessibilityLabel="用户头像" />,
  );
  fireEvent.press(getByLabelText('用户头像'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('isDisabled 时不触发 onPress', () => {
  const onPress = jest.fn();
  const { getByLabelText } = renderWithProvider(
    <Avatar name="A" onPress={onPress} isDisabled accessibilityLabel="用户头像" />,
  );
  fireEvent.press(getByLabelText('用户头像'));
  expect(onPress).not.toHaveBeenCalled();
});
```

**Step 4: 运行测试确认失败**

Run: `pnpm --filter kra-ui test -- Avatar.test.tsx`
Expected: FAIL（当前 Avatar 不支持 onPress/isDisabled/accessibilityLabel）

**Step 5: 写失败的测试（图片失败回退调用 onImageError）**

```tsx
import { Image } from 'react-native';

test('图片加载失败后回退到 initials，并触发 onImageError', () => {
  const onImageError = jest.fn();
  const { getByText, UNSAFE_getByType } = renderWithProvider(
    <Avatar
      name="张三"
      source={{ uri: 'https://example.com/avatar.jpg' }}
      onImageError={onImageError}
    />,
  );

  fireEvent(UNSAFE_getByType(Image), 'error', { nativeEvent: {} });

  expect(onImageError).toHaveBeenCalled();
  expect(getByText('张三')).toBeTruthy();
});
```

**Step 6: 运行测试确认失败**

Run: `pnpm --filter kra-ui test -- Avatar.test.tsx`
Expected: FAIL（当前 Avatar 没有 error 处理与失败回退状态）

**Step 7: 写失败的测试（status 角标渲染）**

```tsx
test('传入 status 时渲染状态角标', () => {
  const { getByLabelText } = renderWithProvider(<Avatar name="A" status="online" />);
  expect(getByLabelText('在线')).toBeTruthy();
});
```

**Step 8: 运行测试确认失败**

Run: `pnpm --filter kra-ui test -- Avatar.test.tsx`
Expected: FAIL（当前未渲染 status 角标 / 无 label）

**Step 9: 提交（仅测试）**

```bash
git add packages/ui/src/components/Avatar/__tests__/Avatar.test.tsx
git commit -m "$(cat <<'EOF'
test(avatar): add coverage for fallback and interactions

EOF
)"
```

---

### Task 2: 新增主题 tokens（avatarSizes/avatarVariants/avatarStatusColors）

**Files:**

- Modify: `packages/ui/src/theme/theme.ts`
- Modify: `packages/ui/src/theme/darkTheme.ts`

**Step 1: 在浅色主题新增 avatar tokens（先按最小可用）**

在 `createTheme({ ... })` 中新增：

- `avatarSizes`（至少含 `xs/sm/md/lg/xl`，推荐 `sm/md/lg` 为主）
- `avatarVariants`（至少 `solid/subtle`）
- `avatarStatusColors`（online/offline/busy/away -> 语义色）

**Step 2: 在暗色主题同步结构**

保持 keys 与结构一致，色值引用暗色主题的语义色 token。

**Step 3: 类型检查**

Run: `pnpm --filter kra-ui lint`
Expected: PASS

**Step 4: 提交（仅主题）**

```bash
git add packages/ui/src/theme/theme.ts packages/ui/src/theme/darkTheme.ts
git commit -m "$(cat <<'EOF'
feat(theme): add avatar size and status tokens

EOF
)"
```

---

### Task 3: 实现 Avatar（让 Task 1 测试通过）

**Files:**

- Modify: `packages/ui/src/components/Avatar/index.tsx`

**Step 1: 提取 initials 计算为纯函数（可测试/低圈复杂度）**

在 `Avatar/index.tsx` 内新增一个小函数（或放在同文件底部）：

- 输入 `name?: string`
- 输出 `string`（`'?'` 或最多 2 字符）

**Step 2: 用主题 token 替代硬编码 sizeMap/fontSizeMap**

- `size` 仍接受 `xs/sm/md/lg/xl`
- 从 `theme.avatarSizes[size]` 取 `dimension/fontSize/statusSize/ringWidth/...`

**Step 3: 支持 onPress/isDisabled/accessibilityLabel**

- 当传 `onPress`：使用 `Pressable` 包裹
- `isDisabled` 时阻止触发（与 Button 的策略一致）
- a11y：
  - `accessibilityRole="image"` 或 `"imagebutton"`
  - `accessibilityLabel` 默认：`name ?? '头像'`

**Step 4: 支持图片失败回退**

- 内部 state：`hasImageError`
- `Image` 的 `onError`：
  - set `hasImageError` 为 true
  - 调用 `onImageError`
- 渲染条件：`source && !hasImageError` 才渲染图片，否则渲染 fallback

**Step 5: 支持 fallback / shape / variant / status**

最小实现目标：

- `fallback`：支持 ReactNode 或函数
- `shape`：circle（默认）/ square（使用主题圆角，如 `m`，或为 square 提供 `borderRadius="m"`）
- `variant`：从 `theme.avatarVariants` 读取回退态背景/文字色（保持默认视觉接近旧实现）
- `status`：渲染一个右下角点，并提供 `accessibilityLabel`：
  - online -> `在线`
  - offline -> `离线`
  - busy -> `忙碌`
  - away -> `离开`

**Step 6: 运行 Task 1 测试并修到通过**

Run: `pnpm --filter kra-ui test -- Avatar.test.tsx`
Expected: PASS

**Step 7: 提交（Avatar 实现）**

```bash
git add packages/ui/src/components/Avatar/index.tsx
git commit -m "$(cat <<'EOF'
feat(ui): enhance Avatar with fallback, status and a11y

EOF
)"
```

---

### Task 4: 新增 AvatarGroup + 单元测试

**Files:**

- Create: `packages/ui/src/components/AvatarGroup/index.tsx`
- Create: `packages/ui/src/components/AvatarGroup/__tests__/AvatarGroup.test.tsx`
- Modify: `packages/ui/src/index.ts`

**Step 1: 写失败的测试（max 与 +N）**

```tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import Avatar from '../../Avatar';
import AvatarGroup from '../index';
import { NativeUIProvider } from '../../../provider/NativeUIProvider';

const renderWithProvider = (ui: React.ReactElement) =>
  render(<NativeUIProvider>{ui}</NativeUIProvider>);

test('超出 max 时显示 +N', () => {
  const { getByText } = renderWithProvider(
    <AvatarGroup max={2}>
      <Avatar name="A" />
      <Avatar name="B" />
      <Avatar name="C" />
    </AvatarGroup>,
  );
  expect(getByText('+1')).toBeTruthy();
});
```

**Step 2: 运行测试确认失败**

Run: `pnpm --filter kra-ui test -- AvatarGroup.test.tsx`
Expected: FAIL（组件不存在）

**Step 3: 实现最小 AvatarGroup**

要求：

- 叠放布局（例如 `flexDirection="row"` + 负 margin/translate）
- ring（描边）宽度取 `theme.avatarSizes[size].ringWidth`
- `+N` 作为一个 “Avatar 风格块” 渲染（可以复用 `Avatar` 的 `fallback` 形式）
- 提供 `accessibilityLabel="还有 {extra} 个头像"`

**Step 4: 在 `packages/ui/src/index.ts` 导出**

- `export {default as AvatarGroup} from './components/AvatarGroup';`
- `export type {AvatarGroupProps} ...`

**Step 5: 跑测试与类型检查**

Run: `pnpm --filter kra-ui test -- AvatarGroup.test.tsx`
Expected: PASS

Run: `pnpm --filter kra-ui lint`
Expected: PASS

**Step 6: 提交（AvatarGroup）**

```bash
git add packages/ui/src/components/AvatarGroup packages/ui/src/index.ts
git commit -m "$(cat <<'EOF'
feat(ui): add AvatarGroup with overflow indicator

EOF
)"
```

---

### Task 5: 更新 Avatar 文档（含 AvatarGroup）

**Files:**

- Modify: `packages/docs/guide/components/avatar.md`

**Step 1: 更新并扩展示例**

新增示例：

- `shape="square"`
- `status="online"`
- `fallback`（传入 `<Icon />` 或自定义节点）
- `onPress` + `isDisabled`
- `AvatarGroup`（含 `max` 与 `+N`）

**Step 2: 更新 Props 表**

- 标注推荐 size：`sm/md/lg`
- `xs/xl` 标注 deprecated（仍兼容）
- 补齐新增 props 的说明与类型

**Step 3: 提交（docs）**

```bash
git add packages/docs/guide/components/avatar.md
git commit -m "$(cat <<'EOF'
docs: expand Avatar docs and add AvatarGroup

EOF
)"
```

---

### Task 6: 示例应用补齐 AvatarDemo（如仓库 demo 入口存在）

**Files:**

- Modify: `packages/example/app/demo/[name].tsx`（在现有 demo 列表中增加 AvatarDemo 段落，或更新已有 AvatarDemo）

**Step 1: 增加展示点**

- 基础：图片/initials/`?`
- status：online/busy
- failure fallback：使用一个明显的 `fallback`（便于肉眼验证）
- AvatarGroup：`max=3` + `+N`

**Step 2: 类型检查**

Run: `pnpm --filter kra-ui-example exec tsc --noEmit`
Expected: PASS

**Step 3: 提交（example）**

```bash
git add packages/example/app/demo/[name].tsx
git commit -m "$(cat <<'EOF'
docs(example): add Avatar demo for new features

EOF
)"
```

---

### Task 7: 全量校验（与 CI 对齐）

**Files:**

- None

**Step 1: UI 包 lint**

Run: `pnpm --filter kra-ui lint`
Expected: PASS

**Step 2: UI 包 test**

Run: `pnpm --filter kra-ui test`
Expected: PASS

**Step 3: 根目录 lint + build**

Run: `pnpm lint && pnpm build`
Expected: PASS

**Step 4: 如有修复，补一个小 commit**

```bash
git status
# 若有改动：
git add -A
git commit -m "$(cat <<'EOF'
fix(ui): stabilize Avatar release checks

EOF
)"
```

---

## Plan complete

Plan complete and saved to `docs/plans/2026-03-18-avatar-implementation-plan.md`. Two execution options:

1. Subagent-Driven (this session) - I dispatch fresh subagent per task, review between tasks, fast iteration
2. Parallel Session (separate) - Open new session with executing-plans, batch execution with checkpoints

Which approach?
