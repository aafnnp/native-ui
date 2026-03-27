/**
 * Button 示例源码文本
 */
export const buttonBasicSource = `import React from "react";
import { Box, Button, NativeUIProvider } from "kra-ui";

export default function ButtonBasicDemo() {
  return (
    <NativeUIProvider>
      <Box>
        <Button label="主要按钮" marginBottom="xs" />
        <Button label="次要按钮" variant="outline" marginBottom="xs" />
        <Button label="危险操作" variant="danger" marginBottom="xs" />
        <Button label="加载中" isLoading />
      </Box>
    </NativeUIProvider>
  );
}
`;
