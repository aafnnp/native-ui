import React, {useState} from 'react';
import {TextInput, type TextInputProps} from 'react-native';
import {
  createRestyleComponent,
  createVariant,
  spacing,
  border,
  backgroundColor,
  useTheme,
  type VariantProps,
} from '@shopify/restyle';
import type {Theme} from '../../theme';
import Box from '../Box';
import type {BoxProps} from '../Box';

type TextareaContainerProps = VariantProps<Theme, 'inputVariants'> &
  React.ComponentProps<typeof Box>;

const TextareaContainer = createRestyleComponent<TextareaContainerProps, Theme>(
  [createVariant({themeKey: 'inputVariants'}), spacing, border, backgroundColor],
  Box,
);

const sizeMap = {
  sm: {fontSize: 14, lineHeight: 20},
  md: {fontSize: 16, lineHeight: 24},
  lg: {fontSize: 18, lineHeight: 28},
};

export interface TextareaProps extends BoxProps, Omit<TextInputProps, 'style'> {
  /** 变体 */
  variant?: 'outline' | 'filled' | 'underline';
  /** 尺寸 */
  size?: keyof typeof sizeMap;
  /** 行数，默认 3 */
  rows?: number;
  /** 是否无效 */
  isInvalid?: boolean;
  /** 是否禁用 */
  isDisabled?: boolean;
}

/**
 * 多行文本输入组件
 * 复用 inputVariants 主题变体
 */
function Textarea({
  variant = 'outline',
  size = 'md',
  rows = 3,
  isInvalid = false,
  isDisabled = false,
  placeholder,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...rest
}: TextareaProps) {
  const theme = useTheme<Theme>();
  const [isFocused, setIsFocused] = useState(false);
  const s = sizeMap[size];
  const minHeight = s.lineHeight * rows + 16;

  return (
    <TextareaContainer
      variant={variant}
      opacity={isDisabled ? 0.5 : 1}
      style={{
        minHeight,
        borderColor: isInvalid
          ? theme.colors.error
          : isFocused
            ? theme.colors.borderFocus
            : undefined,
      }}
      {...rest}>
      <TextInput
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        editable={!isDisabled}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={e => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={e => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        style={{
          flex: 1,
          fontSize: s.fontSize,
          lineHeight: s.lineHeight,
          color: theme.colors.textPrimary,
          paddingVertical: 8,
        }}
      />
    </TextareaContainer>
  );
}

export default Textarea;
