/**
 * Stack/HStack/VStack 组件基础用例
 * - 在 Provider 下可渲染
 * - 支持渲染 children
 */
import { renderWithProvider } from '../../../test-utils/render';
import Stack, { HStack, VStack } from '../index';
import Text from '../../Text';

test('Stack 可渲染并显示 children', () => {
  const { getByText } = renderWithProvider(
    <Stack>
      <Text>一</Text>
      <Text>二</Text>
    </Stack>,
  );
  expect(getByText('一')).toBeTruthy();
  expect(getByText('二')).toBeTruthy();
});

test('HStack 可渲染', () => {
  expect(() =>
    renderWithProvider(
      <HStack>
        <Text>A</Text>
        <Text>B</Text>
      </HStack>,
    ),
  ).not.toThrow();
});

test('VStack 可渲染', () => {
  expect(() =>
    renderWithProvider(
      <VStack>
        <Text>A</Text>
        <Text>B</Text>
      </VStack>,
    ),
  ).not.toThrow();
});
