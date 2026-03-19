/**
 * Center 组件基础用例
 * - 在 Provider 下可渲染
 * - 支持渲染 children
 */
import { renderWithProvider } from '../../../test-utils/render';
import Center from '../index';
import Text from '../../Text';

test('在 Provider 下可渲染并显示 children', () => {
  const { getByText } = renderWithProvider(
    <Center>
      <Text>Center内容</Text>
    </Center>,
  );

  expect(getByText('Center内容')).toBeTruthy();
});
