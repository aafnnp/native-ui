import React, { useState } from 'react';
import { Box, Button, NativeUIProvider } from 'kra-ui';

/**
 * Button 基础示例
 */
function ButtonBasicDemo() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <NativeUIProvider>
      <Box>
        <Button
          label={`主要按钮（已点击 ${clickCount} 次）`}
          marginBottom="xs"
          onPress={() => setClickCount((count) => count + 1)}
        />
        <Button label="次要按钮" variant="outline" marginBottom="xs" />
        <Button label="危险操作" variant="danger" marginBottom="xs" />
        <Button label="加载中" isLoading />
      </Box>
    </NativeUIProvider>
  );
}

export default ButtonBasicDemo;
