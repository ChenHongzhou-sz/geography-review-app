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

function buildQuickActions(featuredUnit: StudyEngine["featuredUnit"]) {
  return [
    {
      key: "review",
      title: "今日复习",
      description: "系统会优先推送到期内容和掌握度较低的题目。",
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
      title: featuredUnit.mapCount > 0 ? "地图挑战" : "地图待接入",
      description:
        featuredUnit.mapCount > 0
          ? "地图入口会跟随你最近进入的单元一起切换。"
          : "这个单元暂时还没有地图题，先用知识手册和训练题推进。",
      to: featuredUnit.mapCount > 0 ? `/maps/${featuredUnit.unitId}` : `/unit/${featuredUnit.unitId}`,
      icon: MapPinned
    },
    {
      key: "challenge",
      title: "单元闯关",
      description: "闯关内容也会跟随当前主推单元自动切换。",
      to: "/sprint",
      icon: Trophy
    }
  ];
}

export function HomePage({ engine }: { engine: StudyEngine }) {
  const featuredUnit = engine.featuredUnit;
  const featuredUnitTitle = `${featuredUnit.chapter}《${featuredUnit.title}》`;
  const featuredMapLink =
    featuredUnit.mapCount > 0 ? `/maps/${featuredUnit.unitId}` : `/unit/${featuredUnit.unitId}`;
  const featuredMapLabel = featuredUnit.mapCount > 0 ? "地图挑战" : "查看单元";
  const featuredSummary = featuredUnit.ready
    ? "首页主推现在会跟随你最后进入的单元切换。当前这个单元已经接入知识手册、训练题、错题记录和闯关流程，可以直接继续往下学。"
    : "首页主推现在会跟随你最后进入的单元切换。当前这个单元入口已经预留，后面补完资料后就能直接复用这套训练界面。";
  const quickActions = buildQuickActions(featuredUnit);
  const semesterOneUnits = engine.units.filter(
    (unit) => unit.bookCode === "grade7-semester1"
  );
  const semesterTwoUnits = engine.units.filter(
    (unit) => unit.bookCode === "grade7-semester2"
  );
  const semesterOneReadyCount = semesterOneUnits.filter((unit) => unit.ready).length;
  const semesterTwoReadyCount = semesterTwoUnits.filter((unit) => unit.ready).length;

  return (
    <AppShell
      title="GeoMemory 地理训练营"
      subtitle="主界面已经改成按单元组织。你最近进入哪个单元，首页主推区就会跟着切到哪个单元。"
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
                  {featuredUnitTitle}
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  {featuredSummary}
                </p>
              </div>

              <div className="min-w-[220px] rounded-[1.6rem] bg-black/12 p-4 backdrop-blur">
                <div className="text-sm text-white/70">当前单元</div>
                <div className="mt-2 text-3xl font-bold">{featuredUnit.masteryRate}%</div>
                <div className="mt-4 rounded-[1.2rem] bg-white/10 px-3 py-3 text-sm text-white/80">
                  <div className="flex items-center justify-between">
                    <span>知识点</span>
                    <span>{featuredUnit.knowledgeCount}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span>训练题</span>
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
              {featuredUnit.ready ? (
                <>
                  <Link
                    to={`/training/${featuredUnit.unitId}`}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "bg-white text-ink hover:bg-slate-100"
                    )}
                  >
                    <Compass className="mr-2 h-4 w-4" />
                    开始训练
                  </Link>
                  <Link
                    to={`/handbook/${featuredUnit.unitId}`}
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "bg-white text-ink"
                    )}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    知识手册
                  </Link>
                  <Link
                    to={featuredMapLink}
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "bg-white/12 text-white"
                    )}
                  >
                    <MapPinned className="mr-2 h-4 w-4" />
                    {featuredMapLabel}
                  </Link>
                  <Link
                    to="/sprint"
                    className={cn(
                      buttonVariants({ variant: "secondary", size: "lg" }),
                      "bg-white/12 text-white"
                    )}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    单元闯关
                  </Link>
                </>
              ) : (
                <Link
                  to={`/unit/${featuredUnit.unitId}`}
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-white text-ink hover:bg-slate-100"
                  )}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  查看单元
                </Link>
              )}
              <Link
                to="/mistakes"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "lg" }),
                  "bg-white/12 text-white"
                )}
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
              <h3 className="text-xl font-semibold text-ink">当前主推单元</h3>
              <p className="mt-1 text-sm text-slate-600">
                这里会展示你最近进入的单元，方便回到刚才正在整理或训练的内容。
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
                  已接入单元会直接复用当前这套知识手册、训练、错题和闯关流程。
                </CardDescription>
              </div>
              <Badge variant="success">{semesterOneReadyCount} 个已接入</Badge>
            </div>

            <div className="mt-5 space-y-3">
              {semesterOneUnits.map((unit) => (
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

          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>七年级下册</CardTitle>
                <CardDescription className="mt-2">
                  已接入单元会直接复用当前这套知识手册、训练、错题和闯关流程。
                </CardDescription>
              </div>
              <Badge variant="success">{semesterTwoReadyCount} 个已接入</Badge>
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
                <div className="text-sm text-slate-600">训练题数量</div>
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
                <CardTitle>当前结构</CardTitle>
                <CardDescription className="mt-2">
                  首页主推、快捷入口和闯关都会优先跟随你最近进入的单元，不再固定卡在第七章。
                </CardDescription>
              </div>
              <BookOpen className="h-6 w-6 text-ocean-500" />
            </div>

            <div className="mt-5 rounded-[1.25rem] bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              你后面继续补新单元时，不需要再重做首页结构。只要单元数据接入完成，这里就会自然切换到你最近打开的那一章。
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
