# GeoMemory

GeoMemory 是一个面向七年级学生的地理训练 Web App。当前仓库已经切换到“单元训练中心”结构，所有训练、地图挑战、错题本和复习逻辑都围绕单元数据工作。

## 当前状态

- 主 UI 已完成重构：
  - 首页 Dashboard
  - 单元列表 Units
  - 单元详情 Unit Detail
  - 单元训练 Training
  - 地图挑战 Map Challenge
  - 错题本 Mistakes
  - 今日复习 Review
  - 单元闯关 Sprint
- 当前已接入并可训练的单元：
  - 七年级下册 第七章《我们生活的大洲——亚洲》
- 学习记录保存在浏览器 `LocalStorage`
- 已支持 GitHub Pages 自动部署
- 已支持基础 PWA 与离线缓存

## 技术栈

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion

## 项目结构

```text
src/
├── components/
├── data/
│   └── units/
│       ├── geo-7b-chapter7-asia.json
│       └── geo-7b-chapter7-asia/
│           ├── knowledge.json
│           ├── questions.json
│           └── maps.json
├── hooks/
├── pages/
├── types/
├── utils/
├── App.tsx
└── main.tsx

public/
├── 404.html
├── manifest.webmanifest
├── sw.js
└── images/
    ├── 七下/第七章/
    └── runtime-courseware/

.github/workflows/
└── deploy.yml
```

## 单元数据

当前训练系统以单元 JSON 为核心。主数据文件位于：

- `src/data/units/geo-7b-chapter7-asia.json`

为了方便继续校题和维护，也保留了拆分数据：

- `src/data/units/geo-7b-chapter7-asia/knowledge.json`
- `src/data/units/geo-7b-chapter7-asia/questions.json`
- `src/data/units/geo-7b-chapter7-asia/maps.json`

后续新增章节时，优先沿用相同结构继续扩展，不再回到旧的全局题库模式。

## 图片资源

亚洲单元当前实际使用的稳定图片位于：

- `public/images/七下/第七章/asia-location.png`
- `public/images/七下/第七章/asia-regions.png`
- `public/images/七下/第七章/asia-terrain-climate.png`

`public/images/runtime-courseware/` 主要保留课件抽图素材，用于后续章节扩展和素材追溯。

## 开发与运行

```bash
npm install
npm run dev
```

构建命令：

```bash
npm run build
```

## GitHub Pages

项目当前使用：

- `BrowserRouter`
- Vite `base` 配置
- `public/404.html` 做 SPA 回跳
- `.github/workflows/deploy.yml` 自动发布

每次推送到 `main` 分支后，GitHub Actions 会自动构建并部署到 GitHub Pages。

## 素材与分析脚本

仍保留的脚本主要用于原始资料分析和图片抽取：

- `npm run extract:images`
- `npm run extract:courseware`
- `npm run extract:knowledge`
- `npm run inspect:courseware`

这些脚本用于整理教材或课件资料，不参与网页运行时逻辑。

## 说明

仓库里原先那套旧 UI 数据源和旧亚洲题库生成脚本已经移除，当前 GitHub 上保留的就是这套新的单元化训练架构。
