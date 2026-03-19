/**
 * Icon/createIcon/icons 基础用例
 * - Icon 可渲染并映射预设 size
 * - createIcon 创建的组件可渲染
 * - icons.ts 导出的图标可渲染
 */
import Svg, { Path } from 'react-native-svg';
import { renderWithProvider } from '../../../test-utils/render';
import Icon, { createIcon } from '../index';
import { CheckIcon } from '../icons';

test('Icon 映射预设 size', () => {
  const { UNSAFE_getByType } = renderWithProvider(
    <Icon size="md" accessibilityLabel="基础图标">
      <Path d="M0 0h24v24H0z" />
    </Icon>,
  );

  const svg = UNSAFE_getByType(Svg);
  expect(svg.props.width).toBe(20);
  expect(svg.props.height).toBe(20);
  expect(svg.props.accessibilityLabel).toBe('基础图标');
});

test('createIcon 创建的组件可渲染', () => {
  const Custom = createIcon({
    displayName: 'TestIcon',
    d: 'M0 0h24v24H0z',
  });

  expect(() => renderWithProvider(<Custom accessibilityLabel="自定义图标" />)).not.toThrow();
});

test('icons.ts 导出的图标可渲染', () => {
  expect(() => renderWithProvider(<CheckIcon accessibilityLabel="对勾" />)).not.toThrow();
});
