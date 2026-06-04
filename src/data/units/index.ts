import asiaUnit from "./geo-7b-chapter7-asia.json";
import type { UnitCatalogEntry, UnitData } from "../../types";

export const DEFAULT_UNIT_ID = "geo-7b-chapter7-asia";

export const semesterGroups = [
  { bookCode: "grade7-semester1", label: "七年级上册" },
  { bookCode: "grade7-semester2", label: "七年级下册" }
] as const;

export const unitCatalog: UnitCatalogEntry[] = [
  {
    unitId: "geo-7a-chapter1-earth",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第一章",
    chapterName: "第一章 地球",
    title: "地球",
    description: "地球、地球仪和地球运动的基础认识。",
    status: "planned",
    accent: "ocean"
  },
  {
    unitId: "geo-7a-chapter2-maps",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第二章",
    chapterName: "第二章 地图",
    title: "地图",
    description: "地图判读、比例尺和地形图应用。",
    status: "planned",
    accent: "mint"
  },
  {
    unitId: "geo-7a-chapter3-land-and-sea",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第三章",
    chapterName: "第三章 陆地和海洋",
    title: "陆地和海洋",
    description: "大洲大洋、地形与海陆变迁。",
    status: "planned",
    accent: "sand"
  },
  {
    unitId: "geo-7a-chapter4-weather-and-climate",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第四章",
    chapterName: "第四章 天气与气候",
    title: "天气与气候",
    description: "天气现象、气温、降水和气候分布。",
    status: "planned",
    accent: "slate"
  },
  {
    unitId: "geo-7a-chapter5-people-and-culture",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第五章",
    chapterName: "第五章 居民与文化",
    title: "居民与文化",
    description: "人口分布、聚落与文化差异。",
    status: "planned",
    accent: "ocean"
  },
  {
    unitId: "geo-7a-chapter6-development-and-cooperation",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第六章",
    chapterName: "第六章 发展与合作",
    title: "发展与合作",
    description: "地区发展差异与国际合作。",
    status: "planned",
    accent: "mint"
  },
  {
    unitId: DEFAULT_UNIT_ID,
    bookCode: "grade7-semester2",
    bookLabel: "七年级下册",
    chapter: "第七章",
    chapterName: "第七章 我们生活的大洲——亚洲",
    title: "我们生活的大洲——亚洲",
    description: "按金版学案接入亚洲位置、分区、地形、气候、人口和经济训练。",
    status: "ready",
    accent: "ocean"
  },
  {
    unitId: "geo-7b-chapter8-neighbour-regions",
    bookCode: "grade7-semester2",
    bookLabel: "七年级下册",
    chapter: "第八章",
    chapterName: "第八章 我们邻近的地区和国家",
    title: "我们邻近的地区和国家",
    description: "日本、东南亚、印度和俄罗斯等区域专题。",
    status: "planned",
    accent: "mint"
  },
  {
    unitId: "geo-7b-chapter9-eastern-hemisphere",
    bookCode: "grade7-semester2",
    bookLabel: "七年级下册",
    chapter: "第九章",
    chapterName: "第九章 东半球其他地区和国家",
    title: "东半球其他地区和国家",
    description: "西亚、欧洲西部、撒哈拉以南非洲与澳大利亚。",
    status: "planned",
    accent: "sand"
  },
  {
    unitId: "geo-7b-chapter10-western-hemisphere",
    bookCode: "grade7-semester2",
    bookLabel: "七年级下册",
    chapter: "第十章",
    chapterName: "第十章 西半球的国家",
    title: "西半球的国家",
    description: "美国与巴西等国家专题训练。",
    status: "planned",
    accent: "slate"
  },
  {
    unitId: "geo-7b-chapter11-polar-regions",
    bookCode: "grade7-semester2",
    bookLabel: "七年级下册",
    chapter: "第十一章",
    chapterName: "第十一章 极地地区",
    title: "极地地区",
    description: "南北极区域特征与比较。",
    status: "planned",
    accent: "ocean"
  }
];

const activeUnits: Record<string, UnitData> = {
  [DEFAULT_UNIT_ID]: asiaUnit as UnitData
};

export function getUnitData(unitId: string) {
  return activeUnits[unitId];
}

export function getReadyUnits() {
  return unitCatalog.filter((unit) => unit.status === "ready");
}

export function getActiveUnitData() {
  return Object.values(activeUnits);
}
