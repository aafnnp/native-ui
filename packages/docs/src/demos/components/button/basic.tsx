import React from "react";
import { Box, Button, NativeUIProvider } from "kra-ui";

/**
 * Button 基础示例
 */
function ButtonBasicDemo() {
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

export default ButtonBasicDemo;
