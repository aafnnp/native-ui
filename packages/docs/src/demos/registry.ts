/**
 * Demo 注册表最小实现
 */
export const demoRegistry = {
  "modal-basic": () => import("./components/modal/basic"),
  "toast-basic": () => import("./components/toast/basic"),
  "tabs-basic": () => import("./components/tabs/basic"),
};

export type DemoRegistry = typeof demoRegistry;
