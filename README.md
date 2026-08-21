# 番茄贩卖商

短篇小说站，线上地址 <https://aming-org.github.io>。

**设计风格**：温简主义（Warm Minimalism）× 现代复古（Modern Vintage）。配色取自主题插画的奶油纸、朱红、藏青、青绿与蜜金，标题带套色偏移的复古印刷质感。默认明亮主题，可手动切换暗色。

## 技术栈

| 组成 | 选择 | 说明 |
| --- | --- | --- |
| 框架 | [Astro](https://astro.build) 7 | 纯静态输出，零客户端 JS（除主题切换与目录高亮） |
| 内容 | Markdown + Content Collections | 带类型校验的 frontmatter |
| 样式 | 原生 CSS（自定义属性） | 无 CSS 框架，设计 token 集中在 `src/styles/global.css` |
| 字体 | Fraunces / Inter / JetBrains Mono | 自托管，中文走系统字体回退 |
| 部署 | GitHub Actions → GitHub Pages | 推送即部署 |

## 本地开发

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

其他命令：

```bash
pnpm build      # 构建到 dist/
pnpm preview    # 预览构建产物
pnpm check      # 类型检查
```

## 写一篇新短篇

在 `src/content/posts/` 下新建 `.md` 文件，文件名即 URL：

```markdown
---
title: 作品标题
description: 一段用于 SEO 和列表页的摘要。
pubDate: 2026-08-21
tags: ['短篇']
featured: false         # 首页头条
draft: false            # true 时只在本地可见，不会发布
excerpt: 列表页显示的一行提要，省略则回退到 description
---

正文从这里开始。
```

字段定义在 `src/content.config.ts`，写错会在构建时报错而不是静默失败。

发布流程：提交并推送到 `main`，GitHub Actions 会自动构建部署。

```bash
git add . && git commit -m "post: 作品标题" && git push
```

## 部署地址

仓库名为 `aming-org.github.io`，属于 GitHub 组织页，站点直接落在根路径 <https://aming-org.github.io/>。

`astro.config.mjs` 里的 `site` 和 `base` 由环境变量控制，CI 中自动从 GitHub Pages 的配置推导：

| 场景 | 需要做的事 |
| --- | --- |
| 当前（组织页，根路径） | 无 |
| 绑定自定义域名 | 在 `public/` 下放一个 `CNAME` 文件，内容为域名 |

第一次部署前，在仓库 Settings → Pages 里把 Source 选成 **GitHub Actions**。

## 目录结构

```
src/
├── components/          # Header、作品卡片、目录…
├── content/posts/       # 短篇（Markdown）
├── layouts/             # BaseLayout（站点框架）、PostLayout（作品页）
├── pages/               # 路由：首页、作品、标签、RSS、404
├── styles/global.css    # 设计 token 与全局样式
├── utils/               # 作品查询、日期格式化
└── consts.ts            # 站点标题、导航、作者等配置
```

改站点标题、导航项：编辑 `src/consts.ts`。
改配色、字号、圆角：编辑 `src/styles/global.css` 顶部的 `:root`。
