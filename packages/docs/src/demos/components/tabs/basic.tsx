import React, { useState } from "react";
import { NativeUIProvider, Tabs, Text } from "../../../../../ui/src";

/**
 * Tabs 兼容性最小样例
 */
function TabsBasicDemo() {
  const [active, setActive] = useState<"tab-a" | "tab-b">("tab-a");

  return (
    <NativeUIProvider>
      <Tabs
        items={[
          { key: "tab-a", label: "选项 A" },
          { key: "tab-b", label: "选项 B" },
        ]}
        activeKey={active}
        onChange={(key) => setActive(key as "tab-a" | "tab-b")}
      >
        <Text>这是选项 A 内容。</Text>
        <Text>这是选项 B 内容。</Text>
      </Tabs>
    </NativeUIProvider>
  );
}

export default TabsBasicDemo;
