# GeoMemory

GeoMemory 是一个面向七年级学生的地理记忆训练 Web App。它不是 PDF 阅读器，也不是传统题库，而是一个围绕“快速开练、间隔复习、地图强化、错题回炉”设计的移动优先学习系统。

## 当前已完成

- React + TypeScript + Vite 项目骨架
- TailwindCSS + 手工接入的 Shadcn 风格组件
- 5 个核心页面：
  - 首页
  - 智能训练
  - 地图挑战
  - 错题本
  - 考前冲刺
- LocalStorage 学习进度保存
- 间隔复习算法与掌握度等级
- 已扩充的七年级地理知识点数据
- 已接入真实原图的地图挑战题数据
- PDF 结构抽取、图片抽取、题库生成脚本
- GitHub Pages 自动部署工作流
- PWA 基础支持，可添加到手机/iPad 主屏幕
- 课件 RAR 资源分析脚本

## 技术栈

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Framer Motion
- Shadcn 风格 UI 组件

## 目录结构

```text
src/
├── components/
├── data/
├── hooks/
├── images/
├── pages/
├── types/
├── utils/
└── App.tsx

public/
└── images/

scripts/
├── extract-images.ts
├── extract-knowledge.ts
├── generate-questions.ts
├── inspect-courseware.ts
└── review-algorithm.ts
```

## 安装与运行

先确认本机有可用的 Node.js 与 npm，然后在项目目录执行：

```bash
npm install
npm run dev
```

默认开发端口在 `4173`。

## GitHub 发布

项目已经加入：

- 相对路径构建配置，适配 GitHub Pages 子路径
- `HashRouter`
- `.github/workflows/deploy-pages.yml`
- `manifest.webmanifest`
- `service worker`

发布步骤：

1. 把整个 `D:/Codex/geography-review-app1` 初始化为 Git 仓库并推到 GitHub。
2. 默认分支使用 `main`。
3. 推送后，GitHub Actions 会自动构建并部署到 GitHub Pages。
4. 在仓库设置里确认 `Pages` 使用 `GitHub Actions` 作为来源。

部署完成后，手机和 iPad 直接打开 Pages 链接即可使用；在 iPhone / iPad Safari 中还可以“添加到主屏幕”。

当前这份项目已经整理成轻量发布版：

- GitHub 仓库内只保留网页运行真正需要的代码和图片
- 地图题实际使用的图片位于 `public/images/runtime-courseware/`
- 完整课件抽图素材库已隔离到 `D:/Codex/geography-review-app1-archive/`
- 不需要把归档目录上传到 GitHub

## 数据与脚本

### 1. 抽取 PDF 结构

```bash
npm run extract:knowledge
```

输出：

- `src/data/generated/pdf-structure.json`

### 2. 抽取原始教材图片

```bash
npm run extract:images
```

输出：

- `public/images/**`
- `public/images/manifests/image-manifest.json`

### 3. 生成题库 JSON

```bash
npm run generate:questions
```

输出：

- `src/data/generated/questions.json`

### 4. 分析课件 RAR 内嵌图片

```bash
npm run inspect:courseware
```

输出：

- `src/data/generated/courseware-assets.json`

## 已接入的教材来源

- 七上教材
- 七下教材
- 七上教师用书
- 七下教师用书

其中：

- 七上教材、七下教材目录文本可直接抽取
- 七上教师用书目录文本可直接抽取
- 七下教师用书当前判断为图片型 PDF，适合先抽图，再根据需要追加 OCR

详细分析见：

- `docs/pdf-analysis.md`
- `docs/courseware-assets.md`

## 当前版本说明

- 首页和训练流已经能用演示进度直接体验完整交互
- 当前知识卡片共 `149` 条
- 当前地图挑战共 `44` 组
- 地图题已经直接接入真实课件/教材原图，不再使用 AI 生成地图
- 教材目录中的 `30/30` 个主小节现在都已经有题目覆盖
- 训练流会基于最近做题历史避开短期重复，并尽量打散章节
- 发布版只保留 `public/images/runtime-courseware/` 中的 `32` 张运行态图片
- 完整课件抽图素材库与全量清单已归档到 `D:/Codex/geography-review-app1-archive/`

## 注意事项

- 当前地图训练实际使用的图片，来自教材 PDF 抽图或课件 `RAR` 内嵌图片抽取
- 不要放 AI 生成地图、网络下载地图或手工重绘地图
- `public/app-icon.svg` 与 `public/favicon.svg` 是代码绘制的应用图标，不属于训练配图
- 本项目使用 `HashRouter`，方便后续离线部署与本地文件预览

图片来源说明见：

- `docs/courseware-assets.md`
- `docs/active-image-sources.md`
- `docs/size-optimization.md`

## 本次实现的环境限制

当前 Codex 会话里无法直接执行 `node/npm`，所以这次提交主要完成了源码搭建、数据结构、脚本方案和 PDF 分析，尚未在本机会话中跑通 `npm install` 和 `vite build`。如果你的本机 Node 环境正常，按上面的命令即可继续验证。
