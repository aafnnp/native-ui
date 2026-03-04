import React, {useState} from 'react';
import {Pressable} from 'react-native';
import Input from '../Input';
import type {InputProps} from '../Input';
import Text from '../Text';

export interface PasswordInputProps extends InputProps {
  /** 是否显示可见性切换按钮，默认 true */
  visibilityToggle?: boolean;
}

/**
 * 密码输入框组件
 * 基于 Input，支持密码可见性切换
 */
function PasswordInput({
  visibilityToggle = true,
  ...rest
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  const toggleButton = visibilityToggle ? (
    <Pressable
      onPress={() => setVisible(v => !v)}
      hitSlop={8}
      accessibilityLabel={visible ? '隐藏密码' : '显示密码'}>
      <Text color="textMuted" fontSize={14}>
        {visible ? '隐藏' : '显示'}
      </Text>
    </Pressable>
  ) : undefined;

  return (
    <Input
      secureTextEntry={!visible}
      rightElement={toggleButton}
      autoCapitalize="none"
      autoCorrect={false}
      {...rest}
    />
  );
}

export default PasswordInput;
