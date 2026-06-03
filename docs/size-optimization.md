# 体积分析与瘦身建议

更新时间：2026-06-03

## 当前体积

- 当前项目目录约 `20.2MB`
- `public/` 约 `3.43MB`
- `public/images/runtime-courseware/` 约 `3.41MB`
- 发布版实际引用的 `32` 张唯一图片合计约 `3.41MB`
- 完整课件图库已隔离到 `D:/Codex/geography-review-app1-archive/`，约 `186.8MB`

## 为什么会这么大

最初项目变大的原因是同时保留了两类内容：

1. 网页运行真正需要的素材
2. 为后续继续扩题而保留的整套课件抽图素材库

其中最大的不是代码，也不是网页框架，而是整套课件图像资源：

- `899` 张 `png`，约 `124.0MB`
- `83` 个 `emf` 原始文件，约 `59.2MB`
- `58` 个 `tiff` 原始文件，约 `2.7MB`

另外本地还有两类临时产物需要区分：

- `.edge-preview-profile/` 约 `16.5MB`
- `preview-overview.png` 已移到 `D:/Codex/geography-review-app1-archive/preview-artifacts/`

## 结论

如果只看“网页 APP 正常运行”这一件事，现在最核心的地图资源只需要约 `3.4MB`。

也就是说，网页发布本身并不大，主要是完整课件素材库曾经和发布版混在一起。

现在已经完成的精简动作是：

- 把整套课件图库移到 `D:/Codex/geography-review-app1-archive/`
- 在仓库里只保留 `public/images/runtime-courseware/`
- 生成轻量清单 `public/images/manifests/runtime-courseware-assets.json`
- 用 `.gitignore` 排除全量课件目录和全量清单

如果只看 GitHub 仓库里真正需要上传的网页资源，核心静态内容已经压到约 `3.4MB` 级别。

## 发布建议

适合上传 GitHub 并部署为 Web App 的做法是：

1. 保留 `src/`、`public/manifest.webmanifest`、`public/sw.js`、图标、样式、题库数据。
2. 地图训练只保留 `public/images/runtime-courseware/` 中的运行态图片。
3. 整套课件抽图结果单独放在 `D:/Codex/geography-review-app1-archive/`。
4. `emf`、`tiff` 这类原始备份不要进入线上站点。
5. `.edge-preview-profile/` 和 `preview-overview.png` 继续保持不提交。

## 体积优化优先级

按收益从高到低排序：

1. 保持 `public/images/courseware/` 不进入仓库，只保留 `runtime-courseware/`。
2. 继续不要把 `_raw/` 原始备份目录带回项目发布目录。
3. 需要继续瘦身时，再清理本地预览缓存目录。
4. 如仍需继续压缩，再把保留的地图图像转成更轻的格式，例如 `webp`。

## 我建议的下一步

如果目标是上传到 GitHub Pages 并长期在手机、iPad 上使用，当前最合适的结构就是两层：

- `app`：只保留网页运行需要的代码和当前题库实际引用图片
- `archive`：保留完整课件抽图结果，供以后继续扩题时使用

这样发布仓库会明显变小，页面加载速度也会更好。
