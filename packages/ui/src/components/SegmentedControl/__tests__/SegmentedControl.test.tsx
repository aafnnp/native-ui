/**
 * SegmentedControl 组件基础用例
 * - 点击触发 onChange
 * - accessibilityState.selected 标记当前选中项
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import SegmentedControl from '../index';

test('点击触发 onChange', () => {
  const onChange = jest.fn();
  const segments = [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
  ];

  const { getAllByRole } = renderWithProvider(
    <SegmentedControl segments={segments} value="a" onChange={onChange} />,
  );

  const tabs = getAllByRole('tab');
  fireEvent.press(tabs[1]);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('b');
});

test('选中项具有 accessibilityState.selected', () => {
  const segments = [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
  ];

  const { getAllByRole } = renderWithProvider(<SegmentedControl segments={segments} value="b" />);

  const tabs = getAllByRole('tab');
  expect(tabs[0].props.accessibilityState?.selected).toBe(false);
  expect(tabs[1].props.accessibilityState?.selected).toBe(true);
});
