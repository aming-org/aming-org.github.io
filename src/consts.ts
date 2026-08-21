export const SITE = {
  title: '番茄贩卖商',
  tagline: '路过就读',
  description: '番茄贩卖商的短篇小说集。摊位上只摆虚构的故事。',
  author: '番茄贩卖商',
  lang: 'zh-CN',
  locale: 'zh_CN',
} as const;

export const NAV_LINKS = [
  { href: '/', label: '首页', en: 'Home' },
  { href: '/posts', label: '作品', en: 'Stories' },
  { href: '/tags', label: '标签', en: 'Tags' },
] as const;
