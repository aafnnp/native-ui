/**
 * Card 组件基础用例
 * - 在 Provider 下可渲染并显示 children
 */
import { renderWithProvider } from '../../../test-utils/render';
import Card from '../index';
import Text from '../../Text';

test('渲染 children', () => {
  const { getByText } = renderWithProvider(
    <Card>
      <Text>内容</Text>
    </Card>,
  );
  expect(getByText('内容')).toBeTruthy();
});
