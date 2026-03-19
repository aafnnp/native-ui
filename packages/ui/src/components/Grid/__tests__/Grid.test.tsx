/**
 * Grid 组件基础用例
 * - 在 Provider 下可渲染
 * - 支持渲染 children
 */
import { renderWithProvider } from '../../../test-utils/render';
import Grid from '../index';
import Text from '../../Text';

test('在 Provider 下可渲染并显示 children', () => {
  const { getByText } = renderWithProvider(
    <Grid columns={2} spacing="s">
      <Text>Item1</Text>
      <Text>Item2</Text>
    </Grid>,
  );

  expect(getByText('Item1')).toBeTruthy();
  expect(getByText('Item2')).toBeTruthy();
});
