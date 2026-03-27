import React from "react";
import { Badge, Box, NativeUIProvider } from "kra-ui";

/**
 * Badge 基础示例
 */
function BadgeBasicDemo() {
  return (
    <NativeUIProvider>
      <Box>
        <Badge label="新" variant="solid" marginBottom="xs" />
        <Badge label="进行中" variant="subtle" marginBottom="xs" />
        <Badge label="待审核" variant="outline" />
      </Box>
    </NativeUIProvider>
  );
}

export default BadgeBasicDemo;
