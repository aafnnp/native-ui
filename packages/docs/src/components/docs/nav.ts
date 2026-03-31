/**
 * 文档导航数据：用于左侧导航树与顶部搜索索引
 */
export const guideNavItems = [
  { title: '快速开始', path: '/guide/getting-started' },
  { title: '主题系统', path: '/guide/theme' },
  { title: '迁移指南', path: '/guide/migration' },
] as const;

export const componentSlugs = [
  'accordion',
  'alert',
  'aspect-ratio',
  'avatar',
  'badge',
  'box',
  'button',
  'card',
  'center',
  'checkbox',
  'code',
  'divider',
  'dropdown',
  'flex',
  'grid',
  'group',
  'heading',
  'highlight',
  'icon',
  'input',
  'link',
  'list',
  'modal',
  'number-input',
  'page-container',
  'password-input',
  'pin-input',
  'popup',
  'radio',
  'rating',
  'scroll-area',
  'segmented-control',
  'separator',
  'spinner',
  'stack',
  'steps',
  'switch',
  'tabs',
  'text',
  'textarea',
  'toast',
] as const;

/**
 * 组件 slug 转展示名称
 */
export function toComponentTitle(slug: string) {
  return slug
    .split('-')
    .map((part) => (part ? `${part[0]!.toUpperCase()}${part.slice(1)}` : part))
    .join(' ');
}
