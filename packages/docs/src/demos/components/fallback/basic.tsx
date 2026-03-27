import React from "react";

/**
 * 兼容兜底示例（用于避免构建阶段引入 React Native 依赖）
 */
export default function FallbackDemo() {
  return <p>该示例暂未在当前 Astro 构建链路中启用。</p>;
}
