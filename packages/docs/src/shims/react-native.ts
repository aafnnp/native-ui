import * as ReactNativeWeb from "react-native-web";

/**
 * 为 Web 构建补齐 react-native-reanimated 所需的最小 TurboModuleRegistry
 */
export const TurboModuleRegistry = {
  get() {
    return null;
  },
};

export * from "react-native-web";
export default ReactNativeWeb;
