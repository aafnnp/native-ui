import React from "react";
import { Box, Input, NativeUIProvider } from "kra-ui";

/**
 * Input 基础示例
 */
function InputBasicDemo() {
  return (
    <NativeUIProvider>
      <Box>
        <Input placeholder="请输入用户名" marginBottom="xs" />
        <Input placeholder="无效状态" isInvalid marginBottom="xs" />
        <Input placeholder="禁用状态" isDisabled />
      </Box>
    </NativeUIProvider>
  );
}

export default InputBasicDemo;
