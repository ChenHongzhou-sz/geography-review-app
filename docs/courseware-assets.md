# 课件 RAR 图片资源分析

## 结论

这两个 `RAR` 包里没有单独暴露出来的 `jpg/png` 图片目录，主要内容是：

- `PPT可自主编辑/*.pptx`
- `全书word/*.doc`
- `目录.pptx`

真正可用于网页 APP 的图片，大多嵌在 `pptx` 的 `ppt/media/*` 里。

## 总体统计

### 上册课件包

- 文件：`C:/Users/chenh/Desktop/《金版学案》七年级  上册  地理（人教版）课件.rar`
- `pptx`：38 个
- `doc`：37 个
- 含内嵌图片的 `pptx`：38 个
- 内嵌媒体总数：559
- 媒体类型：`png 475`、`emf 60`、`tiff 23`、`jpeg 1`

图片最多的几个课件：

1. `8 期末综合测试.pptx`：26
2. `第一章/地球的模型——地球仪.pptx`：26
3. `第二章/地形图的判读.pptx`：23
4. `第一章/经线和经度 纬线和纬度.pptx`：23
5. `第四章/气候的地区差异 世界气候类型的分布.pptx`：20

### 下册课件包

- 文件：`C:/Users/chenh/Desktop/金版学案 同步优学智慧作业 地理 七年级下册（人教版）课件.rar`
- `pptx`：34 个
- `doc`：33 个
- 含内嵌图片的 `pptx`：34 个
- 内嵌媒体总数：425
- 媒体类型：`png 366`、`tiff 35`、`emf 23`、`jpeg 1`

图片最多的几个课件：

1. `第八章/期中综合测试.pptx`：21
2. `第九章/章末总结.pptx`：18
3. `第十一章/期末综合测试.pptx`：17
4. `第七章/章末总结.pptx`：17
5. `第九章/独占一个大陆的国家.pptx`：15
6. `第七章/地形、地势和气候.pptx`：15

## 对 APP 最有价值的课件来源

这些课件尤其适合给地图挑战补图：

1. 亚洲定位
   - `第七章/第1课时 位置、范围和地理分区.pptx`
2. 亚洲地势与气候
   - `第七章/第2课时 地形、地势和气候.pptx`
3. 日本位置图
   - `第八章/第1课时 地理特征与人口老龄化.pptx`
4. 马六甲海峡和“十字路口”
   - `第八章/第3课时 “十字路口”的位置.pptx`
5. 俄罗斯位置图
   - `第八章/第7课时 世界面积最大的国家.pptx`
6. 西亚石油分布
   - `第九章/第2课时 石油资源与水资源.pptx`
7. 澳大利亚位置图
   - `第九章/第7课时 独占一个大陆的国家.pptx`
8. 美国、巴西、极地地区
   - `第十章/第一节 美国.pptx`
   - `第十章/第二节 巴西.pptx`
   - `第十一章/极地地区.pptx`

## 项目内脚本

已加入：

- `scripts/inspect-courseware.ts`
- `scripts/extract-courseware-images.ts`

执行后会生成：

- `src/data/generated/courseware-assets.json`
- `public/images/manifests/courseware-image-manifest.json`
- `public/images/manifests/courseware-focus-paths.json`

命令：

```bash
npm run inspect:courseware
npm run extract:courseware
```

## 当前工作区已完成的抽图

本轮已经执行过一次全量课件抽图。为了适合 GitHub 发布，完整抽图结果已经移出项目目录，归档位于：

- `D:/Codex/geography-review-app1-archive/courseware-full/courseware/top`
- `D:/Codex/geography-review-app1-archive/courseware-full/courseware/bottom`

项目发布版中只保留了实际题库正在引用的运行态图片，位于：

- `public/images/runtime-courseware/top`
- `public/images/runtime-courseware/bottom`

抽取结果概况：

- 上册课件：
  - 含图课件：38 个
  - 网页可直接使用的图片：499 个
  - 仅保留原始格式的 `emf/wmf`：60 个
  - `tiff` 转 `png`：23 个
- 下册课件：
  - 含图课件：34 个
  - 网页可直接使用的图片：402 个
  - 仅保留原始格式的 `emf/wmf`：23 个
  - `tiff` 转 `png`：35 个

也就是说，当前项目里已经有：

- 网页可直接使用图片：901 个
- 原始 `emf/wmf/tiff` 备份：141 个

但这些完整素材已经不再进入 GitHub 发布目录，发布版只保留地图题真正会加载的 `32` 张图片。

## 建议的使用方式

1. 地图题优先从课件 PPT 的内嵌图片里提图，因为通常比教材 PDF 更干净。
2. 教材 PDF 保留为“原始出处”，课件图可以作为更适合手机展示的补充素材。
3. 如果要严格只保留教材/教师书来源，可以继续只用 PDF 抽图；如果你允许课件图进入网页资源库，这两个 `RAR` 的价值会很高。
