import React from 'react';
import {Platform} from 'react-native';
import Box from '../Box';
import Text from '../Text';
import type {TextProps} from '../Text';

export interface CodeProps extends TextProps {
  /** 代码内容 */
  children: React.ReactNode;
}

const monoFontFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

/**
 * 行内代码组件
 * 等宽字体 + 背景色
 */
function Code({children, style, ...rest}: CodeProps) {
  return (
    <Box
      backgroundColor="codeBackground"
      borderRadius="xs"
      paddingHorizontal="xs"
      alignSelf="flex-start">
      <Text
        fontSize={14}
        style={[{fontFamily: monoFontFamily}, style]}
        {...rest}>
        {children}
      </Text>
    </Box>
  );
}

export default Code;
