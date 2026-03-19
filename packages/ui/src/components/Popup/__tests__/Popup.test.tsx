/**
 * Popup 组件基础用例
 * - visible 时渲染标题
 * - 点击关闭按钮触发 onClose
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import Popup from '../index';
import Text from '../../Text';

test('visible 时渲染标题', () => {
  const { getByText } = renderWithProvider(
    <Popup visible onClose={() => {}} title="标题">
      <Text>内容</Text>
    </Popup>,
  );

  expect(getByText('标题')).toBeTruthy();
  expect(getByText('内容')).toBeTruthy();
});

test('点击关闭按钮触发 onClose', () => {
  const onClose = jest.fn();
  const { getByLabelText } = renderWithProvider(<Popup visible onClose={onClose} title="标题" />);

  fireEvent.press(getByLabelText('关闭'));
  expect(onClose).toHaveBeenCalledTimes(1);
});
