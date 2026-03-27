/**
 * Radio 示例源码文本
 */
export const radioBasicSource = `import React, { useState } from "react";
import { Box, NativeUIProvider, Radio, RadioGroup } from "kra-ui";

export default function RadioBasicDemo() {
  const [value, setValue] = useState("apple");

  return (
    <NativeUIProvider>
      <Box>
        <RadioGroup value={value} onChange={setValue}>
          <Radio value="apple" label="苹果" />
          <Radio value="banana" label="香蕉" />
          <Radio value="orange" label="橘子" />
        </RadioGroup>
      </Box>
    </NativeUIProvider>
  );
}
`;
