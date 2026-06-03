# geography-review-app

七年级地理纯选择题复习应用，放在 `D:\Codex\geography-review-app`，按 2022 年版教材目录重整。

## 当前版本

- 固定为纯选择题模式
- 不做图片题
- 范围覆盖七年级上册 + 七年级下册
- 当前题库总量 280 题
- 支持单元练习、课时练习、错题回炉、本册交叉考核、全书综合测试
- 选项顺序和抽题顺序随机
- 本地保存练习进度
- 页面加载时会自动过滤重复题目 `id` 和重复题干

## 目录依据

- `（根据2022年版课程标准修订）义务教育教科书·地理七年级上册.pdf`
- `（根据2022年版课程标准修订）义务教育教科书·地理七年级下册.pdf`

## 文件结构

- `index.html`: 页面结构
- `styles.css`: 视觉样式
- `app.js`: 交互逻辑和本地进度
- `data/review-data.js`: 教材目录、基础题库
- `data/review-data-expanded.js`: 扩展题库
- `data/review-data-refined.js`: 第二轮精修题库
- `manifest.webmanifest`: PWA 清单
- `service-worker.js`: 离线缓存

## 后续可继续补强

- 继续扩题，把每一课的题量再拉高
- 把跨学科主题学习单独扩成专题测试
- 加入按错题频率排序的强化模式
