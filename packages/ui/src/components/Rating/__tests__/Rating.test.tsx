/**
 * Rating 组件基础用例
 * - 点击星星触发 onChange
 * - readonly 时不触发 onChange
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import Rating from '../index';

test('点击星星触发 onChange', () => {
  const onChange = jest.fn();
  const { getByLabelText } = renderWithProvider(<Rating value={0} onChange={onChange} />);

  fireEvent.press(getByLabelText('3 星'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(3);
});

test('readonly 时不触发 onChange', () => {
  const onChange = jest.fn();
  const { getByLabelText } = renderWithProvider(<Rating value={0} onChange={onChange} readonly />);

  fireEvent.press(getByLabelText('2 星'));
  expect(onChange).not.toHaveBeenCalled();
});
