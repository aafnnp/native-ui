import { accordionBasicSource } from "./sources/accordion";
import { alertBasicSource } from "./sources/alert";
import { avatarBasicSource } from "./sources/avatar";
import { badgeBasicSource } from "./sources/badge";
import { buttonBasicSource } from "./sources/button";

/**
 * Demo 注册表最小实现
 */
export const demoRegistry = {
  "modal-basic": {
    load: () => import("./components/modal/basic"),
    source: "// modal 示例源码待补充",
    meta: {
      title: "Modal 基础示例",
      description: "展示 Modal 的最小可运行用法。",
    },
  },
  "toast-basic": {
    load: () => import("./components/toast/basic"),
    source: "// toast 示例源码待补充",
    meta: {
      title: "Toast 基础示例",
      description: "展示 Toast 的最小可运行用法。",
    },
  },
  "tabs-basic": {
    load: () => import("./components/tabs/basic"),
    source: "// tabs 示例源码待补充",
    meta: {
      title: "Tabs 基础示例",
      description: "展示 Tabs 的最小可运行用法。",
    },
  },
  "accordion-basic": {
    load: () => import("./components/accordion/basic"),
    source: accordionBasicSource,
    meta: {
      title: "Accordion 基础示例",
      description: "展示 Accordion 的最小可运行用法。",
    },
  },
  "alert-basic": {
    load: () => import("./components/alert/basic"),
    source: alertBasicSource,
    meta: {
      title: "Alert 基础示例",
      description: "展示 Alert 的最小可运行用法。",
    },
  },
  "avatar-basic": {
    load: () => import("./components/avatar/basic"),
    source: avatarBasicSource,
    meta: {
      title: "Avatar 基础示例",
      description: "展示 Avatar 的最小可运行用法。",
    },
  },
  "badge-basic": {
    load: () => import("./components/badge/basic"),
    source: badgeBasicSource,
    meta: {
      title: "Badge 基础示例",
      description: "展示 Badge 的最小可运行用法。",
    },
  },
  "button-basic": {
    load: () => import("./components/button/basic"),
    source: buttonBasicSource,
    meta: {
      title: "Button 基础示例",
      description: "展示 Button 的最小可运行用法。",
    },
  },
};

/**
 * Demo id 列表（供校验脚本使用）
 */
export const demoIds = Object.freeze(
  Object.keys(demoRegistry) as Array<keyof typeof demoRegistry>,
);

export type DemoRegistry = typeof demoRegistry;
