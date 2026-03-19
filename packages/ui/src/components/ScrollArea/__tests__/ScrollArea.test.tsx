/**
 * ScrollArea 组件基础用例
 * - 在 Provider 下可渲染（vertical/horizontal）
 * - 支持渲染 children
 */
import { renderWithProvider } from '../../../test-utils/render';
import ScrollArea from '../index';
import Text from '../../Text';

test('vertical ScrollArea 可渲染并显示 children', () => {
  const { getByText } = renderWithProvider(
    <ScrollArea direction="vertical">
      <Text>内容</Text>
    </ScrollArea>,
  );
  expect(getByText('内容')).toBeTruthy();
});

test('horizontal ScrollArea 可渲染', () => {
  expect(() =>
    renderWithProvider(
      <ScrollArea direction="horizontal">
        <Text>内容</Text>
      </ScrollArea>,
    ),
  ).not.toThrow();
});
