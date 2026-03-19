/**
 * Code 组件基础用例
 * - 在 Provider 下可渲染
 * - 支持渲染代码文本
 */
import { renderWithProvider } from '../../../test-utils/render';
import Code from '../index';

test('在 Provider 下可渲染并显示文本', () => {
  const { getByText } = renderWithProvider(<Code>const a = 1;</Code>);
  expect(getByText('const a = 1;')).toBeTruthy();
});
