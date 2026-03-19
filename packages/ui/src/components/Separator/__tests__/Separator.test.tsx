/**
 * Separator 组件基础用例
 * - 无 label 可渲染
 * - 带 label 可渲染并显示文本
 * - 垂直方向可渲染
 */
import { renderWithProvider } from '../../../test-utils/render';
import Separator from '../index';

test('无 label 时可渲染', () => {
  expect(() => renderWithProvider(<Separator />)).not.toThrow();
});

test('带 label 时显示文本', () => {
  const { getByText } = renderWithProvider(<Separator label="分隔" />);
  expect(getByText('分隔')).toBeTruthy();
});

test('垂直 Separator 可渲染', () => {
  expect(() => renderWithProvider(<Separator orientation="vertical" />)).not.toThrow();
});
