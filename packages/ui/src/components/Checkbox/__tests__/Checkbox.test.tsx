/**
 * Checkbox 组件基础用例
 * - 渲染 label
 * - 点击触发 onChange
 * - 禁用时不触发 onChange
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import Checkbox from '../index';

test('渲染 label', () => {
  const { getByText } = renderWithProvider(<Checkbox label="同意协议" />);
  expect(getByText('同意协议')).toBeTruthy();
});

test('点击触发 onChange（取反当前值）', () => {
  const onChange = jest.fn();
  const { getByRole } = renderWithProvider(<Checkbox isChecked={false} onChange={onChange} />);

  fireEvent.press(getByRole('checkbox'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(true);
});

test('禁用时不触发 onChange', () => {
  const onChange = jest.fn();
  const { getByRole } = renderWithProvider(
    <Checkbox isChecked={false} isDisabled onChange={onChange} />,
  );

  fireEvent.press(getByRole('checkbox'));
  expect(onChange).not.toHaveBeenCalled();
  expect(getByRole('checkbox').props.accessibilityState).toMatchObject({
    disabled: true,
  });
});
