import React from "react";
import { Accordion, NativeUIProvider, Text } from "kra-ui";

/**
 * Accordion 基础示例
 */
function AccordionBasicDemo() {
  return (
    <NativeUIProvider>
      <Accordion>
        <Accordion.Item title="第一项">
          <Text>这是第一项内容。</Text>
        </Accordion.Item>
        <Accordion.Item title="第二项">
          <Text>这是第二项内容。</Text>
        </Accordion.Item>
      </Accordion>
    </NativeUIProvider>
  );
}

export default AccordionBasicDemo;
