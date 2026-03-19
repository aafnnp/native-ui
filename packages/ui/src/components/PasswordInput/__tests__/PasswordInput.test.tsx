/**
 * PasswordInput 组件基础用例
 * - 默认显示可见性切换按钮
 * - 点击后按钮文案/无障碍标签切换
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import PasswordInput from '../index';

test('点击切换可见性按钮文案', () => {
  const { getByText, getByLabelText } = renderWithProvider(<PasswordInput placeholder="密码" />);

  expect(getByText('显示')).toBeTruthy();
  expect(getByLabelText('显示密码')).toBeTruthy();

  fireEvent.press(getByLabelText('显示密码'));

  expect(getByText('隐藏')).toBeTruthy();
  expect(getByLabelText('隐藏密码')).toBeTruthy();
});
