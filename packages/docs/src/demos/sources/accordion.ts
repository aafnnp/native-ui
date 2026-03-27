/**
 * Accordion 示例源码文本
 */
export const accordionBasicSource = `import React from "react";
import { Accordion, NativeUIProvider, Text } from "kra-ui";

export default function AccordionBasicDemo() {
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
`;
