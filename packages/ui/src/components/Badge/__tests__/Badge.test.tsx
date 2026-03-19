/**
 * Badge 组件基础用例
 * - 渲染 label
 * - 不同 variant 可渲染
 */
import { renderWithProvider } from '../../../test-utils/render';
import Badge from '../index';

test('渲染 label', () => {
  const { getByText } = renderWithProvider(<Badge label="新" />);
  expect(getByText('新')).toBeTruthy();
});

test('不同 variant 可渲染', () => {
  expect(() => renderWithProvider(<Badge label="A" variant="solid" />)).not.toThrow();
  expect(() => renderWithProvider(<Badge label="B" variant="subtle" />)).not.toThrow();
  expect(() => renderWithProvider(<Badge label="C" variant="outline" />)).not.toThrow();
});
