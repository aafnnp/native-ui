import React, { useState } from "react";

/**
 * Tabs 兼容性最小样例
 */
function TabsBasicDemo() {
  const [active, setActive] = useState<"tab-a" | "tab-b">("tab-a");

  return (
    <div>
      <div role="tablist" aria-label="基础 Tabs 示例">
        <button
          type="button"
          role="tab"
          aria-selected={active === "tab-a"}
          onClick={() => setActive("tab-a")}
        >
          选项 A
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={active === "tab-b"}
          onClick={() => setActive("tab-b")}
        >
          选项 B
        </button>
      </div>
      <div role="tabpanel">
        {active === "tab-a" ? "这是选项 A 内容。" : "这是选项 B 内容。"}
      </div>
    </div>
  );
}

export default TabsBasicDemo;
