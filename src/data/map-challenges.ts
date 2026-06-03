import type { MapChallenge, SprintPreset } from "../types";

export const mapChallenges: MapChallenge[] = [
  {
    id: "map-asia-location",
    title: "亚洲定位",
    book: "七下",
    chapter: "第七章 我们生活的大洲——亚洲",
    section: "自然环境",
    type: "click",
    prompt: "请在教材原图中找出亚洲所在的大洲位置。",
    correctAnswer: "亚洲位于亚欧大陆东部、太平洋西岸",
    explanation: "先判断海陆轮廓，再结合东临太平洋和北临北冰洋定位亚洲。",
    sourceLabel: "七下教材",
    sourcePage: 3,
    assetPath:
      "/images/runtime-courseware/bottom/001 1 第七章 我们生活的大洲——亚洲 - 1 第一节 第1课时 位置、范围和地理分区/img-011.png",
    extractionNote:
      "建议优先从七下课件“第七章/第1课时 位置、范围和地理分区.pptx”提取内嵌地图，其次再从七下教材目录后半球图提取。",
    knowledgePointIds: ["geo-bottom-001", "geo-bottom-002"]
  },
  {
    id: "map-pacific-east-of-asia",
    title: "亚洲东临海洋",
    book: "七下",
    chapter: "第七章 我们生活的大洲——亚洲",
    section: "自然环境",
    type: "select",
    prompt: "亚洲东临什么洋？",
    options: ["北冰洋", "大西洋", "太平洋", "印度洋"],
    correctAnswer: "太平洋",
    explanation: "亚洲东临太平洋，南临印度洋，北临北冰洋。",
    sourceLabel: "七下教材",
    sourcePage: 5,
    assetPath:
      "/images/runtime-courseware/bottom/001 1 第七章 我们生活的大洲——亚洲 - 1 第一节 第1课时 位置、范围和地理分区/img-011.png",
    extractionNote:
      "优先从七下课件“第七章/第1课时 位置、范围和地理分区.pptx”提取亚洲位置图。",
    knowledgePointIds: ["geo-bottom-001"]
  },
  {
    id: "map-japan-location",
    title: "日本列岛识别",
    book: "七下",
    chapter: "第八章 我们邻近的地区和国家",
    section: "日本",
    type: "region",
    prompt: "请找出日本列岛在东亚海域中的位置。",
    correctAnswer: "亚洲东部、太平洋西北部的群岛国家",
    explanation: "从朝鲜半岛以东、俄罗斯远东以南的岛链位置判断日本。",
    sourceLabel: "七下教材",
    sourcePage: 20,
    assetPath:
      "/images/runtime-courseware/bottom/009 2 第八章 我们邻近的地区和国家 - 2 第一节 第2课时 对外依赖强的经济/img-011.png",
    extractionNote:
      "建议优先使用七下课件“第八章/第2课时 对外依赖强的经济.pptx”中的日本列岛示意图。",
    knowledgePointIds: ["geo-bottom-003", "geo-bottom-004"]
  },
  {
    id: "map-malacca-strait",
    title: "马六甲海峡",
    book: "七下",
    chapter: "第八章 我们邻近的地区和国家",
    section: "东南亚",
    type: "click",
    prompt: "请在地图上指出马六甲海峡。",
    correctAnswer: "位于马来半岛和苏门答腊岛之间",
    explanation: "它沟通太平洋与印度洋，是东南亚的关键航运咽喉。",
    sourceLabel: "七下教材",
    sourcePage: 32,
    assetPath:
      "/images/runtime-courseware/bottom/010 2 第八章 我们邻近的地区和国家 - 3 第二节 第1课时 “十字路口”的位置/img-006.png",
    extractionNote:
      "优先从七下课件“第八章/第3课时 十字路口的位置.pptx”提取马六甲海峡相关地图。",
    knowledgePointIds: ["geo-bottom-005", "geo-bottom-006"]
  },
  {
    id: "map-india-location",
    title: "印度半岛识别",
    book: "七下",
    chapter: "第八章 我们邻近的地区和国家",
    section: "印度",
    type: "region",
    prompt: "请找出伸入印度洋的大三角形半岛。",
    correctAnswer: "印度半岛",
    explanation: "印度位于南亚，半岛向南突出到印度洋中。",
    sourceLabel: "七下教材",
    sourcePage: 38,
    assetPath:
      "/images/runtime-courseware/bottom/012 2 第八章 我们邻近的地区和国家 - 5 第三节 第1课时 世界人口大国/img-010.png",
    extractionNote:
      "优先从七下课件“第八章/第5课时 世界人口大国.pptx”提取印度位置图。",
    knowledgePointIds: ["geo-bottom-007"]
  },
  {
    id: "map-russia-across-continents",
    title: "俄罗斯跨洲识别",
    book: "七下",
    chapter: "第八章 我们邻近的地区和国家",
    section: "俄罗斯",
    type: "select",
    prompt: "俄罗斯地跨哪两个大洲？",
    options: ["欧洲和非洲", "欧洲和亚洲", "亚洲和北美洲", "亚洲和大洋洲"],
    correctAnswer: "欧洲和亚洲",
    explanation: "俄罗斯横跨欧亚大陆北部，是世界面积最大的国家。",
    sourceLabel: "七下教材",
    sourcePage: 47,
    assetPath:
      "/images/runtime-courseware/bottom/014 2 第八章 我们邻近的地区和国家 - 7 第四节 第1课时 世界面积最大的国家/img-006.png",
    extractionNote:
      "优先从七下课件“第八章/第7课时 世界面积最大的国家.pptx”提取俄罗斯位置图。",
    knowledgePointIds: ["geo-bottom-008", "geo-bottom-009"]
  },
  {
    id: "map-west-asia-oil",
    title: "西亚石油区",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "西亚",
    type: "click",
    prompt: "请在地图上找出波斯湾及其沿岸主要产油地区。",
    correctAnswer: "波斯湾沿岸地区",
    explanation: "西亚石油主要分布在波斯湾及其沿岸国家。",
    sourceLabel: "七下教材",
    sourcePage: 60,
    assetPath:
      "/images/runtime-courseware/bottom/019 3 第九章 东半球其他的地区和国家 - 2 第一节 第2课时 石油资源与水资源/img-008.png",
    extractionNote:
      "优先从七下课件“第九章/第2课时 石油资源与水资源.pptx”提取西亚石油分布图。",
    knowledgePointIds: ["geo-bottom-010", "geo-bottom-011"]
  },
  {
    id: "map-australia-location",
    title: "澳大利亚定位",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "澳大利亚",
    type: "region",
    prompt: "请找出独占整个大陆的国家。",
    correctAnswer: "澳大利亚",
    explanation: "澳大利亚位于南半球，四面环海，独占澳大利亚大陆。",
    sourceLabel: "七下教材",
    sourcePage: 83,
    assetPath:
      "/images/runtime-courseware/bottom/024 3 第九章 东半球其他的地区和国家 - 7 第四节 第1课时 独占一个大陆的国家/img-011.png",
    extractionNote:
      "优先从七下课件“第九章/第7课时 独占一个大陆的国家.pptx”提取澳大利亚位置图。",
    knowledgePointIds: ["geo-bottom-016"]
  },
  {
    id: "map-west-asia-desert-climate",
    title: "西亚气候分布",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "西亚",
    type: "region",
    prompt: "请找出热带沙漠气候分布最广的阿拉伯半岛区域。",
    correctAnswer: "阿拉伯半岛",
    explanation: "西亚降水稀少，阿拉伯半岛大部分属于热带沙漠气候，是本区干旱环境最典型的代表。",
    sourceLabel: "七下教材",
    sourcePage: 58,
    assetPath:
      "/images/runtime-courseware/bottom/017 3 第九章 东半球其他的地区和国家 - 1 第一节 第1课时 “三洲五海”之地/img-010.png",
    extractionNote:
      "优先从七下课件“第九章/第1课时 三洲五海之地.pptx”提取西亚气候分布图。",
    knowledgePointIds: ["geo-bottom-010", "geo-bottom-011"]
  },
  {
    id: "map-europe-west-relief",
    title: "欧洲西部地形识别",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "欧洲西部",
    type: "click",
    prompt: "请在地图上找出阿尔卑斯山脉所在的大致位置。",
    correctAnswer: "欧洲南部的阿尔卑斯山脉地区",
    explanation: "阿尔卑斯山脉横贯欧洲南部，是欧洲西部旅游业和滑雪资源非常集中的山地地带。",
    sourceLabel: "七下教材",
    sourcePage: 67,
    assetPath:
      "/images/runtime-courseware/bottom/020 3 第九章 东半球其他的地区和国家 - 3 第二节 第1课时 发达国家集中的地区/img-011.png",
    extractionNote:
      "优先从七下课件“第九章/第3课时 发达国家集中的地区.pptx”提取欧洲西部地形图。",
    knowledgePointIds: ["geo-bottom-012", "geo-bottom-013"]
  },
  {
    id: "map-europe-west-scandinavia",
    title: "北欧位置识别",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "欧洲西部",
    type: "region",
    prompt: "请找出位于欧洲北部、接近北极圈的斯堪的纳维亚半岛。",
    correctAnswer: "斯堪的纳维亚半岛",
    explanation: "斯堪的纳维亚半岛位于欧洲北部，北端接近北极圈，是识别欧洲西部范围的重要参照。",
    sourceLabel: "七下教材",
    sourcePage: 67,
    assetPath:
      "/images/runtime-courseware/bottom/020 3 第九章 东半球其他的地区和国家 - 3 第二节 第1课时 发达国家集中的地区/img-010.png",
    extractionNote:
      "优先从七下课件“第九章/第3课时 发达国家集中的地区.pptx”提取北欧区域图。",
    knowledgePointIds: ["geo-bottom-012"]
  },
  {
    id: "map-africa-east-highlands",
    title: "东非高原识别",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "撒哈拉以南非洲",
    type: "region",
    prompt: "请找出东非高原的大致位置。",
    correctAnswer: "非洲东部赤道附近的高原地区",
    explanation: "东非高原位于非洲东部，地势较高，附近还有乞力马扎罗山等典型地形，是非洲地形题的高频考点。",
    sourceLabel: "七下教材",
    sourcePage: 76,
    assetPath:
      "/images/runtime-courseware/bottom/022 3 第九章 东半球其他的地区和国家 - 5 第三节 第1课时 热带草原广布/img-010.png",
    extractionNote:
      "优先从七下课件“第九章/第5课时 热带草原广布.pptx”提取非洲地形图。",
    knowledgePointIds: ["geo-bottom-014", "geo-bottom-015"]
  },
  {
    id: "map-usa-great-plains",
    title: "美国大平原定位",
    book: "七下",
    chapter: "第十章 西半球的国家",
    section: "美国",
    type: "click",
    prompt: "请在地图上找出美国中部的大平原地区。",
    correctAnswer: "美国中部的大平原",
    explanation: "大平原位于美国中部，是美国农业专业化分区的重要空间基础，也是识别美国地形格局的关键区域。",
    sourceLabel: "七下教材",
    sourcePage: 93,
    assetPath:
      "/images/runtime-courseware/bottom/027 4 第十章 西半球的国家 - 1 第一节 美 国/img-011.png",
    extractionNote:
      "优先从七下课件“第十章/第1课时 美国.pptx”提取美国地形图。",
    knowledgePointIds: ["geo-bottom-017", "geo-bottom-018"]
  },
  {
    id: "map-brazil-amazon-basin",
    title: "亚马孙平原识别",
    book: "七下",
    chapter: "第十章 西半球的国家",
    section: "巴西",
    type: "region",
    prompt: "请找出位于巴西北部、接近赤道的亚马孙平原。",
    correctAnswer: "巴西北部的亚马孙平原",
    explanation: "亚马孙平原位于巴西北部，热带雨林广布，是巴西自然环境和生态保护的核心区域。",
    sourceLabel: "七下教材",
    sourcePage: 100,
    assetPath:
      "/images/runtime-courseware/bottom/028 4 第十章 西半球的国家 - 2 第二节 巴 西/img-007.png",
    extractionNote:
      "优先从七下课件“第十章/第2课时 巴西.pptx”提取巴西自然与资源分布图。",
    knowledgePointIds: ["geo-bottom-019", "geo-bottom-020"]
  },
  {
    id: "map-brazil-southeast-coast",
    title: "巴西东南沿海识别",
    book: "七下",
    chapter: "第十章 西半球的国家",
    section: "巴西",
    type: "region",
    prompt: "请找出巴西人口和城市最集中的东南沿海地区。",
    correctAnswer: "巴西东南沿海地区",
    explanation: "巴西人口、城市和工业主要集中在东南沿海，那里开发较早、交通便利，经济活动最密集。",
    sourceLabel: "七下教材",
    sourcePage: 100,
    assetPath:
      "/images/runtime-courseware/bottom/028 4 第十章 西半球的国家 - 2 第二节 巴 西/img-007.png",
    extractionNote:
      "优先从七下课件“第十章/第2课时 巴西.pptx”提取巴西区域分布图。",
    knowledgePointIds: ["geo-bottom-019"]
  },
  {
    id: "map-antarctica-stations",
    title: "南极科考站识别",
    book: "七下",
    chapter: "第十一章 极地地区",
    section: "极地地区",
    type: "click",
    prompt: "请找出我国南极科考站中的昆仑站或泰山站所在区域。",
    correctAnswer: "南极内陆高海拔地区的我国科考站分布区",
    explanation: "昆仑站和泰山站都位于南极内陆，是我国极地科考的重要站点，常结合等高线和方位图考查。",
    sourceLabel: "七下教材",
    sourcePage: 110,
    assetPath:
      "/images/runtime-courseware/bottom/031 5 第十一章 极地地区 - 1 第十一章 极地地区/img-011.png",
    extractionNote:
      "优先从七下课件“第十一章/极地地区.pptx”提取南极科考站分布图。",
    knowledgePointIds: ["geo-bottom-021", "geo-bottom-022"]
  },
  {
    id: "map-antarctica-south-pole",
    title: "南极点定位",
    book: "七下",
    chapter: "第十一章 极地地区",
    section: "极地地区",
    type: "region",
    prompt: "请在极地图上找出南极点所在的中心位置。",
    correctAnswer: "南极点位于极地图中心",
    explanation: "南极点位于南极俯视图的中心位置，识别极点和经线辐射方向是极地区域判读的基础。",
    sourceLabel: "七下教材",
    sourcePage: 109,
    assetPath:
      "/images/runtime-courseware/bottom/031 5 第十一章 极地地区 - 1 第十一章 极地地区/img-012.png",
    extractionNote:
      "优先从七下课件“第十一章/极地地区.pptx”提取极地图。",
    knowledgePointIds: ["geo-bottom-021"]
  },
  {
    id: "map-graticule-point-hemispheres",
    title: "经纬网定位",
    book: "七上",
    chapter: "第一章 地球",
    section: "利用经纬网定位",
    type: "select",
    prompt: "图中黑点所在位置属于哪组半球？",
    options: ["北半球、东半球", "北半球、西半球", "南半球、东半球", "南半球、西半球"],
    correctAnswer: "北半球、东半球",
    explanation: "黑点约在 30°N、30°E，位于赤道以北、本初子午线以东，所以属于北半球和东半球。",
    sourceLabel: "七上课件",
    sourcePage: 19,
    assetPath:
      "/images/runtime-courseware/top/004 1 第一章 地球 - 4 第二节 第3课时 利用经纬网定位/img-014.png",
    extractionNote:
      "优先从七上课件“第一章/第4课时 利用经纬网定位.pptx”提取经纬网判读图。",
    knowledgePointIds: ["geo-top-019"]
  },
  {
    id: "map-largest-continent-world",
    title: "最大大洲识别",
    book: "七上",
    chapter: "第三章 陆地和海洋",
    section: "大洲和大洋",
    type: "region",
    prompt: "请找出图中面积最大的大洲。",
    correctAnswer: "亚洲",
    explanation: "亚洲面积最大，位于亚欧大陆东部，是七大洲中面积最大的一个。",
    sourceLabel: "七上课件",
    sourcePage: 44,
    assetPath:
      "/images/runtime-courseware/top/015 3 第三章 陆地和海洋 - 1 第一节 大洲和大洋/img-006.png",
    extractionNote:
      "优先从七上课件“第三章/第一节 大洲和大洋.pptx”提取七大洲四大洋示意图。",
    knowledgePointIds: ["geo-top-009"]
  },
  {
    id: "map-pacific-ocean-world",
    title: "太平洋判读",
    book: "七上",
    chapter: "第三章 陆地和海洋",
    section: "大洲和大洋",
    type: "select",
    prompt: "图中被亚洲、大洋洲和美洲环抱的是哪一大洋？",
    options: ["大西洋", "印度洋", "太平洋", "北冰洋"],
    correctAnswer: "太平洋",
    explanation: "太平洋位于亚洲、大洋洲和南北美洲之间，是世界面积最大的大洋。",
    sourceLabel: "七上课件",
    sourcePage: 45,
    assetPath:
      "/images/runtime-courseware/top/015 3 第三章 陆地和海洋 - 1 第一节 大洲和大洋/img-006.png",
    extractionNote:
      "优先从七上课件“第三章/第一节 大洲和大洋.pptx”提取世界大洲大洋分布图。",
    knowledgePointIds: ["geo-top-010"]
  },
  {
    id: "map-tropic-of-cancer-world",
    title: "北回归线判读",
    book: "七上",
    chapter: "第一章 地球",
    section: "地球与地球仪",
    type: "click",
    prompt: "请指出图中穿过我国南部的特殊纬线。",
    correctAnswer: "北回归线",
    explanation: "北回归线约在北纬 23.5°，穿过我国南部，是判断热带和北温带分界的重要纬线。",
    sourceLabel: "七上课件",
    sourcePage: 18,
    assetPath:
      "/images/runtime-courseware/top/015 3 第三章 陆地和海洋 - 1 第一节 大洲和大洋/img-011.png",
    extractionNote:
      "优先从七上课件“第三章/第一节 大洲和大洋.pptx”提取含特殊纬线的世界图。",
    knowledgePointIds: ["geo-top-020"]
  },
  {
    id: "map-mediterranean-climate-world",
    title: "地中海气候分布",
    book: "七上",
    chapter: "第四章 天气与气候",
    section: "世界的气候",
    type: "select",
    prompt: "图中甲、乙、丙所指的分布区，最能代表哪种气候类型？",
    options: ["热带雨林气候", "热带沙漠气候", "地中海气候", "温带海洋性气候"],
    correctAnswer: "地中海气候",
    explanation: "这些地区都位于南北纬 30°—40°大陆西岸，夏季炎热干燥，冬季温和多雨，是地中海气候的典型分布区。",
    sourceLabel: "七上课件",
    sourcePage: 87,
    assetPath:
      "/images/runtime-courseware/top/027 4 第四章 天气与气候 - 7 第四节 第1课时 气候的地区差异 世界气候类型的分布/img-016.png",
    extractionNote:
      "优先从七上课件“第四章/第7课时 气候的地区差异 世界气候类型的分布.pptx”提取世界气候分布图。",
    knowledgePointIds: ["geo-top-021"]
  },
  {
    id: "map-asia-tropic-of-cancer",
    title: "亚洲北回归线",
    book: "七下",
    chapter: "第七章 我们生活的大洲——亚洲",
    section: "自然环境",
    type: "click",
    prompt: "请指出图中穿过亚洲南部的虚线特殊纬线。",
    correctAnswer: "北回归线",
    explanation: "北回归线穿过亚洲南部，是判断亚洲纬度位置和气候分异的重要参照。",
    sourceLabel: "七下课件",
    sourcePage: 8,
    assetPath:
      "/images/runtime-courseware/bottom/002 1 第七章 我们生活的大洲——亚洲 - 2 第一节 第2课时 地形、地势和气候/img-011.png",
    extractionNote:
      "优先从七下课件“第七章/第2课时 地形、地势和气候.pptx”提取亚洲河流与特殊纬线图。",
    knowledgePointIds: ["geo-bottom-023"]
  },
  {
    id: "map-asia-rivers-to-arctic",
    title: "亚洲北流河流",
    book: "七下",
    chapter: "第七章 我们生活的大洲——亚洲",
    section: "自然环境",
    type: "select",
    prompt: "图中的鄂毕河、叶尼塞河和勒拿河大体注入哪一大洋？",
    options: ["太平洋", "印度洋", "北冰洋", "大西洋"],
    correctAnswer: "北冰洋",
    explanation: "鄂毕河、叶尼塞河和勒拿河都流向亚洲北部的北冰洋，反映出亚洲中部高、四周低的地势特征。",
    sourceLabel: "七下课件",
    sourcePage: 8,
    assetPath:
      "/images/runtime-courseware/bottom/002 1 第七章 我们生活的大洲——亚洲 - 2 第一节 第2课时 地形、地势和气候/img-011.png",
    extractionNote:
      "优先从七下课件“第七章/第2课时 地形、地势和气候.pptx”提取亚洲河流分布图。",
    knowledgePointIds: ["geo-bottom-002"]
  },
  {
    id: "map-japan-pacific-belt",
    title: "日本沿海工业带",
    book: "七下",
    chapter: "第八章 我们邻近的地区和国家",
    section: "日本",
    type: "select",
    prompt: "东京和横滨所在的沿海地带，属于日本哪一条工业带的核心区域？",
    options: ["日本海沿岸工业带", "北海道工业带", "太平洋沿岸工业带", "九州内陆工业带"],
    correctAnswer: "太平洋沿岸工业带",
    explanation: "日本工业主要集中在太平洋沿岸和濑户内海沿岸，这里港口条件好，便于进口原料和出口工业制成品。",
    sourceLabel: "七下课件",
    sourcePage: 27,
    assetPath:
      "/images/runtime-courseware/bottom/006 2 第八章 我们邻近的地区和国家 - 1 第一节 第1课时 地理特征与人口老龄化/img-007.png",
    extractionNote:
      "优先从七下课件“第八章/第1课时 地理特征与人口老龄化.pptx”提取日本城市与港口分布图。",
    knowledgePointIds: ["geo-bottom-004", "geo-bottom-024"]
  },
  {
    id: "map-australia-desert-climate",
    title: "澳大利亚沙漠气候",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "澳大利亚",
    type: "select",
    prompt: "图中澳大利亚中西部广布的气候类型是什么？",
    options: ["热带雨林气候", "热带沙漠气候", "温带海洋性气候", "地中海气候"],
    correctAnswer: "热带沙漠气候",
    explanation: "澳大利亚中西部受副热带高气压带控制，气候干热少雨，因此热带沙漠气候分布最广。",
    sourceLabel: "七下课件",
    sourcePage: 84,
    assetPath:
      "/images/runtime-courseware/bottom/024 3 第九章 东半球其他的地区和国家 - 7 第四节 第1课时 独占一个大陆的国家/img-010.png",
    extractionNote:
      "优先从七下课件“第九章/第7课时 独占一个大陆的国家.pptx”提取澳大利亚气候与资源分布图。",
    knowledgePointIds: ["geo-bottom-016", "geo-bottom-025"]
  },
  {
    id: "map-australia-tropic-of-capricorn",
    title: "澳大利亚南回归线",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "澳大利亚",
    type: "click",
    prompt: "请指出图中横穿澳大利亚中部的特殊纬线。",
    correctAnswer: "南回归线",
    explanation: "南回归线穿过澳大利亚中部，是判断其热带、亚热带和沙漠气候分布的重要线索。",
    sourceLabel: "七下课件",
    sourcePage: 84,
    assetPath:
      "/images/runtime-courseware/bottom/024 3 第九章 东半球其他的地区和国家 - 7 第四节 第1课时 独占一个大陆的国家/img-010.png",
    extractionNote:
      "优先从七下课件“第九章/第7课时 独占一个大陆的国家.pptx”提取澳大利亚纬线与气候图。",
    knowledgePointIds: ["geo-bottom-025"]
  },
  {
    id: "map-asia-east-asia-region",
    title: "东亚区域识别",
    book: "七下",
    chapter: "第七章 我们生活的大洲——亚洲",
    section: "人文环境",
    type: "region",
    prompt: "请在亚洲分区图中找出东亚所在的区域。",
    correctAnswer: "中国、朝鲜半岛和日本群岛一带的东亚地区",
    explanation: "东亚位于亚洲东部，临太平洋西岸，是亚洲人口最稠密、经济最活跃的区域之一。",
    sourceLabel: "七下课件",
    sourcePage: 16,
    assetPath:
      "/images/runtime-courseware/bottom/003 1 第七章 我们生活的大洲——亚洲 - 3 第二节 人文环境/img-009.png",
    extractionNote:
      "优先从七下课件“第七章/第二节 人文环境.pptx”提取亚洲分区与人口分布图。",
    knowledgePointIds: ["geo-bottom-028", "geo-bottom-029"]
  },
  {
    id: "map-asia-south-asia-region",
    title: "南亚区域识别",
    book: "七下",
    chapter: "第七章 我们生活的大洲——亚洲",
    section: "人文环境",
    type: "region",
    prompt: "请在图中找出以印度半岛为主体的南亚地区。",
    correctAnswer: "喜马拉雅山脉以南、印度洋以北的南亚地区",
    explanation: "南亚位于亚洲南部，人口稠密，季风气候影响显著，是亚洲重要的人文地理单元。",
    sourceLabel: "七下课件",
    sourcePage: 16,
    assetPath:
      "/images/runtime-courseware/bottom/003 1 第七章 我们生活的大洲——亚洲 - 3 第二节 人文环境/img-009.png",
    extractionNote:
      "优先从七下课件“第七章/第二节 人文环境.pptx”提取亚洲分区与人口分布图。",
    knowledgePointIds: ["geo-bottom-029", "geo-bottom-030"]
  },
  {
    id: "map-southeast-asia-indochina",
    title: "中南半岛识别",
    book: "七下",
    chapter: "第八章 我们邻近的地区和国家",
    section: "东南亚",
    type: "region",
    prompt: "请在图中找出山河相间、纵列分布明显的中南半岛。",
    correctAnswer: "位于中国以南、泰国湾和安达曼海之间的中南半岛",
    explanation: "中南半岛北高南低，河流大多自北向南流，形成山河相间、纵列分布的典型格局。",
    sourceLabel: "七下课件",
    sourcePage: 35,
    assetPath:
      "/images/runtime-courseware/bottom/011 2 第八章 我们邻近的地区和国家 - 4 第二节 第2课时 气候、农业与城市/img-008.png",
    extractionNote:
      "优先从七下课件“第八章/第2课时 气候、农业与城市.pptx”提取中南半岛地形与城市分布图。",
    knowledgePointIds: ["geo-bottom-033", "geo-bottom-034"]
  },
  {
    id: "map-india-software-export",
    title: "印度软件外包流向",
    book: "七下",
    chapter: "第八章 我们邻近的地区和国家",
    section: "印度",
    type: "select",
    prompt: "图中印度计算机软件产品和服务出口流向中，箭头最粗、比重最大的是哪个地区？",
    options: ["欧洲", "北美洲", "非洲", "大洋洲"],
    correctAnswer: "北美洲",
    explanation: "印度软件外包面向英语国家和发达经济体较多，其中北美洲所占比重最大。",
    sourceLabel: "七下课件",
    sourcePage: 43,
    assetPath:
      "/images/runtime-courseware/bottom/013 2 第八章 我们邻近的地区和国家 - 6 第三节 第2课时 气候、粮食与服务外包产业/img-012.png",
    extractionNote:
      "优先从七下课件“第八章/第2课时 气候、粮食与服务外包产业.pptx”提取印度服务外包流向图。",
    knowledgePointIds: ["geo-bottom-007", "geo-bottom-036"]
  },
  {
    id: "map-russia-pipeline-europe",
    title: "俄罗斯输油气方向",
    book: "七下",
    chapter: "第八章 我们邻近的地区和国家",
    section: "俄罗斯",
    type: "click",
    prompt: "请在图中找出俄罗斯向欧洲方向输送油气最密集的西部地区。",
    correctAnswer: "俄罗斯西部连接欧洲的油气管线集中区",
    explanation: "俄罗斯欧洲部分人口和工业较集中，对外油气运输线路也主要向西联系欧洲市场。",
    sourceLabel: "七下课件",
    sourcePage: 53,
    assetPath:
      "/images/runtime-courseware/bottom/015 2 第八章 我们邻近的地区和国家 - 8 第四节 第2课时 能源大国与交通运输/img-011.png",
    extractionNote:
      "优先从七下课件“第八章/第2课时 能源大国与交通运输.pptx”提取俄罗斯油气管线与铁路分布图。",
    knowledgePointIds: ["geo-bottom-039", "geo-bottom-040"]
  },
  {
    id: "map-russia-vladivostok-port",
    title: "符拉迪沃斯托克定位",
    book: "七下",
    chapter: "第八章 我们邻近的地区和国家",
    section: "俄罗斯",
    type: "region",
    prompt: "请在图中找出俄罗斯太平洋沿岸的重要港口符拉迪沃斯托克。",
    correctAnswer: "俄罗斯东南部、日本海沿岸的符拉迪沃斯托克",
    explanation: "符拉迪沃斯托克是俄罗斯远东重要港口，也是认识俄罗斯东西跨度大的关键定位点。",
    sourceLabel: "七下课件",
    sourcePage: 53,
    assetPath:
      "/images/runtime-courseware/bottom/015 2 第八章 我们邻近的地区和国家 - 8 第四节 第2课时 能源大国与交通运输/img-011.png",
    extractionNote:
      "优先从七下课件“第八章/第2课时 能源大国与交通运输.pptx”提取俄罗斯油气管线与铁路分布图。",
    knowledgePointIds: ["geo-bottom-008", "geo-bottom-040"]
  },
  {
    id: "map-europe-west-berlin",
    title: "柏林位置识别",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "欧洲西部",
    type: "region",
    prompt: "请在图中找出德国首都柏林所在的位置。",
    correctAnswer: "欧洲中部、德国境内的柏林",
    explanation: "柏林位于欧洲中部，结合经纬线和海陆位置可帮助快速判断欧洲西部主要国家分布。",
    sourceLabel: "七下课件",
    sourcePage: 68,
    assetPath:
      "/images/runtime-courseware/bottom/021 3 第九章 东半球其他的地区和国家 - 4 第二节 第2课时 气候、畜牧业与旅游业/img-011.png",
    extractionNote:
      "优先从七下课件“第九章/第2课时 气候、畜牧业与旅游业.pptx”提取欧洲西部位置与气候图。",
    knowledgePointIds: ["geo-bottom-043", "geo-bottom-044"]
  },
  {
    id: "map-australia-east-coal-belt",
    title: "澳大利亚东部煤矿带",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "澳大利亚",
    type: "select",
    prompt: "根据图例判断，煤矿和主要城市集中分布在澳大利亚的哪一侧沿海？",
    options: ["东部沿海", "西部沿海", "北部沿海", "中部内陆"],
    correctAnswer: "东部沿海",
    explanation: "澳大利亚东部沿海城市多、交通条件好，煤矿分布也较集中，是重要的开发地带。",
    sourceLabel: "七下课件",
    sourcePage: 86,
    assetPath:
      "/images/runtime-courseware/bottom/025 3 第九章 东半球其他的地区和国家 - 8 第四节 第2课时 养羊大国与矿产大国/img-009.png",
    extractionNote:
      "优先从七下课件“第九章/第2课时 养羊大国与矿产大国.pptx”提取澳大利亚矿产与城市分布图。",
    knowledgePointIds: ["geo-bottom-048", "geo-bottom-049"]
  },
  {
    id: "map-australia-west-iron-ore",
    title: "澳大利亚西部铁矿区",
    book: "七下",
    chapter: "第九章 东半球其他的地区和国家",
    section: "澳大利亚",
    type: "click",
    prompt: "请在图中找出澳大利亚西部铁矿资源较集中的区域。",
    correctAnswer: "澳大利亚西部和西南部的铁矿集中区",
    explanation: "澳大利亚铁矿资源丰富，西部矿区是其矿产品出口的重要基础。",
    sourceLabel: "七下课件",
    sourcePage: 86,
    assetPath:
      "/images/runtime-courseware/bottom/025 3 第九章 东半球其他的地区和国家 - 8 第四节 第2课时 养羊大国与矿产大国/img-009.png",
    extractionNote:
      "优先从七下课件“第九章/第2课时 养羊大国与矿产大国.pptx”提取澳大利亚矿产与城市分布图。",
    knowledgePointIds: ["geo-bottom-049"]
  },
  {
    id: "map-campus-china-pavilion-gate",
    title: "园区入口判读",
    book: "七上",
    chapter: "第二章 地图",
    section: "地图的选择和应用",
    type: "select",
    prompt: "根据图中的园区平面图，如果想尽快到达中国馆，最适合从哪一号门进入？",
    options: ["1号门", "3号门", "5号门", "7号门"],
    correctAnswer: "1号门",
    explanation: "1号门紧邻中国馆一侧，利用平面图可以直接判断最近入口，这正是地图应用的典型场景。",
    sourceLabel: "七上课件",
    sourcePage: 39,
    assetPath:
      "/images/runtime-courseware/top/013 2 第二章 地 图 - 4 第三节 地图的选择和应用/img-004.png",
    extractionNote:
      "优先从七上课件“第二章/第三节 地图的选择和应用.pptx”提取园区平面示意图。",
    knowledgePointIds: ["geo-top-028", "geo-top-030"]
  },
  {
    id: "map-campus-life-hall-direction",
    title: "方位判读训练",
    book: "七上",
    chapter: "第二章 地图",
    section: "地图的选择和应用",
    type: "select",
    prompt: "根据指向标判断，生活体验馆位于中国馆的什么方向？",
    options: ["正北", "东北", "西南", "东南"],
    correctAnswer: "东北",
    explanation: "先依据指向标确定上北下南，再比较两处建筑的位置关系即可判断方位。",
    sourceLabel: "七上课件",
    sourcePage: 39,
    assetPath:
      "/images/runtime-courseware/top/013 2 第二章 地 图 - 4 第三节 地图的选择和应用/img-004.png",
    extractionNote:
      "优先从七上课件“第二章/第三节 地图的选择和应用.pptx”提取园区平面示意图。",
    knowledgePointIds: ["geo-top-027", "geo-top-028"]
  },
  {
    id: "map-world-pop-east-asia-core",
    title: "东亚人口稠密区",
    book: "七上",
    chapter: "第五章 居民与文化",
    section: "人口与人种",
    type: "click",
    prompt: "请在世界人口分布图中找出东亚人口最稠密的核心区域。",
    correctAnswer: "中国东部、朝鲜半岛和日本附近的人口稠密区",
    explanation: "东亚东部地势较低平、季风气候适宜、农业和城市发展较早，因此人口高度集中。",
    sourceLabel: "七上课件",
    sourcePage: 93,
    assetPath:
      "/images/runtime-courseware/top/030 5 第五章 居民与文化 - 1 第一节 人口与人种/img-004.png",
    extractionNote:
      "优先从七上课件“第五章/第一节 人口与人种.pptx”提取世界人口分布图。",
    knowledgePointIds: ["geo-top-068", "geo-top-069"]
  },
  {
    id: "map-world-pop-south-asia-core",
    title: "南亚人口稠密区",
    book: "七上",
    chapter: "第五章 居民与文化",
    section: "人口与人种",
    type: "region",
    prompt: "请在图中找出南亚人口最密集的主要分布区域。",
    correctAnswer: "印度半岛北部和恒河平原附近的人口稠密区",
    explanation: "南亚平原广阔、河流水源丰富、农业开发历史悠久，所以形成了世界著名的人口稠密区。",
    sourceLabel: "七上课件",
    sourcePage: 93,
    assetPath:
      "/images/runtime-courseware/top/030 5 第五章 居民与文化 - 1 第一节 人口与人种/img-004.png",
    extractionNote:
      "优先从七上课件“第五章/第一节 人口与人种.pptx”提取世界人口分布图。",
    knowledgePointIds: ["geo-top-068", "geo-bottom-029"]
  },
  {
    id: "map-world-rainfall-equator-belt",
    title: "赤道多雨带识别",
    book: "七上",
    chapter: "第四章 天气与气候",
    section: "降水的变化与分布",
    type: "click",
    prompt: "请在图中找出全球年降水量最丰富的一条主要地带。",
    correctAnswer: "赤道附近的高降水带，如亚马孙、刚果盆地和东南亚一带",
    explanation: "赤道附近全年高温，对流旺盛，空气上升冷却后容易形成丰沛降水。",
    sourceLabel: "七上课件",
    sourcePage: 79,
    assetPath:
      "/images/runtime-courseware/top/025 4 第四章 天气与气候 - 5 第三节 第2课时 降水的分布/img-012.png",
    extractionNote:
      "优先从七上课件“第四章/第2课时 降水的分布.pptx”提取世界年降水量分布图。",
    knowledgePointIds: ["geo-top-036", "geo-top-047"]
  },
  {
    id: "map-world-rainfall-polar-scarce",
    title: "两极少雨区判断",
    book: "七上",
    chapter: "第四章 天气与气候",
    section: "降水的变化与分布",
    type: "select",
    prompt: "根据图例判断，图中年降水量最少的大片区域更接近下列哪一类地区？",
    options: ["赤道附近低地", "北极圈和南极圈附近", "东南亚群岛", "温带沿海平原"],
    correctAnswer: "北极圈和南极圈附近",
    explanation: "两极地区寒冷干燥，空气中的水汽含量低，所以年降水量普遍较少。",
    sourceLabel: "七上课件",
    sourcePage: 79,
    assetPath:
      "/images/runtime-courseware/top/025 4 第四章 天气与气候 - 5 第三节 第2课时 降水的分布/img-012.png",
    extractionNote:
      "优先从七上课件“第四章/第2课时 降水的分布.pptx”提取世界年降水量分布图。",
    knowledgePointIds: ["geo-top-036", "geo-top-084"]
  },
  {
    id: "map-africa-sahara-desert-belt",
    title: "撒哈拉干旱带",
    book: "七上",
    chapter: "第四章 天气与气候",
    section: "世界的气候",
    type: "click",
    prompt: "请在图中找出非洲北部大面积炎热干燥的气候区。",
    correctAnswer: "北回归线附近的撒哈拉地区热带沙漠气候区",
    explanation: "北回归线附近常年受副热带高压控制，空气下沉、降水稀少，形成广阔沙漠。",
    sourceLabel: "七上课件",
    sourcePage: 87,
    assetPath:
      "/images/runtime-courseware/top/027 4 第四章 天气与气候 - 7 第四节 第1课时 气候的地区差异 世界气候类型的分布/img-010.png",
    extractionNote:
      "优先从七上课件“第四章/第1课时 气候的地区差异 世界气候类型的分布.pptx”提取非洲气候分布图。",
    knowledgePointIds: ["geo-top-066", "geo-top-085"]
  },
  {
    id: "map-africa-equator-rainforest-belt",
    title: "非洲赤道雨林带",
    book: "七上",
    chapter: "第四章 天气与气候",
    section: "世界的气候",
    type: "region",
    prompt: "请在图中找出赤道穿过、全年高温多雨的非洲中部地区。",
    correctAnswer: "非洲中部赤道附近的热带雨林气候区",
    explanation: "赤道附近太阳辐射强、对流旺盛，全年高温多雨，形成热带雨林气候。",
    sourceLabel: "七上课件",
    sourcePage: 87,
    assetPath:
      "/images/runtime-courseware/top/027 4 第四章 天气与气候 - 7 第四节 第1课时 气候的地区差异 世界气候类型的分布/img-010.png",
    extractionNote:
      "优先从七上课件“第四章/第1课时 气候的地区差异 世界气候类型的分布.pptx”提取非洲气候分布图。",
    knowledgePointIds: ["geo-top-047", "geo-bottom-060"]
  }
];

export const sprintPresets: SprintPreset[] = [
  {
    minutes: 30,
    label: "30 分钟冲刺",
    focus: ["本周待复习", "基础高频点", "2 道地图题"],
    itemCount: 14
  },
  {
    minutes: 60,
    label: "60 分钟冲刺",
    focus: ["高频知识点", "易错判断题", "4 道地图题", "跨章节混练"],
    itemCount: 28
  },
  {
    minutes: 90,
    label: "90 分钟冲刺",
    focus: ["必背地图", "教师用书重点题", "错题回炉", "考前节奏模拟"],
    itemCount: 40
  }
];
