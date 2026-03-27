# Task6.2 验证记录（收口修复）

## 1) links fail-first（文件级）

### 临时注入

在 `packages/docs/src/content/docs/guide/components/grid.mdx` 临时加入：

`[临时断链校验](/__b2-broken-link__)`

### 执行命令

`pnpm --filter kra-ui-docs run check:links -- --file src/content/docs/guide/components/grid.mdx`

### 失败输出（预期）

```text
E_LINKS_INVALID /__b2-broken-link__
Exit status 1
```

### 恢复后再次执行

移除临时断链后，执行相同命令。

### 成功输出

```text
OK_LINKS
```

## 2) demo-registry fail-first

### 临时注入

在 `packages/docs/src/content/docs/guide/components/grid.mdx` 临时加入：

`<DemoBlock id="grid-b2-temp" />`

### 执行命令

`pnpm --filter kra-ui-docs run check:demo-registry`

### 失败输出（预期）

```text
E_DEMO_ID_UNREGISTERED grid-b2-temp
Exit status 1
```

### 恢复后再次执行

移除临时 demo id 后，执行相同命令。

### 成功输出

```text
OK_DEMO_REGISTRY
```

## 3) 最终状态校验

执行：

- `pnpm --filter kra-ui-docs run check:links -- --file src/content/docs/guide/components/grid.mdx`
- `pnpm --filter kra-ui-docs run check:demo-registry`
- `pnpm --filter kra-ui-docs run typecheck`

结果：

- `OK_LINKS`
- `OK_DEMO_REGISTRY`
- `astro check` 结果为 `0 errors / 0 warnings / 0 hints`
