import type { AccessibilityState as RNAccessibilityState } from 'react-native';

/**
 * React Native 的 AccessibilityState 类型未包含 invalid，但 RN 平台实际支持该字段。
 * 这里做一次类型扩展，供组件库内部统一使用。
 */
export type AccessibilityState = RNAccessibilityState & { invalid?: boolean };

export interface NormalizeInteractiveStateInput {
  /**
   * 兼容旧字段：历史上部分组件/调用方使用 disabled/loading/invalid
   * 新规范优先使用 isDisabled/isLoading/isInvalid
   */
  disabled?: boolean;
  loading?: boolean;
  invalid?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  isInvalid?: boolean;
  accessibilityState?: AccessibilityState;
}

export interface NormalizeInteractiveStateResult {
  isDisabled: boolean;
  isLoading: boolean;
  isInvalid: boolean;
  /**
   * 用于 Pressable 的 disabled 计算（disabled 或 loading 时禁用点击）
   */
  isPressableDisabled: boolean;
  accessibilityState: AccessibilityState;
}

/**
 * 交互态归一化：统一 disabled/loading/invalid 与 a11y state 合并
 */
export function normalizeInteractiveState(
  input: NormalizeInteractiveStateInput,
): NormalizeInteractiveStateResult {
  // 新字段优先，其次回退旧字段
  const isDisabled = Boolean(input.isDisabled ?? input.disabled);
  const isLoading = Boolean(input.isLoading ?? input.loading);
  const isInvalid = Boolean(input.isInvalid ?? input.invalid);
  const isPressableDisabled = isDisabled || isLoading;

  const baseState: AccessibilityState = input.accessibilityState ?? {};

  return {
    isDisabled,
    isLoading,
    isInvalid,
    isPressableDisabled,
    accessibilityState: {
      ...baseState,
      disabled: baseState.disabled ?? isPressableDisabled,
      busy: baseState.busy ?? isLoading,
      invalid: baseState.invalid ?? isInvalid,
    },
  };
}
