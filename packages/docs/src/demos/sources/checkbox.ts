/**
 * Checkbox 示例源码文本
 */
export const checkboxBasicSource = `import React, { useState } from "react";
import { Box, Checkbox, NativeUIProvider } from "kra-ui";

export default function CheckboxBasicDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <NativeUIProvider>
      <Box>
        <Checkbox
          label="同意用户协议"
          isChecked={checked}
          onChange={setChecked}
          marginBottom="xs"
        />
        <Checkbox label="已选中" isChecked onChange={() => {}} marginBottom="xs" />
        <Checkbox label="禁用状态" isDisabled />
      </Box>
    </NativeUIProvider>
  );
}
`;
