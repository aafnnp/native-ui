import React, { useState } from "react";
import { Box, NativeUIProvider, Textarea } from "kra-ui";

/**
 * Textarea 基础示例
 */
function TextareaBasicDemo() {
  const [value, setValue] = useState("");

  return (
    <NativeUIProvider>
      <Box>
        <Textarea
          placeholder="请输入内容..."
          value={value}
          onChangeText={setValue}
          marginBottom="xs"
        />
        <Textarea placeholder="无效状态" isInvalid marginBottom="xs" />
        <Textarea placeholder="禁用状态" isDisabled />
      </Box>
    </NativeUIProvider>
  );
}

export default TextareaBasicDemo;
