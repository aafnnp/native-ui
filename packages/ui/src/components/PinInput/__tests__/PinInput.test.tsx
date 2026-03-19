/**
 * PinInput 组件基础用例
 * - 输入后触发 onChange
 * - 全部输入完成触发 onComplete
 */
import React from 'react';
import { TextInput } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import PinInput from '../index';

test('输入触发 onChange', () => {
  const onChange = jest.fn();
  const { UNSAFE_getAllByType } = renderWithProvider(
    <PinInput length={4} value="" onChange={onChange} />,
  );

  const inputs = UNSAFE_getAllByType(TextInput);
  fireEvent.changeText(inputs[0], '1');

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith('1');
});

test('输入完成触发 onComplete', () => {
  const onComplete = jest.fn();
  const onChange = jest.fn();

  function ControlledPin() {
    const [value, setValue] = React.useState('');
    return (
      <PinInput
        length={4}
        value={value}
        onChange={(v) => {
          setValue(v);
          onChange(v);
        }}
        onComplete={onComplete}
      />
    );
  }

  const { UNSAFE_getAllByType } = renderWithProvider(<ControlledPin />);

  const inputs = UNSAFE_getAllByType(TextInput);
  fireEvent.changeText(inputs[0], '1');
  fireEvent.changeText(inputs[1], '2');
  fireEvent.changeText(inputs[2], '3');
  fireEvent.changeText(inputs[3], '4');

  expect(onChange).toHaveBeenLastCalledWith('1234');
  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(onComplete).toHaveBeenCalledWith('1234');
});
