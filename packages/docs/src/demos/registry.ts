import { accordionBasicSource } from "./sources/accordion";

/**
 * Demo 注册表最小实现
 */
export const demoRegistry = {
  "modal-basic": {
    load: () => import("./components/modal/basic"),
    source: "// modal 示例源码待补充",
  },
  "toast-basic": {
    load: () => import("./components/toast/basic"),
    source: "// toast 示例源码待补充",
  },
  "tabs-basic": {
    load: () => import("./components/tabs/basic"),
    source: "// tabs 示例源码待补充",
  },
  "accordion-basic": {
    load: () => import("./components/accordion/basic"),
    source: accordionBasicSource,
  },
};

/**
 * Demo id 列表（供校验脚本使用）
 */
export const demoIds = Object.freeze(
  Object.keys(demoRegistry) as Array<keyof typeof demoRegistry>,
);

export type DemoRegistry = typeof demoRegistry;
