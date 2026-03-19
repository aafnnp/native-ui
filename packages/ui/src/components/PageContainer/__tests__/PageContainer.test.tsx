/**
 * PageContainer 组件基础用例
 * - 渲染标题与默认返回按钮
 * - 点击返回触发 onBack
 * - 点击底部按钮触发 onFooterPress
 */
import { fireEvent } from '@testing-library/react-native';
import { renderWithProvider } from '../../../test-utils/render';
import PageContainer from '../index';
import Text from '../../Text';

test('渲染标题与返回按钮', () => {
  const { getByText, getByLabelText } = renderWithProvider(
    <PageContainer title="页面标题">
      <Text>内容</Text>
    </PageContainer>,
  );

  expect(getByText('页面标题')).toBeTruthy();
  expect(getByLabelText('返回')).toBeTruthy();
  expect(getByText('内容')).toBeTruthy();
});

test('点击返回触发 onBack', () => {
  const onBack = jest.fn();
  const { getByLabelText } = renderWithProvider(<PageContainer title="页面标题" onBack={onBack} />);

  fireEvent.press(getByLabelText('返回'));
  expect(onBack).toHaveBeenCalledTimes(1);
});

test('点击底部按钮触发 onFooterPress', () => {
  const onFooterPress = jest.fn();
  const { getByText } = renderWithProvider(
    <PageContainer footerButtonLabel="提交" onFooterPress={onFooterPress} />,
  );

  fireEvent.press(getByText('提交'));
  expect(onFooterPress).toHaveBeenCalledTimes(1);
});
