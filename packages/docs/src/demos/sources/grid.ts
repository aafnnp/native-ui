/**
 * Grid 示例源码文本
 */
export const gridBasicSource = `import React from "react";
import { Box, Grid, NativeUIProvider, Text } from "kra-ui";

export default function GridBasicDemo() {
  return (
    <NativeUIProvider>
      <Grid columns={2} spacing="s">
        <Box backgroundColor="primaryLight" borderRadius="s" padding="m">
          <Text>卡片 1</Text>
        </Box>
        <Box backgroundColor="primaryLight" borderRadius="s" padding="m">
          <Text>卡片 2</Text>
        </Box>
        <Box backgroundColor="primaryLight" borderRadius="s" padding="m">
          <Text>卡片 3</Text>
        </Box>
        <Box backgroundColor="primaryLight" borderRadius="s" padding="m">
          <Text>卡片 4</Text>
        </Box>
      </Grid>
    </NativeUIProvider>
  );
}
`;
