/**
 * Text 组件基础用例
 * - 在 Provider 下可渲染
 * - 支持渲染文本内容
 */
import { renderWithProvider } from '../../../test-utils/render';
import Text from '../index';

test('在 Provider 下可渲染并显示文本', () => {
  const { getByText } = renderWithProvider(<Text>你好</Text>);
  expect(getByText('你好')).toBeTruthy();
});
