# SVG Logo 素材库

一个现代化的 SVG Logo 素材库，支持部署到多个平台。

## 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Framer Motion** - 动画
- **Sonner** - 通知组件
- **JSZip** - 压缩文件

## 功能特性

- 🔍 关键词搜索与分类筛选
- 🌓 深色/浅色主题切换
- 📋 一键复制 SVG 到剪贴板
- ⬇️ 单个/批量下载 SVG
- 🏷️ 支持多选和批量下载
- 📱 响应式设计
- ✨ 流畅的动画效果

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

## 添加新 Logo

### 1. 放置 SVG 文件

将 SVG 文件放入对应分类文件夹：

```
public/library/
  ├── aigc/           # AI 产品
  ├── airline/        # 航空公司
  ├── company/        # 企业组织
  ├── cosmetic/       # 美妆品牌
  ├── goldJewelry/  # 黄金珠宝
  ├── other/        # 其他
  ├── pay/          # 金融支付
  ├── school/       # 大学校徽
  ├── social/       # 社交媒体
  ├── tools/        # 工具产品
  └── weather/      # 气象预警
```

### 2. 扫描 SVG 文件

```bash
pnpm scan:svg
```

### 3. 生成数据文件

```bash
pnpm generate:svg
```

## 部署

### 部署到 Vercel

1. 导入项目到 GitHub
2. 在 Vercel 中导入仓库
3. 自动部署

### 部署到 Cloudflare Pages

1. 创建 Pages 项目
2. 构建命令：`pnpm build`
3. 输出目录：`.next`
4. 部署

### 部署到腾讯 EdgeOne

1. 创建 EdgeOne 站点
2. 配置构建命令：`pnpm build`
3. 部署

## 项目结构

```
svg-logo-library/
├── public/
│   └── library/          # SVG 资源文件
├── scripts/
│   ├── scan-svgs.ts     # 扫描 SVG
│   └── generate-svgs.ts # 生成数据
├── src/
│   ├── app/            # Next.js 页面
│   ├── data/           # 数据文件
│   ├── lib/            # 工具函数
│   └── types/          # 类型定义
├── package.json
└── vercel.json
```

## License

MIT
