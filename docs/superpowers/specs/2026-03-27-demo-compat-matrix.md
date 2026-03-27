# Demo 兼容性台账（高风险组件首版）

## 说明

- 本台账用于记录 Astro 文档 Demo 渲染链路在高风险组件上的最小兼容状态。
- 当前阶段仅覆盖 Task 3 的最小样例，不包含完整交互验收。

## 兼容矩阵

| 组件 | Demo ID | Demo 文件 | 注册表状态 | Smoke 结果 | 备注 |
| --- | --- | --- | --- | --- | --- |
| Modal | `modal-basic` | `packages/docs/src/demos/components/modal/basic.tsx` | 已注册 | 通过 | 最小开关逻辑 |
| Toast | `toast-basic` | `packages/docs/src/demos/components/toast/basic.tsx` | 已注册 | 通过 | 最小显示/关闭逻辑 |
| Tabs | `tabs-basic` | `packages/docs/src/demos/components/tabs/basic.tsx` | 已注册 | 通过 | 最小切换逻辑 |

## 本轮结论

- `risky-demos` scope 已建立并可用于 CI 兼容闸门。
- 闸门信号：
  - 缺失样例时输出 `E_SMOKE_RISKY_DEMOS_MISSING` 并失败。
  - 样例齐备时输出 `OK_SMOKE_RISKY_DEMOS` 并通过。
