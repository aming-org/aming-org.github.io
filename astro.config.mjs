// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 部署地址由环境变量控制，CI 里会从 GitHub Pages 的配置自动推导。
// - 组织页(默认)：https://aming-org.github.io/
// - 自定义域名：设置 SITE=https://your.domain
const SITE = process.env.SITE ?? 'https://aming-org.github.io';
const BASE = process.env.BASE ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'night-owl' },
      wrap: false,
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
