import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  NativeUIProvider,
  Text,
} from "../../../../../ui/src";

/**
 * Modal 兼容性最小样例
 */
function ModalBasicDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <NativeUIProvider>
      <Button onPress={() => setVisible(true)}>打开 Modal</Button>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <ModalHeader title="Modal 最小样例" />
        <ModalBody>
          <Text>这是使用 kra-ui Modal 的最小示例。</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onPress={() => setVisible(false)}>
            关闭
          </Button>
        </ModalFooter>
      </Modal>
    </NativeUIProvider>
  );
}

export default ModalBasicDemo;
