import React, { useState } from "react";
import { Box, Checkbox, NativeUIProvider } from "kra-ui";

/**
 * Checkbox 基础示例
 */
function CheckboxBasicDemo() {
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

export default CheckboxBasicDemo;
