import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Compass,
  MapPinned,
  NotebookPen,
  Sparkles,
  Trophy
} from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { UnitCard } from "../components/study/unit-card";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { cn } from "../utils/cn";
import type { StudyEngine } from "../hooks/useStudyEngine";

const quickActions = [
  {
    key: "review",
    title: "今日复习",
    description: "系统会优先推送到期题目和掌握度较低的内容。",
    to: "/review",
    icon: Sparkles
  },
  {
    key: "mistakes",
    title: "错题本",
    description: "自动记录做错的题目，支持按单元和知识点回看。",
    to: "/mistakes",
    icon: NotebookPen
  },
  {
    key: "maps",
    title: "地图挑战",
    description: "集中练亚洲位置、分区、地形和季风读图。",
    to: "/maps/geo-7b-chapter7-asia",
    icon: MapPinned
  },
  {
    key: "challenge",
    title: "亚洲闯关",
    description: "按六个知识模块分关训练，适合考前冲刺。",
    to: "/sprint",
    icon: Trophy
  }
];

export function HomePage({ engine }: { engine: StudyEngine }) {
  const featuredUnit = engine.featuredUnit;
  const semesterOneUnits = engine.units.filter(
    (unit) => unit.bookCode === "grade7-semester1"
  );
  const semesterTwoUnits = engine.units.filter(
    (unit) => unit.bookCode === "grade7-semester2"
  );

  return (
    <AppShell
      title="GeoMemory 地理训练营"
      subtitle="主界面已经切成“单元训练中心”。当前先完整接入七下第七章《我们生活的大洲——亚洲》，后续新增单元时只需要继续补对应数据和图片。"
      headerAside={
        <div className="rounded-[1.6rem] bg-gradient-to-br from-ocean-500 via-ocean-700 to-mint-500 px-5 py-4 text-white shadow-lg">
          <div className="text-xs uppercase tracking-[0.2em] text-white/72">Study Snapshot</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-white/78">待复习</div>
              <div className="text-3xl font-bold">{engine.stats.dueKnowledge}</div>
            </div>
            <div>
              <div className="text-sm text-white/78">掌握率</div>
              <div className="text-3xl font-bold">{engine.stats.masteryRate}%</div>
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <Card className="bg-ocean-50">
            <div className="text-sm text-ocean-700">今日待复习</div>
            <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.dueKnowledge}</div>
          </Card>
          <Card className="bg-mint-100">
            <div className="text-sm text-mint-700">已掌握知识点</div>
            <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.masteredKnowledge}</div>
          </Card>
          <Card className="bg-amber-50">
            <div className="text-sm text-amber-800">错题数量</div>
            <div className="mt-2 text-3xl font-bold text-ink">{engine.wrongItems.length}</div>
          </Card>
          <Card className="bg-slate-100">
            <div className="text-sm text-slate-600">连续学习天数</div>
            <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.streakDays}</div>
          </Card>
        </motion.section>

        <section>
          <Card className="overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-ocean-900 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge className="mb-3 bg-white/12 text-white">当前主推单元</Badge>
                <h2 className="title-balance text-3xl font-bold sm:text-[2.5rem]">
                  七下第七章《我们生活的大洲——亚洲》
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  这一章已经改成“知识点记忆 + 原题练习 + 地图训练 + 亚洲闯关 + 错题复习”的完整闭环。你后面逐章给我资料时，我们就按同样结构继续挂到这里。
                </p>
              </div>

              <div className="min-w-[220px] rounded-[1.6rem] bg-black/12 p-4 backdrop-blur">
                <div className="text-sm text-white/70">亚洲单元</div>
                <div className="mt-2 text-3xl font-bold">{featuredUnit.masteryRate}%</div>
                <div className="mt-4 rounded-[1.2rem] bg-white/10 px-3 py-3 text-sm text-white/80">
                  <div className="flex items-center justify-between">
                    <span>知识点</span>
                    <span>{featuredUnit.knowledgeCount}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span>原题</span>
                    <span>{featuredUnit.questionCount}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span>地图题</span>
                    <span>{featuredUnit.mapCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/training/${featuredUnit.unitId}`}
                className={cn(buttonVariants({ size: "lg" }), "bg-white text-ink hover:bg-slate-100")}
              >
                <Compass className="mr-2 h-4 w-4" />
                开始训练
              </Link>
              <Link
                to={`/handbook/${featuredUnit.unitId}`}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "bg-white text-ink")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                知识手册
              </Link>
              <Link
                to={`/maps/${featuredUnit.unitId}`}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "bg-white/12 text-white")}
              >
                <MapPinned className="mr-2 h-4 w-4" />
                地图挑战
              </Link>
              <Link
                to="/sprint"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "bg-white/12 text-white")}
              >
                <Trophy className="mr-2 h-4 w-4" />
                亚洲闯关
              </Link>
              <Link
                to="/mistakes"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "bg-white/12 text-white")}
              >
                <NotebookPen className="mr-2 h-4 w-4" />
                错题本
              </Link>
            </div>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link key={action.key} to={action.to}>
                <Card className="h-full transition hover:-translate-y-1 hover:border-ocean-200">
                  <div className="mb-4 inline-flex rounded-2xl bg-ocean-50 p-3 text-ocean-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{action.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm leading-7">
                    {action.description}
                  </CardDescription>
                </Card>
              </Link>
            );
          })}
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-ink">当前可训练单元</h3>
              <p className="mt-1 text-sm text-slate-600">
                先把“亚洲”这一章做完整，后续章节继续按单元卡片接入。
              </p>
            </div>
            <Link
              to="/units"
              className={cn(buttonVariants({ variant: "secondary" }), "hidden sm:inline-flex")}
            >
              查看全部单元
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <UnitCard unit={featuredUnit} featured />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>七年级上册</CardTitle>
                <CardDescription className="mt-2">
                  这些入口已经预留好，后续只要补单元 JSON 和原图素材就能挂上来。
                </CardDescription>
              </div>
              <Badge variant="slate">{semesterOneUnits.length} 个入口</Badge>
            </div>

            <div className="mt-5 space-y-3">
              {semesterOneUnits.map((unit) => (
                <Link
                  key={unit.unitId}
                  to={`/unit/${unit.unitId}`}
                  className="flex items-center justify-between rounded-[1.25rem] border border-slate-200/80 bg-white/80 px-4 py-4 transition hover:border-ocean-200 hover:bg-slate-50"
                >
                  <div>
                    <div className="text-sm text-slate-500">{unit.chapter}</div>
                    <div className="mt-1 font-semibold text-ink">{unit.title}</div>
                  </div>
                  <Badge variant="slate">待接入</Badge>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>七年级下册</CardTitle>
                <CardDescription className="mt-2">
                  亚洲单元已经接入原题和原图，后续其他章节保持相同接口继续扩展。
                </CardDescription>
              </div>
              <Badge variant="success">亚洲已上线</Badge>
            </div>

            <div className="mt-5 space-y-3">
              {semesterTwoUnits.map((unit) => (
                <Link
                  key={unit.unitId}
                  to={`/unit/${unit.unitId}`}
                  className={cn(
                    "flex items-center justify-between rounded-[1.25rem] border px-4 py-4 transition",
                    unit.ready
                      ? "border-ocean-200 bg-ocean-50/75 hover:bg-ocean-50"
                      : "border-slate-200/80 bg-white/80 hover:bg-slate-50"
                  )}
                >
                  <div>
                    <div className="text-sm text-slate-500">{unit.chapter}</div>
                    <div className="mt-1 font-semibold text-ink">{unit.title}</div>
                  </div>
                  <Badge variant={unit.ready ? "success" : "slate"}>
                    {unit.ready ? "可训练" : "待接入"}
                  </Badge>
                </Link>
              ))}
            </div>
          </Card>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardTitle>学习概况</CardTitle>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[1.3rem] bg-ocean-50 p-4">
                <div className="text-sm text-ocean-700">知识点总数</div>
                <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.totalKnowledge}</div>
              </div>
              <div className="rounded-[1.3rem] bg-mint-100 p-4">
                <div className="text-sm text-mint-700">地图掌握率</div>
                <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.mapMasteryRate}%</div>
              </div>
              <div className="rounded-[1.3rem] bg-slate-100 p-4">
                <div className="text-sm text-slate-600">原题数量</div>
                <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.totalQuestions}</div>
              </div>
              <div className="rounded-[1.3rem] bg-sand p-4">
                <div className="text-sm text-amber-900">累计学习时长</div>
                <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.totalMinutes} 分钟</div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>结构方向</CardTitle>
                <CardDescription className="mt-2">
                  现在的主 UI 已经按“单元训练中心”组织。后续你给我新的课件或题目资料时，我会继续往单元数据里补，不再重做页面。
                </CardDescription>
              </div>
              <BookOpen className="h-6 w-6 text-ocean-500" />
            </div>

            <div className="mt-5 rounded-[1.25rem] bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              当前已完成的一章是《我们生活的大洲——亚洲》。这章已经具备：知识卡片、原题训练、地图挑战、错题记录、掌握度更新和亚洲闯关。后续每个新单元只要补资料，就能沿用这一套结构。
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
