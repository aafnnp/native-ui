import React from "react";
import { Alert, Box, Button, NativeUIProvider } from "kra-ui";

/**
 * Alert 基础示例
 */
function AlertBasicDemo() {
  return (
    <NativeUIProvider>
      <Box>
        <Alert variant="info" title="提示" message="这是一条信息提示。" marginBottom="s" />
        <Alert variant="success" title="成功" message="操作已完成。" marginBottom="s" />
        <Alert variant="warning" title="警告" message="请先确认关键字段。" marginBottom="s" />
        <Alert
          variant="error"
          title="错误"
          message="操作失败，请稍后重试。"
          closable
          action={<Button label="重试" size="sm" variant="outline" />}
        />
      </Box>
    </NativeUIProvider>
  );
}

export default AlertBasicDemo;
