import React from 'react';
import type { RenderOptions } from '@testing-library/react-native';
import { render } from '@testing-library/react-native';
import { NativeUIProvider } from '../provider/NativeUIProvider';

/**
 * 测试渲染工具
 *
 * 说明：
 * - 统一在测试中注入 NativeUIProvider，避免各组件测试重复样板代码
 * - 放在 src 下，避免被 packages/ui 的 tsconfig rootDir 限制
 */
export function renderWithProvider(ui: React.ReactElement, options?: RenderOptions) {
  return render(<NativeUIProvider>{ui}</NativeUIProvider>, options);
}
