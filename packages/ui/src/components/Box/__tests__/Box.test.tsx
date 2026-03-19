/**
 * Box 组件基础用例
 * - 在 Provider 下可渲染
 * - 支持渲染 children
 */
import { renderWithProvider } from '../../../test-utils/render';
import Box from '../index';
import Text from '../../Text';

test('在 Provider 下可渲染并显示 children', () => {
  const { getByText } = renderWithProvider(
    <Box padding="m">
      <Text>内容</Text>
    </Box>,
  );

  expect(getByText('内容')).toBeTruthy();
});
