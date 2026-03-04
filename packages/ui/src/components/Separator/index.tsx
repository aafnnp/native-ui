import React from 'react';
import Box from '../Box';
import Text from '../Text';
import type {BoxProps} from '../Box';

export interface SeparatorProps extends Omit<BoxProps, 'height' | 'width'> {
  /** 方向：水平或垂直 */
  orientation?: 'horizontal' | 'vertical';
  /** 中间标签文字 */
  label?: string;
  /** 分割线粗细 */
  thickness?: number;
}

/**
 * 分隔符组件
 * 支持带文字标签的分隔线
 */
function Separator({
  orientation = 'horizontal',
  label,
  thickness = 1,
  ...rest
}: SeparatorProps) {
  const isHorizontal = orientation === 'horizontal';

  if (!isHorizontal) {
    return (
      <Box
        backgroundColor="divider"
        width={thickness}
        alignSelf="stretch"
        marginHorizontal="s"
        {...rest}
      />
    );
  }

  if (!label) {
    return (
      <Box
        backgroundColor="divider"
        height={thickness}
        alignSelf="stretch"
        marginVertical="s"
        {...rest}
      />
    );
  }

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      marginVertical="s"
      {...rest}>
      <Box flex={1} height={thickness} backgroundColor="divider" />
      <Text variant="caption" marginHorizontal="s">
        {label}
      </Text>
      <Box flex={1} height={thickness} backgroundColor="divider" />
    </Box>
  );
}

export default Separator;
