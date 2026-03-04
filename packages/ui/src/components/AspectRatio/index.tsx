import React from 'react';
import {StyleSheet} from 'react-native';
import Box from '../Box';
import type {BoxProps} from '../Box';

export interface AspectRatioProps extends BoxProps {
  /** 宽高比，默认 1 */
  ratio?: number;
}

/**
 * 宽高比容器
 * 子元素会绝对定位填满容器
 */
function AspectRatio({ratio = 1, children, style, ...rest}: AspectRatioProps) {
  return (
    <Box style={[{aspectRatio: ratio}, style]} {...rest}>
      <Box style={StyleSheet.absoluteFill}>{children}</Box>
    </Box>
  );
}

export default AspectRatio;
