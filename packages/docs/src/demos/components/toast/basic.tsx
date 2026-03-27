import React from "react";
import { Button, NativeUIProvider, toast } from "kra-ui";

/**
 * Toast 兼容性最小样例
 */
function ToastBasicDemo() {
  const handleShowToast = () => {
    toast.info({
      title: "Toast 最小样例",
      message: "这是使用 kra-ui Toast 的最小示例。",
    });
  };

  return (
    <NativeUIProvider>
      <Button onPress={handleShowToast}>显示 Toast</Button>
    </NativeUIProvider>
  );
}

export default ToastBasicDemo;
