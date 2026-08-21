import raw from '@/data/stats.json';

export interface SiteStats {
  generatedAt: string;
  postCount: number;
  cjkChars: number;
  latinWords: number;
  minutes: number;
}

export const stats = raw as SiteStats;

/** 12345 → 「1.2 万字」；不足一万则用千分位。 */
export function formatChars(n: number): string {
  if (n >= 10_000) {
    const wan = n / 10_000;
    const text = wan >= 10 ? wan.toFixed(0) : wan.toFixed(1).replace(/\.0$/, '');
    return `${text} 万字`;
  }
  return `${n.toLocaleString('zh-CN')} 字`;
}

/** 75 → 「约 1 小时 15 分钟」 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 60) return `约 ${minutes} 分钟`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `约 ${h} 小时` : `约 ${h} 小时 ${m} 分钟`;
}
