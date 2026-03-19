/**
 * List 组件基础用例
 * - unordered 显示圆点
 * - ordered 显示序号
 */
import { renderWithProvider } from '../../../test-utils/render';
import List, { ListItem } from '../index';
import Text from '../../Text';

test('unordered 显示圆点与内容', () => {
  const { getAllByText, getByText } = renderWithProvider(
    <List type="unordered">
      <ListItem>
        <Text>第一项</Text>
      </ListItem>
      <ListItem>
        <Text>第二项</Text>
      </ListItem>
    </List>,
  );

  expect(getAllByText('•').length).toBe(2);
  expect(getByText('第一项')).toBeTruthy();
  expect(getByText('第二项')).toBeTruthy();
});

test('ordered 显示序号与内容', () => {
  const { getByText } = renderWithProvider(
    <List type="ordered">
      <ListItem>
        <Text>第一项</Text>
      </ListItem>
      <ListItem>
        <Text>第二项</Text>
      </ListItem>
    </List>,
  );

  expect(getByText('1.')).toBeTruthy();
  expect(getByText('2.')).toBeTruthy();
});
