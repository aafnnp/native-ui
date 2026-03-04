import React, {Children} from 'react';
import {useTheme} from '@shopify/restyle';
import {View} from 'react-native';
import type {Theme} from '../../theme';
import Box from '../Box';
import type {BoxProps} from '../Box';

export interface GridProps extends BoxProps {
  /** 列数，默认 2 */
  columns?: number;
  /** 间距，对应 theme.spacing 的键 */
  spacing?: keyof Theme['spacing'];
}

/**
 * 网格布局组件
 * 基于 flexWrap 实现多列网格
 */
function Grid({
  columns = 2,
  spacing = 's',
  children,
  ...rest
}: GridProps) {
  const theme = useTheme<Theme>();
  const gap = theme.spacing[spacing];
  const validChildren = Children.toArray(children).filter(Boolean);

  return (
    <Box
      flexDirection="row"
      flexWrap="wrap"
      style={{marginHorizontal: -gap / 2, marginVertical: -gap / 2}}
      {...rest}>
      {validChildren.map((child, index) => (
        <View
          key={index}
          style={{
            width: `${100 / columns}%`,
            padding: gap / 2,
          }}>
          {child}
        </View>
      ))}
    </Box>
  );
}

export default Grid;
