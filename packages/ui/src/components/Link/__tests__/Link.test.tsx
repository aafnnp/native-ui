/**
 * Link 组件基础用例
 * - 有 onPress 时触发回调
 * - 无 onPress 且 href + isExternal 时调用 Linking.openURL
 */
import { Linking } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import Link from '../index';

test('点击时触发 onPress', () => {
  const onPress = jest.fn();
  const { getByRole, getByText } = renderWithProvider(<Link onPress={onPress}>链接</Link>);

  expect(getByText('链接')).toBeTruthy();
  fireEvent.press(getByRole('link'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('无 onPress 时使用 Linking.openURL 打开外链', () => {
  const openURL = jest.spyOn(Linking, 'openURL').mockImplementation(async () => true);

  const { getByRole } = renderWithProvider(<Link href="https://example.com">外链</Link>);
  fireEvent.press(getByRole('link'));

  expect(openURL).toHaveBeenCalledTimes(1);
  expect(openURL).toHaveBeenCalledWith('https://example.com');

  openURL.mockRestore();
});
