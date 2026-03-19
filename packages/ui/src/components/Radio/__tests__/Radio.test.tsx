/**
 * Radio/RadioGroup 组件基础用例
 * - 点击 Radio 触发 RadioGroup.onChange
 * - accessibilityState.selected 随 value 变化
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import Radio, { RadioGroup } from '../index';

test('点击触发 onChange', () => {
  const onChange = jest.fn();
  const { getAllByRole } = renderWithProvider(
    <RadioGroup value="a" onChange={onChange}>
      <Radio value="a" label="A" />
      <Radio value="b" label="B" />
    </RadioGroup>,
  );

  const radios = getAllByRole('radio');
  fireEvent.press(radios[1]);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('b');
});

test('选中状态随 value 变化', () => {
  const { getAllByRole } = renderWithProvider(
    <RadioGroup value="a">
      <Radio value="a" label="A" />
      <Radio value="b" label="B" />
    </RadioGroup>,
  );

  const radiosBefore = getAllByRole('radio');
  expect(radiosBefore[0].props.accessibilityState?.selected).toBe(true);
  expect(radiosBefore[1].props.accessibilityState?.selected).toBe(false);
});

test('value 为 b 时第二项选中', () => {
  const { getAllByRole } = renderWithProvider(
    <RadioGroup value="b">
      <Radio value="a" label="A" />
      <Radio value="b" label="B" />
    </RadioGroup>,
  );

  const radios = getAllByRole('radio');
  expect(radios[0].props.accessibilityState?.selected).toBe(false);
  expect(radios[1].props.accessibilityState?.selected).toBe(true);
});
