/**
 * Divider 组件基础用例
 * - 在 Provider 下可渲染（水平/垂直）
 */
import { renderWithProvider } from '../../../test-utils/render';
import Divider from '../index';

test('水平 Divider 可渲染', () => {
  expect(() => renderWithProvider(<Divider orientation="horizontal" />)).not.toThrow();
});

test('垂直 Divider 可渲染', () => {
  expect(() => renderWithProvider(<Divider orientation="vertical" />)).not.toThrow();
});
