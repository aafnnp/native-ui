/**
 * Group 组件基础用例
 * - 在 Provider 下可渲染
 * - 支持渲染 children
 */
import { renderWithProvider } from '../../../test-utils/render';
import Group from '../index';
import Text from '../../Text';

test('在 Provider 下可渲染并显示 children', () => {
  const { getByText } = renderWithProvider(
    <Group>
      <Text>A</Text>
      <Text>B</Text>
    </Group>,
  );

  expect(getByText('A')).toBeTruthy();
  expect(getByText('B')).toBeTruthy();
});
