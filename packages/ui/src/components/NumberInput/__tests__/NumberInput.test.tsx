/**
 * NumberInput 组件基础用例
 * - 点击 +/- 触发 onChange（包含 clamp）
 * - 输入文本触发 onChange
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import NumberInput from '../index';

test('点击 + / − 触发 onChange 并 clamp', () => {
  const onChange = jest.fn();
  const { getByText } = renderWithProvider(
    <NumberInput value={1} min={0} max={2} step={1} onChange={onChange} />,
  );

  fireEvent.press(getByText('+'));
  expect(onChange).toHaveBeenCalledWith(2);

  fireEvent.press(getByText('+'));
  expect(onChange).toHaveBeenCalledWith(2);

  fireEvent.press(getByText('−'));
  expect(onChange).toHaveBeenCalledWith(0);

  fireEvent.press(getByText('−'));
  expect(onChange).toHaveBeenCalledWith(0);
});

test('输入文本触发 onChange', () => {
  const onChange = jest.fn();
  const { getByLabelText } = renderWithProvider(
    <NumberInput placeholder="数量" value={1} onChange={onChange} />,
  );

  fireEvent.changeText(getByLabelText('数量'), '5');
  expect(onChange).toHaveBeenCalledWith(5);
});
