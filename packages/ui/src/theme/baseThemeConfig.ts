/**
 * 主题通用配置（不含 colors）
 *
 * 说明：
 * - 浅色/暗色主题只在 colors 上有差异
 * - 其余 spacing / radii / variants 等保持单一事实来源，避免双文件复制带来的同步成本
 */
export const baseThemeConfig = {
  spacing: {
    '0': 0,
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadii: {
    none: 0,
    xs: 2,
    s: 4,
    m: 8,
    l: 12,
    xl: 16,
    full: 9999,
  },

  breakpoints: {
    phone: 0,
    tablet: 768,
  },

  // 文本变体
  textVariants: {
    defaults: {
      color: 'textPrimary',
      fontSize: 16,
      lineHeight: 24,
    },
    header: {
      fontSize: 34,
      fontWeight: 'bold',
      lineHeight: 42,
      color: 'textPrimary',
    },
    subheader: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      color: 'textPrimary',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      color: 'textPrimary',
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      color: 'textSecondary',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      lineHeight: 20,
      color: 'textPrimary',
    },
  },

  // 按钮变体
  buttonVariants: {
    defaults: {
      paddingVertical: 's',
      paddingHorizontal: 'm',
      borderRadius: 'm',
    },
    filled: {
      backgroundColor: 'primary',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'primary',
    },
    ghost: {
      backgroundColor: 'transparent',
    },
    danger: {
      backgroundColor: 'error',
    },
  },

  // 按钮尺寸（sm/md/lg）
  buttonSizes: {
    sm: { paddingVertical: 'xs', paddingHorizontal: 's', fontSize: 14 },
    md: { paddingVertical: 's', paddingHorizontal: 'm', fontSize: 16 },
    lg: { paddingVertical: 'm', paddingHorizontal: 'l', fontSize: 18 },
  },

  // 卡片变体
  cardVariants: {
    defaults: {
      padding: 'm',
      borderRadius: 'l',
      backgroundColor: 'cardBackground',
    },
    elevated: {
      shadowColor: 'textPrimary',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    outline: {
      borderWidth: 1,
      borderColor: 'border',
    },
    filled: {
      backgroundColor: 'primaryLight',
    },
  },

  // 徽章变体
  badgeVariants: {
    defaults: {
      paddingVertical: 'xs',
      paddingHorizontal: 's',
      borderRadius: 's',
    },
    solid: {
      backgroundColor: 'primary',
    },
    subtle: {
      backgroundColor: 'primaryLight',
    },
    outline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: 'primary',
    },
  },

  // 输入框变体
  inputVariants: {
    defaults: {
      padding: 's',
      borderRadius: 'm',
      fontSize: 16,
      color: 'textPrimary',
    },
    outline: {
      borderWidth: 1,
      borderColor: 'border',
      backgroundColor: 'inputBackground',
    },
    filled: {
      backgroundColor: 'primaryLight',
      borderWidth: 0,
    },
    underline: {
      borderBottomWidth: 1,
      borderColor: 'border',
      borderRadius: 'none',
      paddingHorizontal: '0',
    },
  },

  /**
   * Input/Textarea 尺寸 token（sm/md/lg）
   * 说明：这里提供最小可用字段，供组件动态计算高度与字号
   */
  inputSizes: {
    sm: { height: 36, fontSize: 14, radius: 'm' },
    md: { height: 44, fontSize: 16, radius: 'm' },
    lg: { height: 52, fontSize: 18, radius: 'l' },
  },

  /**
   * Input/Textarea 状态 token（default/focus/invalid/disabled）
   * 说明：颜色使用主题语义色，避免组件里硬编码
   */
  inputStates: {
    default: {
      borderColor: 'border',
      backgroundColor: 'inputBackground',
      textColor: 'textPrimary',
      iconColor: 'textSecondary',
    },
    focus: {
      borderColor: 'borderFocus',
      backgroundColor: 'inputBackground',
      textColor: 'textPrimary',
      iconColor: 'textSecondary',
    },
    invalid: {
      borderColor: 'error',
      backgroundColor: 'inputBackground',
      textColor: 'textPrimary',
      iconColor: 'error',
    },
    disabled: {
      borderColor: 'border',
      backgroundColor: 'inputBackground',
      textColor: 'textMuted',
      iconColor: 'textMuted',
    },
  },

  // Alert 变体
  alertVariants: {
    defaults: {
      padding: 'm',
      borderRadius: 'm',
      borderWidth: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
    },
    info: {
      backgroundColor: 'primaryLight',
      borderColor: 'primary',
    },
    success: {
      backgroundColor: 'successLight',
      borderColor: 'success',
    },
    warning: {
      backgroundColor: 'warningLight',
      borderColor: 'warning',
    },
    error: {
      backgroundColor: 'errorLight',
      borderColor: 'error',
    },
  },

  /**
   * Toast 变体（按 status 映射）
   * 说明：Toast 组件会读取 accentColor/backgroundColor/textColor
   */
  toastVariants: {
    info: {
      accentColor: 'primary',
      backgroundColor: 'cardBackground',
      textColor: 'textPrimary',
    },
    success: {
      accentColor: 'success',
      backgroundColor: 'cardBackground',
      textColor: 'textPrimary',
    },
    warning: {
      accentColor: 'warning',
      backgroundColor: 'cardBackground',
      textColor: 'textPrimary',
    },
    error: {
      accentColor: 'error',
      backgroundColor: 'cardBackground',
      textColor: 'textPrimary',
    },
  },

  // Alert 尺寸
  alertSizes: {
    sm: {
      paddingX: 's',
      paddingY: 's',
      gap: 's',
      iconSize: 16,
      radius: 'm',
      titleTextVariant: 'label',
      messageTextVariant: 'caption',
    },
    md: {
      paddingX: 'm',
      paddingY: 'm',
      gap: 's',
      iconSize: 18,
      radius: 'm',
      titleTextVariant: 'label',
      messageTextVariant: 'body',
    },
  },

  // Accordion 变体
  accordionVariants: {
    defaults: {},
    outline: {
      borderWidth: 1,
      borderColor: 'border',
      borderRadius: 'm',
      overflow: 'hidden' as const,
    },
    filled: {
      borderWidth: 1,
      borderColor: 'border',
      borderRadius: 'm',
      overflow: 'hidden' as const,
    },
    separated: {
      gap: 's',
    },
  },

  accordionItemVariants: {
    defaults: {},
    separated: {
      borderWidth: 1,
      borderColor: 'border',
      borderRadius: 'm',
      overflow: 'hidden' as const,
    },
  },

  accordionHeaderVariants: {
    defaults: {},
    filled: {
      backgroundColor: 'primaryLight',
    },
  },

  // Avatar 尺寸（推荐 sm/md/lg，兼容 xs/xl）
  avatarSizes: {
    xs: {
      dimension: 24,
      fontSize: 10,
      gap: 4,
      ringWidth: 1,
      statusSize: 6,
    },
    sm: {
      dimension: 32,
      fontSize: 12,
      gap: 6,
      ringWidth: 1,
      statusSize: 8,
    },
    md: {
      dimension: 48,
      fontSize: 18,
      gap: 8,
      ringWidth: 2,
      statusSize: 10,
    },
    lg: {
      dimension: 64,
      fontSize: 24,
      gap: 10,
      ringWidth: 2,
      statusSize: 12,
    },
    xl: {
      dimension: 96,
      fontSize: 36,
      gap: 12,
      ringWidth: 2,
      statusSize: 16,
    },
  },

  // Avatar 回退态配色倾向
  avatarVariants: {
    solid: {
      backgroundColor: 'primaryLight',
      textColor: 'primary',
    },
    subtle: {
      backgroundColor: 'codeBackground',
      textColor: 'textSecondary',
    },
  },

  // Avatar 状态色
  avatarStatusColors: {
    online: 'success',
    offline: 'border',
    busy: 'error',
    away: 'warning',
  },
} as const;
