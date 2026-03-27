/**
 * Input 示例源码文本
 */
export const inputBasicSource = `import React from "react";
import { Box, Input, NativeUIProvider } from "kra-ui";

export default function InputBasicDemo() {
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
`;
