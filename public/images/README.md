# 图片目录说明

本目录当前存放的是“发布版真正需要的图片”，重点是实际题库会加载的运行态素材。

其中最重要的是：

1. `runtime-courseware/`
   - 地图题当前真实使用的课件原图
   - 已精简为题库实际引用的运行态图片
2. `manifests/runtime-courseware-assets.json`
   - 当前发布版正在使用的图片清单

完整课件图库与全量清单已经移到：

- `D:/Codex/geography-review-app1-archive/`

禁止放入：

- AI 生成地图
- 网络下载地图
- 手工重绘图

推荐目录：

```text
public/images/
├── runtime-courseware/
└── manifests/
```

如果你后续重新抽取整套课件图：

- `public/images/courseware/` 会被重新生成
- 这些全量抽图目录默认不应进入 GitHub 发布仓库
- 当前 `.gitignore` 已经把这类全量课件目录和清单排除掉
