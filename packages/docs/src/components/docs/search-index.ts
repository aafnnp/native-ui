import { componentSlugs, guideNavItems, toComponentTitle } from './nav';

export interface SearchItem {
  title: string;
  path: string;
  group: 'guide' | 'component';
}

/**
 * 文档搜索索引（最简版）
 */
export const searchItems: SearchItem[] = [
  ...guideNavItems.map((item) => ({
    title: item.title,
    path: item.path,
    group: 'guide' as const,
  })),
  ...componentSlugs.map((slug) => ({
    title: `${toComponentTitle(slug)} 组件`,
    path: `/guide/components/${slug}`,
    group: 'component' as const,
  })),
];
