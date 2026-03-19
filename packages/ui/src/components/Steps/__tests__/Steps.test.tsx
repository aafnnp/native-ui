/**
 * Steps 组件基础用例
 * - 渲染标题/描述
 * - 传入 onChange 时可点击并触发回调
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import Steps from '../index';

test('渲染标题与描述', () => {
  const { getByText } = renderWithProvider(
    <Steps
      current={0}
      items={[
        { title: '第一步', description: '描述1' },
        { title: '第二步', description: '描述2' },
      ]}
    />,
  );

  expect(getByText('第一步')).toBeTruthy();
  expect(getByText('描述1')).toBeTruthy();
  expect(getByText('第二步')).toBeTruthy();
  expect(getByText('描述2')).toBeTruthy();
});

test('点击步骤触发 onChange', () => {
  const onChange = jest.fn();
  const { getByLabelText } = renderWithProvider(
    <Steps current={0} onChange={onChange} items={[{ title: '第一步' }, { title: '第二步' }]} />,
  );

  fireEvent.press(getByLabelText('步骤 2: 第二步'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(1);
});
