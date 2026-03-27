import React from "react";
import { Box, HStack, NativeUIProvider, Text, VStack } from "kra-ui";

/**
 * Stack 基础示例
 */
function StackBasicDemo() {
  return (
    <NativeUIProvider>
      <VStack space="m">
        <Text>垂直堆叠</Text>
        <HStack space="s">
          <Box backgroundColor="primaryLight" borderRadius="s" padding="s">
            <Text>标签 A</Text>
          </Box>
          <Box backgroundColor="primaryLight" borderRadius="s" padding="s">
            <Text>标签 B</Text>
          </Box>
        </HStack>
      </VStack>
    </NativeUIProvider>
  );
}

export default StackBasicDemo;
