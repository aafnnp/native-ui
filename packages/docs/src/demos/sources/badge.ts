/**
 * Badge 示例源码文本
 */
export const badgeBasicSource = `import React from "react";
import { Badge, Box, NativeUIProvider } from "kra-ui";

export default function BadgeBasicDemo() {
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
`;
