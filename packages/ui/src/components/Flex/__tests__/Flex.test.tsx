/**
 * Flex 组件基础用例
 * - 默认可渲染
 * - 支持渲染 children
 */
import { renderWithProvider } from '../../../test-utils/render';
import Flex from '../index';
import Text from '../../Text';

test('在 Provider 下可渲染并显示 children', () => {
  const { getByText } = renderWithProvider(
    <Flex>
      <Text>Flex内容</Text>
    </Flex>,
  );

  expect(getByText('Flex内容')).toBeTruthy();
});
