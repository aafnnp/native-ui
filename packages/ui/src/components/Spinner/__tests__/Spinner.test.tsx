/**
 * Spinner 组件基础用例
 * - 在 Provider 下可渲染
 */
import { ActivityIndicator } from 'react-native';
import { renderWithProvider } from '../../../test-utils/render';
import Spinner from '../index';

test('渲染 ActivityIndicator', () => {
  const { UNSAFE_getByType } = renderWithProvider(<Spinner />);
  expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
});
