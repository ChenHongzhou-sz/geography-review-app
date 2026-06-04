import earthUnitBase from "./geo-7a-chapter1-earth.json";
import earthKnowledge from "./geo-7a-chapter1-earth/knowledge.json";
import earthQuestions from "./geo-7a-chapter1-earth/questions.json";
import earthMaps from "./geo-7a-chapter1-earth/maps.json";
import mapsUnitBase from "./geo-7a-chapter2-maps.json";
import mapsKnowledge from "./geo-7a-chapter2-maps/knowledge.json";
import mapsQuestions from "./geo-7a-chapter2-maps/questions.json";
import mapsMaps from "./geo-7a-chapter2-maps/maps.json";
import landSeaUnitBase from "./geo-7a-chapter3-land-and-sea.json";
import landSeaKnowledge from "./geo-7a-chapter3-land-and-sea/knowledge.json";
import landSeaQuestions from "./geo-7a-chapter3-land-and-sea/questions.json";
import landSeaMaps from "./geo-7a-chapter3-land-and-sea/maps.json";
import weatherClimateUnitBase from "./geo-7a-chapter4-weather-and-climate.json";
import weatherClimateKnowledge from "./geo-7a-chapter4-weather-and-climate/knowledge.json";
import weatherClimateQuestions from "./geo-7a-chapter4-weather-and-climate/questions.json";
import weatherClimateMaps from "./geo-7a-chapter4-weather-and-climate/maps.json";
import peopleCultureUnitBase from "./geo-7a-chapter5-people-and-culture.json";
import peopleCultureKnowledge from "./geo-7a-chapter5-people-and-culture/knowledge.json";
import peopleCultureQuestions from "./geo-7a-chapter5-people-and-culture/questions.json";
import peopleCultureMaps from "./geo-7a-chapter5-people-and-culture/maps.json";
import developmentCooperationUnitBase from "./geo-7a-chapter6-development-and-cooperation.json";
import developmentCooperationKnowledge from "./geo-7a-chapter6-development-and-cooperation/knowledge.json";
import developmentCooperationQuestions from "./geo-7a-chapter6-development-and-cooperation/questions.json";
import developmentCooperationMaps from "./geo-7a-chapter6-development-and-cooperation/maps.json";
import asiaUnitBase from "./geo-7b-chapter7-asia.json";
import asiaKnowledge from "./geo-7b-chapter7-asia/knowledge.json";
import asiaQuestions from "./geo-7b-chapter7-asia/questions.json";
import asiaMaps from "./geo-7b-chapter7-asia/maps.json";
import neighbourUnitBase from "./geo-7b-chapter8-neighbour-regions.json";
import neighbourKnowledge from "./geo-7b-chapter8-neighbour-regions/knowledge.json";
import neighbourQuestions from "./geo-7b-chapter8-neighbour-regions/questions.json";
import neighbourMaps from "./geo-7b-chapter8-neighbour-regions/maps.json";
import easternHemisphereUnitBase from "./geo-7b-chapter9-eastern-hemisphere.json";
import easternHemisphereKnowledge from "./geo-7b-chapter9-eastern-hemisphere/knowledge.json";
import easternHemisphereQuestions from "./geo-7b-chapter9-eastern-hemisphere/questions.json";
import easternHemisphereMaps from "./geo-7b-chapter9-eastern-hemisphere/maps.json";
import westernHemisphereUnitBase from "./geo-7b-chapter10-western-hemisphere.json";
import westernHemisphereKnowledge from "./geo-7b-chapter10-western-hemisphere/knowledge.json";
import westernHemisphereQuestions from "./geo-7b-chapter10-western-hemisphere/questions.json";
import westernHemisphereMaps from "./geo-7b-chapter10-western-hemisphere/maps.json";
import polarRegionsUnitBase from "./geo-7b-chapter11-polar-regions.json";
import polarRegionsKnowledge from "./geo-7b-chapter11-polar-regions/knowledge.json";
import polarRegionsQuestions from "./geo-7b-chapter11-polar-regions/questions.json";
import polarRegionsMaps from "./geo-7b-chapter11-polar-regions/maps.json";
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
    description: "按金版学案接入宇宙环境、地球仪、经纬网和地球运动的知识手册与真题训练。",
    status: "ready",
    accent: "ocean"
  },
  {
    unitId: "geo-7a-chapter2-maps",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第二章",
    chapterName: "第二章 地图",
    title: "地图",
    description: "按金版学案接入地图阅读、地形图判读、选图应用和综合提升训练。",
    status: "ready",
    accent: "mint"
  },
  {
    unitId: "geo-7a-chapter3-land-and-sea",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第三章",
    chapterName: "第三章 陆地和海洋",
    title: "陆地和海洋",
    description: "按金版学案接入海陆分布、大洲大洋、世界地形与海陆变迁训练。",
    status: "ready",
    accent: "sand"
  },
  {
    unitId: "geo-7a-chapter4-weather-and-climate",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第四章",
    chapterName: "第四章 天气与气候",
    title: "天气与气候",
    description: "按金版学案接入天气、气温、降水、气候类型与气候因素全章训练。",
    status: "ready",
    accent: "slate"
  },
  {
    unitId: "geo-7a-chapter5-people-and-culture",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第五章",
    chapterName: "第五章 居民与文化",
    title: "居民与文化",
    description: "按金版学案接入人口、人种、聚落、语言宗教与民居文化训练。",
    status: "ready",
    accent: "ocean"
  },
  {
    unitId: "geo-7a-chapter6-development-and-cooperation",
    bookCode: "grade7-semester1",
    bookLabel: "七年级上册",
    chapter: "第六章",
    chapterName: "第六章 发展与合作",
    title: "发展与合作",
    description: "按金版学案接入国家发展差异、经济全球化和国际合作训练。",
    status: "ready",
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
    status: "ready",
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
    status: "ready",
    accent: "sand"
  },
  {
    unitId: "geo-7b-chapter10-western-hemisphere",
    bookCode: "grade7-semester2",
    bookLabel: "七年级下册",
    chapter: "第十章",
    chapterName: "第十章 西半球的国家",
    title: "西半球的国家",
    description: "按金版学案接入美国与巴西的知识手册、真题训练和综合提升。",
    status: "ready",
    accent: "slate"
  },
  {
    unitId: "geo-7b-chapter11-polar-regions",
    bookCode: "grade7-semester2",
    bookLabel: "七年级下册",
    chapter: "第十一章",
    chapterName: "第十一章 极地地区",
    title: "极地地区",
    description: "按金版学案接入南北极地区的知识手册、真题训练和综合提升。",
    status: "ready",
    accent: "ocean"
  }
];

const earthUnit: UnitData = {
  ...(earthUnitBase as UnitData),
  knowledgePoints: earthKnowledge as UnitData["knowledgePoints"],
  questions: earthQuestions as UnitData["questions"],
  maps: earthMaps as UnitData["maps"]
};

const mapsUnit: UnitData = {
  ...(mapsUnitBase as UnitData),
  knowledgePoints: mapsKnowledge as UnitData["knowledgePoints"],
  questions: mapsQuestions as UnitData["questions"],
  maps: mapsMaps as UnitData["maps"]
};

const landSeaUnit: UnitData = {
  ...(landSeaUnitBase as UnitData),
  knowledgePoints: landSeaKnowledge as UnitData["knowledgePoints"],
  questions: landSeaQuestions as UnitData["questions"],
  maps: landSeaMaps as UnitData["maps"]
};

const weatherClimateUnit: UnitData = {
  ...(weatherClimateUnitBase as UnitData),
  knowledgePoints: weatherClimateKnowledge as UnitData["knowledgePoints"],
  questions: weatherClimateQuestions as UnitData["questions"],
  maps: weatherClimateMaps as UnitData["maps"]
};

const peopleCultureUnit: UnitData = {
  ...(peopleCultureUnitBase as UnitData),
  knowledgePoints: peopleCultureKnowledge as UnitData["knowledgePoints"],
  questions: peopleCultureQuestions as UnitData["questions"],
  maps: peopleCultureMaps as UnitData["maps"]
};

const developmentCooperationUnit: UnitData = {
  ...(developmentCooperationUnitBase as UnitData),
  knowledgePoints: developmentCooperationKnowledge as UnitData["knowledgePoints"],
  questions: developmentCooperationQuestions as UnitData["questions"],
  maps: developmentCooperationMaps as UnitData["maps"]
};

const asiaUnit: UnitData = {
  ...(asiaUnitBase as UnitData),
  knowledgePoints: asiaKnowledge as UnitData["knowledgePoints"],
  questions: asiaQuestions as UnitData["questions"],
  maps: asiaMaps as UnitData["maps"]
};

const neighbourUnit: UnitData = {
  ...(neighbourUnitBase as UnitData),
  knowledgePoints: neighbourKnowledge as UnitData["knowledgePoints"],
  questions: neighbourQuestions as UnitData["questions"],
  maps: neighbourMaps as UnitData["maps"]
};

const easternHemisphereUnit: UnitData = {
  ...(easternHemisphereUnitBase as UnitData),
  knowledgePoints: easternHemisphereKnowledge as UnitData["knowledgePoints"],
  questions: easternHemisphereQuestions as UnitData["questions"],
  maps: easternHemisphereMaps as UnitData["maps"]
};

const westernHemisphereUnit: UnitData = {
  ...(westernHemisphereUnitBase as UnitData),
  knowledgePoints: westernHemisphereKnowledge as UnitData["knowledgePoints"],
  questions: westernHemisphereQuestions as UnitData["questions"],
  maps: westernHemisphereMaps as UnitData["maps"]
};

const polarRegionsUnit: UnitData = {
  ...(polarRegionsUnitBase as UnitData),
  knowledgePoints: polarRegionsKnowledge as UnitData["knowledgePoints"],
  questions: polarRegionsQuestions as UnitData["questions"],
  maps: polarRegionsMaps as UnitData["maps"]
};

const activeUnits: Record<string, UnitData> = {
  [earthUnit.unitId]: earthUnit,
  [mapsUnit.unitId]: mapsUnit,
  [landSeaUnit.unitId]: landSeaUnit,
  [weatherClimateUnit.unitId]: weatherClimateUnit,
  [peopleCultureUnit.unitId]: peopleCultureUnit,
  [developmentCooperationUnit.unitId]: developmentCooperationUnit,
  [DEFAULT_UNIT_ID]: asiaUnit,
  [neighbourUnit.unitId]: neighbourUnit,
  [easternHemisphereUnit.unitId]: easternHemisphereUnit,
  [westernHemisphereUnit.unitId]: westernHemisphereUnit,
  [polarRegionsUnit.unitId]: polarRegionsUnit
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
