/**
 * Highlight 组件基础用例
 * - 在 Provider 下可渲染
 * - query 可高亮匹配的文本片段（以拆分后的文本存在为准）
 */
import { renderWithProvider } from '../../../test-utils/render';
import Highlight from '../index';

test('在 Provider 下可渲染并显示完整文本', () => {
  const { getByText } = renderWithProvider(<Highlight query="世界">你好世界</Highlight>);
  expect(getByText('你好')).toBeTruthy();
  expect(getByText('世界')).toBeTruthy();
});

test('query 支持数组', () => {
  const { getByText } = renderWithProvider(
    <Highlight query={['foo', 'bar']}>foo and bar</Highlight>,
  );
  expect(getByText('foo')).toBeTruthy();
  expect(getByText('bar')).toBeTruthy();
});
