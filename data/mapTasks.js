window.GEOGRAPHY_MAP_TASKS = {
  "lesson-intro": [
    {
      id: "intro-map-1",
      title: "读图三步法",
      skill: "图名、图例、方向",
      visual: {
        type: "map-elements",
        title: "校园周边简图",
        legend: ["学校", "河流", "道路"],
        labels: ["学校", "河流", "公园"]
      },
      prompt: "观察这张校园周边简图，做地理读图题时第一步最应该先看什么？",
      options: ["图名、方向和图例", "只看颜色是否好看", "直接写最长的答案", "只背地图上的文字"],
      answer: "图名、方向和图例",
      explanation: "读图先明确地图表达什么，再看方向、图例和比例关系。"
    }
  ],
  "lesson-1-1": [
    {
      id: "l11-map-1",
      title: "经纬网定位",
      skill: "经纬线判读",
      visual: {
        type: "globe-grid",
        title: "经纬网示意",
        labels: ["赤道", "本初子午线", "A点"]
      },
      prompt: "图中 A 点位于赤道以北、本初子午线以东，应该怎样描述它的半球位置？",
      options: ["北半球、东半球", "南半球、西半球", "北半球、西半球", "南半球、东半球"],
      answer: "北半球、东半球",
      explanation: "赤道以北为北半球，本初子午线以东且在 20°W 到 160°E 范围内通常属东半球。"
    },
    {
      id: "l11-map-2",
      title: "纬线长度比较",
      skill: "纬线特点",
      visual: {
        type: "globe-grid",
        title: "纬线长度示意",
        labels: ["赤道最长", "高纬较短"]
      },
      prompt: "根据纬线圈大小，图中最长的纬线应是：",
      options: ["赤道", "北回归线", "北极圈", "任意一条经线"],
      answer: "赤道",
      explanation: "纬线长度从赤道向两极逐渐变短，赤道是最长的纬线。"
    }
  ],
  "lesson-1-2": [
    {
      id: "l12-map-1",
      title: "昼夜更替示意",
      skill: "自转判读",
      visual: {
        type: "orbit",
        title: "地球自转与昼夜",
        labels: ["太阳光", "昼半球", "夜半球"]
      },
      prompt: "图中地球一面受光、一面背光，随着地球自转会产生什么现象？",
      options: ["昼夜更替", "海陆变迁", "板块碰撞", "火山喷发"],
      answer: "昼夜更替",
      explanation: "地球自转使不同地区交替进入昼半球和夜半球。"
    },
    {
      id: "l12-map-2",
      title: "公转与季节",
      skill: "公转判读",
      visual: {
        type: "orbit",
        title: "地球公转示意",
        labels: ["春分", "夏至", "秋分", "冬至"]
      },
      prompt: "图中地球围绕太阳公转，并保持地轴倾斜，主要形成：",
      options: ["季节变化", "经线长度相等", "火山地震带", "海水涨落"],
      answer: "季节变化",
      explanation: "地球公转和地轴倾斜共同造成太阳直射点移动和季节变化。"
    }
  ],
  "lesson-1-3": [
    {
      id: "l13-map-1",
      title: "地图三要素",
      skill: "方向、比例尺、图例",
      visual: {
        type: "map-elements",
        title: "城市公园路线图",
        legend: ["北", "比例尺", "图例"],
        labels: ["入口", "湖泊", "观景台"]
      },
      prompt: "若图上有指向标，判断入口到观景台的大致方向时，应优先依据：",
      options: ["指向标", "纸张边缘", "文字大小", "颜色深浅"],
      answer: "指向标",
      explanation: "有指向标时，方向判断应以指向标所示北方为准。"
    },
    {
      id: "l13-map-2",
      title: "比例尺与详略",
      skill: "比例尺判读",
      visual: {
        type: "scale-compare",
        title: "同一区域两幅地图",
        labels: ["甲图", "乙图"]
      },
      prompt: "若甲图表示范围小、内容更详细，乙图表示范围大、内容更简略，比例尺较大的是：",
      options: ["甲图", "乙图", "两图一样大", "无法比较"],
      answer: "甲图",
      explanation: "比例尺越大，表示范围越小，内容越详细。"
    }
  ],
  "lesson-1-4": [
    {
      id: "l14-map-1",
      title: "等高线疏密",
      skill: "坡度判读",
      visual: {
        type: "contour",
        title: "等高线地形图",
        labels: ["甲坡", "乙坡", "山顶"]
      },
      prompt: "图中等高线更密集的一侧坡度特点是：",
      options: ["坡度较陡", "坡度较缓", "海拔一定为 0", "一定是平原"],
      answer: "坡度较陡",
      explanation: "等高线密集说明单位距离内高差变化大，坡度较陡。"
    },
    {
      id: "l14-map-2",
      title: "山谷与山脊",
      skill: "地形部位判读",
      visual: {
        type: "contour",
        title: "山地等高线示意",
        labels: ["山顶", "山谷", "山脊"]
      },
      prompt: "在等高线向海拔高处弯曲的位置，通常表示：",
      options: ["山谷", "山脊", "海洋", "沙漠"],
      answer: "山谷",
      explanation: "等高线向高处凸出多为山谷，向低处凸出多为山脊。"
    }
  ],
  "lesson-2-1": [
    {
      id: "l21-map-1",
      title: "七大洲四大洋",
      skill: "海陆分布",
      visual: {
        type: "world-map",
        title: "世界海陆分布示意",
        labels: ["亚洲", "非洲", "太平洋", "大西洋"]
      },
      prompt: "观察世界海陆分布图，面积最大的大洲和大洋分别是：",
      options: ["亚洲、太平洋", "欧洲、印度洋", "非洲、北冰洋", "南极洲、大西洋"],
      answer: "亚洲、太平洋",
      explanation: "亚洲是面积最大的大洲，太平洋是面积最大的大洋。"
    },
    {
      id: "l21-map-2",
      title: "海陆比例",
      skill: "海陆比例判读",
      visual: {
        type: "world-map",
        title: "海洋与陆地面积对比",
        labels: ["海洋更广", "陆地较少"]
      },
      prompt: "从世界海陆分布看，地球表面总体特点是：",
      options: ["海洋面积大于陆地面积", "陆地面积大于海洋面积", "陆地和海洋完全相等", "北半球没有海洋"],
      answer: "海洋面积大于陆地面积",
      explanation: "地球表面约七分海洋、三分陆地。"
    }
  ],
  "lesson-2-2": [
    {
      id: "l22-map-1",
      title: "板块边界",
      skill: "火山地震分布",
      visual: {
        type: "plate-boundary",
        title: "板块运动与地震带",
        labels: ["板块A", "板块B", "火山地震带"]
      },
      prompt: "图中火山、地震多沿板块交界处分布，主要原因是这里：",
      options: ["地壳活动活跃", "人口最密集", "气温最高", "河流最多"],
      answer: "地壳活动活跃",
      explanation: "板块交界处挤压、碰撞或张裂明显，地壳活动活跃。"
    },
    {
      id: "l22-map-2",
      title: "海陆变迁证据",
      skill: "证据判断",
      visual: {
        type: "land-sea-change",
        title: "高山海洋化石示意",
        labels: ["高山", "海洋生物化石"]
      },
      prompt: "高山岩层中发现海洋生物化石，最能说明：",
      options: ["海陆会发生变迁", "天气每天都相同", "地球没有运动", "纬线长度相等"],
      answer: "海陆会发生变迁",
      explanation: "海洋生物化石出现在高山上，是海陆变迁的重要证据。"
    }
  ],
  "lesson-3-1": [
    {
      id: "l31-map-1",
      title: "天气预报图",
      skill: "天气符号判读",
      visual: {
        type: "weather-map",
        title: "城市天气预报示意",
        labels: ["晴", "雨", "风"]
      },
      prompt: "图中同一天不同城市出现晴、雨、风等符号，这类信息描述的是：",
      options: ["天气", "气候", "地形", "人口"],
      answer: "天气",
      explanation: "天气是短时间的大气状况，天气预报图常用符号表示。"
    }
  ],
  "lesson-3-2": [
    {
      id: "l32-map-1",
      title: "气温纬度变化",
      skill: "等温线/纬度规律",
      visual: {
        type: "temperature-latitude",
        title: "世界气温随纬度变化",
        labels: ["低纬高温", "高纬低温"]
      },
      prompt: "图中气温从低纬向高纬总体降低，主要受什么因素影响？",
      options: ["纬度位置", "语言种类", "宗教分布", "城市大小"],
      answer: "纬度位置",
      explanation: "纬度影响太阳辐射，是世界气温分布的基础因素。"
    },
    {
      id: "l32-map-2",
      title: "海拔与气温",
      skill: "地形影响气温",
      visual: {
        type: "mountain-temperature",
        title: "山地气温变化示意",
        labels: ["山麓较暖", "山顶较冷"]
      },
      prompt: "同一座山从山麓到山顶气温降低，说明影响气温的因素是：",
      options: ["地形海拔", "人口密度", "语言文字", "海陆面积"],
      answer: "地形海拔",
      explanation: "海拔越高，气温通常越低。"
    }
  ],
  "lesson-3-3": [
    {
      id: "l33-map-1",
      title: "降水柱状图",
      skill: "降水季节变化",
      visual: {
        type: "precipitation-chart",
        title: "某地月降水量",
        labels: ["雨季", "旱季"]
      },
      prompt: "图中降水集中在夏季，说明该地降水季节变化特点是：",
      options: ["夏季多雨", "全年少雨", "冬季多雨", "全年降水均匀"],
      answer: "夏季多雨",
      explanation: "柱状图中夏季月份柱子高，表示夏季降水较多。"
    },
    {
      id: "l33-map-2",
      title: "迎风坡降水",
      skill: "地形雨判读",
      visual: {
        type: "orographic-rain",
        title: "山地迎风坡和背风坡",
        labels: ["迎风坡", "背风坡", "水汽"]
      },
      prompt: "图中湿润气流受山地抬升，降水较多的一侧是：",
      options: ["迎风坡", "背风坡", "山后平原", "山顶以外所有地区"],
      answer: "迎风坡",
      explanation: "迎风坡空气抬升易成云致雨，降水较多。"
    }
  ],
  "lesson-3-4": [
    {
      id: "l34-map-1",
      title: "气候资料图",
      skill: "气温曲线和降水柱判读",
      visual: {
        type: "climate-chart",
        title: "气候资料图",
        labels: ["全年高温", "夏季多雨"]
      },
      prompt: "读气候资料图，描述气候特征时最核心的两个指标是：",
      options: ["气温和降水", "人口和城市", "语言和宗教", "矿产和工业"],
      answer: "气温和降水",
      explanation: "气候资料图通常用气温曲线和降水柱状图共同表示。"
    },
    {
      id: "l34-map-2",
      title: "世界气候分布",
      skill: "气候分布规律",
      visual: {
        type: "climate-zones",
        title: "世界气候带示意",
        labels: ["热带", "温带", "寒带"]
      },
      prompt: "世界气候带大致随纬度呈带状分布，主要是因为：",
      options: ["太阳辐射随纬度变化", "各地语言不同", "铁路分布不同", "城市大小不同"],
      answer: "太阳辐射随纬度变化",
      explanation: "纬度影响热量条件，是气候分布的重要基础。"
    }
  ],
  "lesson-4-1": [
    {
      id: "l41-map-1",
      title: "人口密度图",
      skill: "人口分布判读",
      visual: {
        type: "population-map",
        title: "世界人口分布示意",
        labels: ["沿海平原稠密", "荒漠高寒稀少"]
      },
      prompt: "图中人口稠密区多集中在中低纬沿海平原，主要原因是这些地区：",
      options: ["自然和交通条件较好", "一定没有河流", "全部位于高山", "终年严寒"],
      answer: "自然和交通条件较好",
      explanation: "地形平坦、气候适宜、水源和交通条件好，有利于人口集中。"
    }
  ],
  "lesson-4-2": [
    {
      id: "l42-map-1",
      title: "语言宗教分布图",
      skill: "文化区域判读",
      visual: {
        type: "culture-map",
        title: "世界语言与宗教分布示意",
        labels: ["汉语", "英语", "阿拉伯语"]
      },
      prompt: "读语言分布图时，最合适的表述方式是：",
      options: ["某语言主要分布在某些地区", "所有地区语言完全相同", "语言和区域无关", "只看面积不看图例"],
      answer: "某语言主要分布在某些地区",
      explanation: "语言和宗教分布题要结合图例，描述主要分布区域。"
    }
  ],
  "lesson-4-3": [
    {
      id: "l43-map-1",
      title: "聚落选址图",
      skill: "聚落与环境",
      visual: {
        type: "settlement-map",
        title: "河流沿岸聚落示意",
        labels: ["河流", "道路", "聚落"]
      },
      prompt: "图中聚落集中在河流和道路附近，主要因为这里：",
      options: ["水源和交通便利", "一定终年积雪", "不能进行生产活动", "离水源越远越好"],
      answer: "水源和交通便利",
      explanation: "聚落形成常受水源、地形、交通等条件影响。"
    },
    {
      id: "l43-map-2",
      title: "民居与环境",
      skill: "传统民居判读",
      visual: {
        type: "house-climate",
        title: "不同地区民居示意",
        labels: ["坡屋顶", "厚墙小窗", "高脚屋"]
      },
      prompt: "从民居图判断，坡屋顶常见于降水较多地区，主要有利于：",
      options: ["排水", "增加沙尘", "阻止所有阳光", "减少屋顶坡度"],
      answer: "排水",
      explanation: "坡屋顶便于雨水快速流下，体现民居对气候的适应。"
    }
  ],
  "lesson-5-1": [
    {
      id: "l51-map-1",
      title: "发展水平差异图",
      skill: "区域差异判读",
      visual: {
        type: "development-map",
        title: "世界发展水平示意",
        labels: ["发达国家集中区", "发展中国家集中区"]
      },
      prompt: "读世界发展水平示意图，正确的认识是：",
      options: ["各国发展水平存在差异，需要合作", "所有国家发展水平完全相同", "地图无法表示区域差异", "合作与发展无关"],
      answer: "各国发展水平存在差异，需要合作",
      explanation: "发展差异和全球联系共同说明国际合作的重要性。"
    }
  ],
  "lesson-6-1": [
    {
      id: "l61-map-1",
      title: "亚洲位置图",
      skill: "半球和海陆位置",
      visual: {
        type: "region-map",
        region: "asia",
        title: "亚洲位置和范围",
        labels: ["亚洲", "太平洋", "印度洋", "北冰洋"]
      },
      prompt: "从海陆位置看，亚洲东临的大洋是：",
      options: ["太平洋", "大西洋", "印度洋", "北冰洋"],
      answer: "太平洋",
      explanation: "亚洲东临太平洋，南临印度洋，北临北冰洋。"
    },
    {
      id: "l61-map-2",
      title: "亚洲分区",
      skill: "区域划分",
      visual: {
        type: "region-map",
        region: "asia",
        title: "亚洲分区示意",
        labels: ["东亚", "东南亚", "南亚", "西亚", "中亚", "北亚"]
      },
      prompt: "教材中亚洲常分为几个地区？",
      options: ["六个", "两个", "三个", "十个"],
      answer: "六个",
      explanation: "常见分区为东亚、东南亚、南亚、西亚、中亚、北亚。"
    }
  ],
  "lesson-6-2": [
    {
      id: "l62-map-1",
      title: "亚洲地势与河流",
      skill: "地势影响河流",
      visual: {
        type: "asia-relief",
        title: "亚洲地势与河流流向",
        labels: ["中部高", "四周低", "河流放射状"]
      },
      prompt: "图中亚洲河流多由中部向四周流，主要说明亚洲地势：",
      options: ["中部高、四周低", "四周高、中部低", "东高西低", "完全平坦"],
      answer: "中部高、四周低",
      explanation: "河流由高处流向低处，放射状水系反映中部高、四周低。"
    },
    {
      id: "l62-map-2",
      title: "亚洲气候分布",
      skill: "气候复杂多样",
      visual: {
        type: "asia-climate",
        title: "亚洲气候类型示意",
        labels: ["季风气候", "大陆性气候", "寒带气候"]
      },
      prompt: "亚洲跨纬度广、海陆差异大，因此气候特征是：",
      options: ["复杂多样", "完全一样", "只分布热带雨林气候", "没有季风气候"],
      answer: "复杂多样",
      explanation: "亚洲面积大、跨纬度广，气候复杂多样，季风气候显著。"
    }
  ],
  "lesson-7-1": [
    {
      id: "l71-map-1",
      title: "日本位置与灾害",
      skill: "板块位置判读",
      visual: {
        type: "region-map",
        region: "japan",
        title: "日本位置示意",
        labels: ["日本", "太平洋", "板块交界"]
      },
      prompt: "图中日本位于板块交界附近，因此常见的自然灾害是：",
      options: ["火山和地震", "极昼和极夜", "沙尘暴全年不断", "冰川覆盖全国"],
      answer: "火山和地震",
      explanation: "日本位于板块交界附近，地壳活动活跃。"
    },
    {
      id: "l71-map-2",
      title: "日本工业布局",
      skill: "港口与工业",
      visual: {
        type: "region-map",
        region: "japan",
        title: "日本太平洋沿岸工业带",
        labels: ["太平洋沿岸", "优良港湾", "工业集中"]
      },
      prompt: "日本工业多沿太平洋沿岸和濑户内海分布，主要有利于：",
      options: ["进口原料、出口产品", "远离港口", "减少海运", "避开城市"],
      answer: "进口原料、出口产品",
      explanation: "日本资源不足，便利海运有利于加工贸易型经济。"
    }
  ],
  "lesson-7-2": [
    {
      id: "l72-map-1",
      title: "东南亚交通位置",
      skill: "海峡位置判读",
      visual: {
        type: "region-map",
        region: "southeast-asia",
        title: "东南亚十字路口",
        labels: ["亚洲", "大洋洲", "太平洋", "印度洋", "马六甲海峡"]
      },
      prompt: "图中沟通太平洋和印度洋的重要海峡是：",
      options: ["马六甲海峡", "白令海峡", "直布罗陀海峡", "英吉利海峡"],
      answer: "马六甲海峡",
      explanation: "马六甲海峡是东南亚重要国际航道。"
    },
    {
      id: "l72-map-2",
      title: "东南亚农业",
      skill: "气候与农业",
      visual: {
        type: "region-map",
        region: "southeast-asia",
        title: "东南亚热带农业",
        labels: ["高温多雨", "水稻", "橡胶", "油棕"]
      },
      prompt: "东南亚适合水稻和热带经济作物生长，主要自然原因是：",
      options: ["高温多雨", "全年严寒", "缺水少雨", "高山冰雪广布"],
      answer: "高温多雨",
      explanation: "热带气候提供充足热量和水分。"
    }
  ],
  "lesson-7-3": [
    {
      id: "l73-map-1",
      title: "印度季风",
      skill: "季风方向判读",
      visual: {
        type: "region-map",
        region: "india",
        title: "印度西南季风",
        labels: ["印度洋", "西南季风", "降水"]
      },
      prompt: "图中从印度洋吹向印度陆地、带来大量降水的是：",
      options: ["西南季风", "东北信风", "极地东风", "盛行西风"],
      answer: "西南季风",
      explanation: "西南季风给印度带来主要降水，对农业影响很大。"
    },
    {
      id: "l73-map-2",
      title: "季风异常与灾害",
      skill: "旱涝成因",
      visual: {
        type: "monsoon-risk",
        title: "印度季风强弱与农业",
        labels: ["偏弱少雨", "正常", "偏强多雨"]
      },
      prompt: "如果西南季风来得晚、势力弱，印度农业容易出现：",
      options: ["旱灾", "寒潮", "火山喷发", "极夜"],
      answer: "旱灾",
      explanation: "西南季风弱会导致降水不足，影响农业灌溉。"
    }
  ],
  "lesson-7-4": [
    {
      id: "l74-map-1",
      title: "俄罗斯人口分布",
      skill: "气候与人口",
      visual: {
        type: "region-map",
        region: "russia",
        title: "俄罗斯人口与城市分布",
        labels: ["欧洲部分", "西伯利亚", "北冰洋"]
      },
      prompt: "俄罗斯人口和城市主要集中在欧洲部分，主要因为那里：",
      options: ["气候较温和，开发较早", "全年极夜", "没有交通", "全部是沙漠"],
      answer: "气候较温和，开发较早",
      explanation: "欧洲部分自然和社会经济条件更适合人口集中。"
    },
    {
      id: "l74-map-2",
      title: "俄罗斯资源与铁路",
      skill: "资源交通联系",
      visual: {
        type: "region-map",
        region: "russia",
        title: "资源区和西伯利亚大铁路",
        labels: ["煤", "石油", "天然气", "铁路"]
      },
      prompt: "图中铁路连接资源区和城市，主要作用是：",
      options: ["促进资源开发和运输", "阻断东西联系", "减少工业发展", "只用于观光"],
      answer: "促进资源开发和运输",
      explanation: "交通线有利于资源开发、人员往来和区域经济联系。"
    }
  ],
  "lesson-8-1": [
    {
      id: "l81-map-1",
      title: "中东位置",
      skill: "三洲五海判读",
      visual: {
        type: "region-map",
        region: "middle-east",
        title: "中东三洲五海之地",
        labels: ["亚洲", "欧洲", "非洲", "波斯湾"]
      },
      prompt: "中东成为世界关注热点的重要地理原因之一是：",
      options: ["战略位置重要", "远离所有海洋", "没有任何资源", "气候全年严寒"],
      answer: "战略位置重要",
      explanation: "中东连接多洲多海，交通和战略位置重要。"
    },
    {
      id: "l81-map-2",
      title: "中东石油运输",
      skill: "资源与航线",
      visual: {
        type: "region-map",
        region: "middle-east",
        title: "中东石油输出路线",
        labels: ["波斯湾", "石油", "海上航线"]
      },
      prompt: "图中从波斯湾输出的最重要资源是：",
      options: ["石油", "水稻", "木材", "冰川"],
      answer: "石油",
      explanation: "中东波斯湾沿岸石油资源丰富。"
    }
  ],
  "lesson-8-2": [
    {
      id: "l82-map-1",
      title: "欧洲西部气候",
      skill: "气候与畜牧业",
      visual: {
        type: "region-map",
        region: "europe-west",
        title: "欧洲西部温带海洋性气候",
        labels: ["西风", "大西洋", "牧草"]
      },
      prompt: "欧洲西部温和湿润，有利于多汁牧草生长，因此适合发展：",
      options: ["畜牧业", "热带雨林采伐", "极地科考", "沙漠绿洲农业"],
      answer: "畜牧业",
      explanation: "温带海洋性气候适合牧草生长，畜牧业发达。"
    },
    {
      id: "l82-map-2",
      title: "欧洲西部旅游",
      skill: "旅游资源判读",
      visual: {
        type: "tourism-map",
        title: "欧洲西部旅游资源",
        labels: ["雪山", "古城", "海岸", "交通便利"]
      },
      prompt: "从图中多样景观和便利交通看，欧洲西部适合发展：",
      options: ["旅游业", "单一商品经济", "极地捕鲸", "热带水稻种植"],
      answer: "旅游业",
      explanation: "丰富自然和人文景观、发达交通服务促进旅游业发展。"
    }
  ],
  "lesson-8-3": [
    {
      id: "l83-map-1",
      title: "撒哈拉以南非洲资源",
      skill: "资源与经济",
      visual: {
        type: "region-map",
        region: "africa",
        title: "撒哈拉以南非洲资源示意",
        labels: ["黄金", "金刚石", "可可", "咖啡"]
      },
      prompt: "图中资源和农产品种类多，但部分国家长期主要出口初级产品，这种经济特点是：",
      options: ["单一商品经济", "高新技术经济", "完全无资源经济", "高度工业化经济"],
      answer: "单一商品经济",
      explanation: "依赖少数初级产品出口，容易受国际市场影响。"
    },
    {
      id: "l83-map-2",
      title: "热带草原景观",
      skill: "自然带判读",
      visual: {
        type: "savanna-chart",
        title: "热带草原干湿季",
        labels: ["湿季", "干季", "草原"]
      },
      prompt: "图中降水分干湿两季，常形成的典型自然景观是：",
      options: ["热带草原", "寒带冰原", "温带落叶阔叶林", "针叶林"],
      answer: "热带草原",
      explanation: "热带草原气候有明显干湿季。"
    }
  ],
  "lesson-8-4": [
    {
      id: "l84-map-1",
      title: "澳大利亚人口分布",
      skill: "沿海分布判读",
      visual: {
        type: "region-map",
        region: "australia",
        title: "澳大利亚人口与城市分布",
        labels: ["东南沿海", "内陆干旱", "城市集中"]
      },
      prompt: "澳大利亚人口和城市集中在东南沿海，主要因为那里：",
      options: ["气候较适宜、交通便利", "内陆沙漠最广", "完全没有港口", "全年冰雪覆盖"],
      answer: "气候较适宜、交通便利",
      explanation: "东南沿海自然和经济条件优越，适合人口城市集中。"
    },
    {
      id: "l84-map-2",
      title: "澳大利亚特有生物",
      skill: "孤立大陆判读",
      visual: {
        type: "region-map",
        region: "australia",
        title: "孤立大陆与特有生物",
        labels: ["袋鼠", "考拉", "长期孤立"]
      },
      prompt: "澳大利亚有许多古老特有生物，重要原因是：",
      options: ["长期与其他大陆隔离", "纬度最高", "完全没有海洋阻隔", "城市最多"],
      answer: "长期与其他大陆隔离",
      explanation: "长期孤立使澳大利亚保存较多古老而特有的物种。"
    }
  ],
  "lesson-9-1": [
    {
      id: "l91-map-1",
      title: "美国农业带",
      skill: "农业专业化",
      visual: {
        type: "region-map",
        region: "usa",
        title: "美国农业带示意",
        labels: ["玉米带", "小麦带", "棉花带", "乳畜带"]
      },
      prompt: "图中美国不同地区形成不同农业带，体现的农业特点是：",
      options: ["地区专业化", "完全手工生产", "没有机械化", "只种一种作物"],
      answer: "地区专业化",
      explanation: "美国农业因地制宜，地区专业化明显。"
    },
    {
      id: "l91-map-2",
      title: "美国高新技术",
      skill: "产业布局判读",
      visual: {
        type: "region-map",
        region: "usa",
        title: "美国高新技术产业示意",
        labels: ["硅谷", "高校", "科研", "市场"]
      },
      prompt: "图中高新技术产业集聚，最需要的条件是：",
      options: ["科技和人才", "极寒气候", "远离市场", "没有交通"],
      answer: "科技和人才",
      explanation: "高新技术产业依赖科研、人才、资本和市场。"
    }
  ],
  "lesson-9-2": [
    {
      id: "l92-map-1",
      title: "巴西人口城市",
      skill: "人口分布判读",
      visual: {
        type: "region-map",
        region: "brazil",
        title: "巴西人口与城市分布",
        labels: ["东南沿海", "亚马孙平原", "巴西高原"]
      },
      prompt: "巴西人口和城市多集中在东南沿海，主要因为这里：",
      options: ["开发较早、交通便利", "全部是热带雨林", "没有工业基础", "远离海洋"],
      answer: "开发较早、交通便利",
      explanation: "东南沿海开发早、经济和交通条件较好。"
    },
    {
      id: "l92-map-2",
      title: "亚马孙雨林",
      skill: "生态意义判读",
      visual: {
        type: "region-map",
        region: "brazil",
        title: "亚马孙热带雨林",
        labels: ["亚马孙河", "热带雨林", "生态保护"]
      },
      prompt: "图中亚马孙热带雨林面积广大，对全球环境的重要作用是：",
      options: ["调节气候、维护生态平衡", "制造极夜", "减少生物多样性", "阻止所有降水"],
      answer: "调节气候、维护生态平衡",
      explanation: "热带雨林对调节气候、涵养水源和保护生物多样性有重要意义。"
    }
  ],
  "lesson-10-1": [
    {
      id: "l101-map-1",
      title: "南北极比较",
      skill: "极地地图判读",
      visual: {
        type: "polar-map",
        title: "南极与北极示意",
        labels: ["南极大陆", "北冰洋", "冰盖"]
      },
      prompt: "从图中看，南极地区和北极地区最主要的差别是：",
      options: ["南极以陆地为主，北极以海洋为主", "南极全年高温，北极全年炎热", "两地都位于赤道", "北极没有海洋"],
      answer: "南极以陆地为主，北极以海洋为主",
      explanation: "南极地区以大陆为核心，北极地区以北冰洋为核心。"
    },
    {
      id: "l101-map-2",
      title: "极地科考",
      skill: "科考价值判读",
      visual: {
        type: "polar-map",
        title: "极地科学考察",
        labels: ["冰芯", "气候变化", "生态保护"]
      },
      prompt: "极地科考常研究冰芯和气候变化，主要说明极地具有：",
      options: ["重要科研和环境价值", "大规模水稻种植价值", "全年商业航运最便利", "人口最密集"],
      answer: "重要科研和环境价值",
      explanation: "极地是研究全球气候变化和地球环境的重要区域。"
    }
  ]
};
