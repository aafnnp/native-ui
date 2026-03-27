# Docs 迁移映射台账（React Router -> Astro）

## 说明

- 本文件用于证明“全量迁移”覆盖率
- 状态：`未迁移` / `已迁移` / `已废弃`
- 验收：`通过` / `失败`

## 路由映射

| 旧路径 | 新路径 | 页面类型 | 状态 | 验收 |
| --- | --- | --- | --- | --- |
| `/` | `/` | 首页 | 已迁移 | 通过（Task2：content collections + smoke + links） |
| `/guide/getting-started` | `/guide/getting-started` | 指南 | 已迁移 | 通过（Task2：content collections + smoke + links） |
| `/guide/theme` | `/guide/theme` | 指南 | 已迁移 | 通过（Task2：content collections + smoke + links） |
| `/guide/migration` | `/guide/migration` | 指南 | 已迁移 | 通过（Task2：content collections + smoke + links） |
| `/guide/components/accordion` | `/guide/components/accordion` | 组件 | 已迁移 | 通过（Task5：MDX + demo registry + check/build/typecheck） |
| `/guide/components/alert` | `/guide/components/alert` | 组件 | 已迁移 | 通过（Task5：MDX + demo registry + check/build/typecheck） |
| `/guide/components/aspect-ratio` | `/guide/components/aspect-ratio` | 组件 | 未迁移 | 失败 |
| `/guide/components/avatar` | `/guide/components/avatar` | 组件 | 已迁移 | 通过（Task5：MDX + demo registry + check/build/typecheck） |
| `/guide/components/badge` | `/guide/components/badge` | 组件 | 已迁移 | 通过（Task5：MDX + demo registry + check/build/typecheck） |
| `/guide/components/box` | `/guide/components/box` | 组件 | 未迁移 | 失败 |
| `/guide/components/button` | `/guide/components/button` | 组件 | 已迁移 | 通过（Task5：MDX + demo registry + check/build/typecheck） |
| `/guide/components/card` | `/guide/components/card` | 组件 | 未迁移 | 失败 |
| `/guide/components/center` | `/guide/components/center` | 组件 | 未迁移 | 失败 |
| `/guide/components/checkbox` | `/guide/components/checkbox` | 组件 | 已迁移 | 通过（Task6.1：MDX + demo registry + check/build/typecheck） |
| `/guide/components/code` | `/guide/components/code` | 组件 | 未迁移 | 失败 |
| `/guide/components/divider` | `/guide/components/divider` | 组件 | 未迁移 | 失败 |
| `/guide/components/dropdown` | `/guide/components/dropdown` | 组件 | 未迁移 | 失败 |
| `/guide/components/flex` | `/guide/components/flex` | 组件 | 未迁移 | 失败 |
| `/guide/components/grid` | `/guide/components/grid` | 组件 | 已迁移 | 通过（Task6.2：MDX + demo registry + check/build/typecheck） |
| `/guide/components/group` | `/guide/components/group` | 组件 | 未迁移 | 失败 |
| `/guide/components/heading` | `/guide/components/heading` | 组件 | 未迁移 | 失败 |
| `/guide/components/highlight` | `/guide/components/highlight` | 组件 | 未迁移 | 失败 |
| `/guide/components/icon` | `/guide/components/icon` | 组件 | 未迁移 | 失败 |
| `/guide/components/input` | `/guide/components/input` | 组件 | 已迁移 | 通过（Task6.1：MDX + demo registry + check/build/typecheck） |
| `/guide/components/link` | `/guide/components/link` | 组件 | 未迁移 | 失败 |
| `/guide/components/list` | `/guide/components/list` | 组件 | 未迁移 | 失败 |
| `/guide/components/modal` | `/guide/components/modal` | 组件 | 未迁移 | 失败 |
| `/guide/components/number-input` | `/guide/components/number-input` | 组件 | 未迁移 | 失败 |
| `/guide/components/page-container` | `/guide/components/page-container` | 组件 | 未迁移 | 失败 |
| `/guide/components/password-input` | `/guide/components/password-input` | 组件 | 未迁移 | 失败 |
| `/guide/components/pin-input` | `/guide/components/pin-input` | 组件 | 未迁移 | 失败 |
| `/guide/components/popup` | `/guide/components/popup` | 组件 | 未迁移 | 失败 |
| `/guide/components/radio` | `/guide/components/radio` | 组件 | 已迁移 | 通过（Task6.1：MDX + demo registry + check/build/typecheck） |
| `/guide/components/rating` | `/guide/components/rating` | 组件 | 未迁移 | 失败 |
| `/guide/components/scroll-area` | `/guide/components/scroll-area` | 组件 | 未迁移 | 失败 |
| `/guide/components/segmented-control` | `/guide/components/segmented-control` | 组件 | 未迁移 | 失败 |
| `/guide/components/separator` | `/guide/components/separator` | 组件 | 未迁移 | 失败 |
| `/guide/components/spinner` | `/guide/components/spinner` | 组件 | 未迁移 | 失败 |
| `/guide/components/stack` | `/guide/components/stack` | 组件 | 已迁移 | 通过（Task6.2：MDX + demo registry + check/build/typecheck） |
| `/guide/components/steps` | `/guide/components/steps` | 组件 | 未迁移 | 失败 |
| `/guide/components/switch` | `/guide/components/switch` | 组件 | 未迁移 | 失败 |
| `/guide/components/tabs` | `/guide/components/tabs` | 组件 | 未迁移 | 失败 |
| `/guide/components/text` | `/guide/components/text` | 组件 | 未迁移 | 失败 |
| `/guide/components/textarea` | `/guide/components/textarea` | 组件 | 已迁移 | 通过（Task6.1：MDX + demo registry + check/build/typecheck） |
| `/guide/components/toast` | `/guide/components/toast` | 组件 | 未迁移 | 失败 |

## 统计（Task8 最终验收）

- 总条目：47
- 已迁移：15
- 未迁移：32
- 覆盖率：31.9%

> 说明：进入实施后，每完成一条迁移即更新状态与验收结果，并同步覆盖率。
