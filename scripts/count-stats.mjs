#!/usr/bin/env node
/**
 * 统计 src/content/posts 里已发布作品的总字数与阅读时长，
 * 写入 src/data/stats.json，供首页说明使用。
 *
 * 字数：汉字（CJK）个数。
 * 时长：与 src/utils/format.ts 的 readingTime 同一套算法
 *       （汉字 450 字/分钟 + 西文 220 词/分钟）。
 *
 * 草稿（frontmatter draft: true）不计入。
 *
 * 用法：
 *   pnpm stats
 * 构建前会自动跑一遍（prebuild），GitHub Actions 部署时也会更新。
 */
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const CJK_PER_MIN = 450;
const LATIN_PER_MIN = 220;

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(ROOT, 'src/content/posts');
const OUT_FILE = join(ROOT, 'src/data/stats.json');

/** @param {string} dir */
async function collectMarkdown(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectMarkdown(path)));
    } else if (['.md', '.mdx'].includes(extname(entry.name).toLowerCase())) {
      files.push(path);
    }
  }
  return files;
}

/**
 * @param {string} raw
 * @returns {{ draft: boolean, body: string }}
 */
function splitFrontmatter(raw) {
  const text = raw.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  if (!text.startsWith('---')) {
    return { draft: false, body: text };
  }
  const end = text.indexOf('\n---', 3);
  if (end === -1) {
    return { draft: false, body: text };
  }
  const fm = text.slice(3, end);
  const body = text.slice(end + 4).replace(/^\n/, '');
  const draft = /^draft:\s*true\s*$/m.test(fm);
  return { draft, body };
}

/** @param {string} body */
function countBody(body) {
  const cjkChars = (body.match(/[\u4e00-\u9fff]/g) ?? []).length;
  const latinWords = (body.match(/[A-Za-z0-9]+/g) ?? []).length;
  return { cjkChars, latinWords };
}

const files = await collectMarkdown(POSTS_DIR);
let postCount = 0;
let cjkChars = 0;
let latinWords = 0;

for (const file of files) {
  const raw = await readFile(file, 'utf8');
  const { draft, body } = splitFrontmatter(raw);
  if (draft) continue;
  const count = countBody(body);
  postCount += 1;
  cjkChars += count.cjkChars;
  latinWords += count.latinWords;
}

const minutes = Math.max(1, Math.round(cjkChars / CJK_PER_MIN + latinWords / LATIN_PER_MIN));

const stats = {
  generatedAt: new Date().toISOString(),
  postCount,
  cjkChars,
  latinWords,
  minutes,
};

await mkdir(dirname(OUT_FILE), { recursive: true });
await writeFile(OUT_FILE, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');

const wan = (cjkChars / 10000).toFixed(1).replace(/\.0$/, '');
console.log(
  `stats: ${postCount} 篇 · ${cjkChars} 字（${wan} 万）· 约 ${minutes} 分钟 → ${OUT_FILE}`,
);
