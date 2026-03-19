/**
 * Switch 组件基础用例
 * - 渲染 label 与 onLabel/offLabel
 * - 触发 onValueChange
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import Switch from '../index';

test('渲染 label 与 offLabel/onLabel', () => {
  const { getByText, queryByText } = renderWithProvider(
    <Switch label="通知" value={false} offLabel="关" onLabel="开" />,
  );

  expect(getByText('通知')).toBeTruthy();
  expect(getByText('关')).toBeTruthy();
  expect(queryByText('开')).toBeNull();
});

test('value 为 true 时显示 onLabel', () => {
  const { getByText } = renderWithProvider(
    <Switch label="通知" value={true} offLabel="关" onLabel="开" />,
  );
  expect(getByText('开')).toBeTruthy();
});

test('触发 onValueChange', () => {
  const onValueChange = jest.fn();
  const { getByRole } = renderWithProvider(<Switch value={false} onValueChange={onValueChange} />);

  fireEvent(getByRole('switch'), 'valueChange', true);
  expect(onValueChange).toHaveBeenCalledTimes(1);
  expect(onValueChange).toHaveBeenCalledWith(true);
});
