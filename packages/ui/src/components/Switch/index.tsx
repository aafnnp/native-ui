import React from 'react';
import {Switch as RNSwitch, type SwitchProps as RNSwitchProps} from 'react-native';
import {useTheme} from '@shopify/restyle';
import type {Theme} from '../../theme';
import Box from '../Box';
import Text from '../Text';
import type {BoxProps} from '../Box';

const scaleMap = {
  sm: 0.8,
  md: 1,
  lg: 1.2,
};

export interface SwitchProps extends RNSwitchProps {
  /** 标签文字 */
  label?: string;
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 是否禁用 */
  isDisabled?: boolean;
  /** 开启状态文字 */
  onLabel?: string;
  /** 关闭状态文字 */
  offLabel?: string;
  /** 容器属性 */
  containerProps?: BoxProps;
}

/**
 * 开关组件
 * 自动适配主题颜色，支持 size、isDisabled、onLabel/offLabel
 */
function Switch({
  label,
  size = 'md',
  isDisabled = false,
  onLabel,
  offLabel,
  containerProps,
  value,
  disabled,
  ...rest
}: SwitchProps) {
  const theme = useTheme<Theme>();
  const isOff = !value;
  const finalDisabled = isDisabled || disabled;
  const scale = scaleMap[size];
  const statusLabel = isOff ? offLabel : onLabel;

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      opacity={finalDisabled ? 0.5 : 1}
      {...containerProps}>
      {label && (
        <Text variant="body" marginRight="s">
          {label}
        </Text>
      )}
      <Box flexDirection="row" alignItems="center">
        <Box style={{transform: [{scale}]}}>
          <RNSwitch
            value={value}
            disabled={finalDisabled}
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.textInverse}
            ios_backgroundColor={theme.colors.border}
            {...rest}
          />
        </Box>
        {statusLabel && (
          <Text variant="caption" marginLeft="xs">
            {statusLabel}
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default Switch;
