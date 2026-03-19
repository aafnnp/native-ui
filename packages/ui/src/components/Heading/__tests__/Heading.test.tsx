/**
 * Heading 组件基础用例
 * - 在 Provider 下可渲染并显示文本
 * - 默认提供 header 的 accessibilityRole
 */
import { renderWithProvider } from '../../../test-utils/render';
import Heading from '../index';

test('在 Provider 下可渲染并显示文本', () => {
  const { getByText } = renderWithProvider(<Heading>标题</Heading>);
  expect(getByText('标题')).toBeTruthy();
});

test('默认 accessibilityRole 为 header', () => {
  const { getByRole } = renderWithProvider(<Heading>标题</Heading>);
  expect(getByRole('header')).toBeTruthy();
});
