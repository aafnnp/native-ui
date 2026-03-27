/**
 * 为 web 文档构建提供 react-native 内部路径兜底，
 * 避免第三方库在 web 端解析到 RN 私有实现。
 */
const noop = () => undefined;

export default {};
export const findHostInstance_DEPRECATED = noop;
export const findHostInstanceWithWarning = noop;
