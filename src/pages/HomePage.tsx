import { motion } from "framer-motion";
import { ArrowRight, BookOpen, MapPinned, NotebookPen, Sparkles, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { UnitCard } from "../components/study/unit-card";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { cn } from "../utils/cn";
import type { StudyEngine } from "../hooks/useStudyEngine";

const actionIcons = {
  review: Sparkles,
  mistakes: NotebookPen,
  maps: MapPinned,
  sprint: TimerReset
};

export function HomePage({ engine }: { engine: StudyEngine }) {
  const featuredUnit = engine.featuredUnit;
  const semesterOneUnits = engine.units.filter((unit) => unit.bookCode === "七上");
  const semesterTwoUnits = engine.units.filter((unit) => unit.bookCode === "七下");
  const actions = [
    {
      key: "review" as const,
      to: "/review",
      title: "今日复习",
      description: `系统已为你整理好 ${engine.stats.dueKnowledge} 个待复习知识点`
    },
    {
      key: "mistakes" as const,
      to: "/mistakes",
      title: "错题本",
      description: `${engine.wrongItems.length} 个易错点等待回炉`
    },
    {
      key: "maps" as const,
      to: `/maps/${featuredUnit.unitId}`,
      title: "地图挑战",
      description: `${featuredUnit.mapCount} 道当前单元识图题随时开练`
    },
    {
      key: "sprint" as const,
      to: "/sprint",
      title: "考前冲刺",
      description: "30 / 60 / 90 分钟训练包已经预留"
    }
  ];

  return (
    <AppShell
      title="单元训练中心"
      subtitle="先把首页做成一个可长期扩展的学习入口。以后每新增一个单元，只需要补一份数据文件和图片资源，就能挂到这里。"
      headerAside={
        <div className="rounded-[1.6rem] bg-gradient-to-br from-ocean-500 via-ocean-700 to-mint-500 px-5 py-4 text-white shadow-lg">
          <div className="text-xs uppercase tracking-[0.2em] text-white/72">Live Summary</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-white/78">已接入单元</div>
              <div className="text-3xl font-bold">{engine.stats.readyUnits}</div>
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
        >
          <Card className="overflow-hidden bg-gradient-to-br from-ocean-900 via-ocean-700 to-mint-600 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge className="mb-3 bg-white/12 text-white">GeoMemory Dashboard</Badge>
                <h2 className="title-balance text-3xl font-bold sm:text-[2.6rem]">
                  当前先完成亚洲单元，后续单元像模块一样持续挂接
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-white/80 sm:text-base">
                  首页先承担三件事：帮学生马上进入复习、看见单元地图、知道下一章以后要接到哪里。现在的训练主线已经切到“单元”维度，而不是单一题库页面。
                </p>
              </div>

              <div className="min-w-[220px] rounded-[1.6rem] bg-black/12 p-4 backdrop-blur">
                <div className="text-sm text-white/70">今日状态</div>
                <div className="mt-2 text-3xl font-bold">{engine.stats.dueKnowledge} 待复习</div>
                <div className="mt-4 rounded-[1.2rem] bg-white/10 px-3 py-3">
                  <div className="flex items-center justify-between text-sm text-white/80">
                    <span>连续学习</span>
                    <span>{engine.stats.streakDays} 天</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-white/80">
                    <span>今日时长</span>
                    <span>{engine.stats.todayMinutes} 分钟</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {actions.map((action) => {
                const Icon = actionIcons[action.key];

                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="rounded-[1.5rem] border border-white/14 bg-white/10 p-4 transition-transform hover:-translate-y-1"
                  >
                    <div className="mb-3 inline-flex rounded-2xl bg-white/14 p-3 text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-lg font-semibold">{action.title}</div>
                    <div className="mt-1 text-sm leading-6 text-white/78">{action.description}</div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </motion.section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-ink">当前主推单元</h3>
              <p className="mt-1 text-sm text-slate-600">
                第一个完成可训练闭环的模块，先把“亚洲”这章做顺，再继续扩章。
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

        <section className="grid gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          <Card>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>七年级上册</CardTitle>
                <CardDescription className="mt-2">
                  这些章节的入口已经预留好了，后续只需要按单元补充数据文件。
                </CardDescription>
              </div>
              <Badge variant="slate">{semesterOneUnits.length} 个章节入口</Badge>
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
                  亚洲单元已经可训练，后续章节保持相同数据接口继续挂入。
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
                <div className="text-sm text-ocean-700">已掌握知识点</div>
                <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.masteredKnowledge}</div>
              </div>
              <div className="rounded-[1.3rem] bg-mint-100 p-4">
                <div className="text-sm text-mint-700">地图掌握率</div>
                <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.mapMasteryRate}%</div>
              </div>
              <div className="rounded-[1.3rem] bg-slate-100 p-4">
                <div className="text-sm text-slate-600">总知识点</div>
                <div className="mt-2 text-3xl font-bold text-ink">{engine.stats.totalKnowledge}</div>
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
                <CardTitle>架构方向</CardTitle>
                <CardDescription className="mt-2">
                  现在的界面已经按照“主 UI + 单元模块”的方式组织，后续继续接 JSON 就能扩展。
                </CardDescription>
              </div>
              <BookOpen className="h-6 w-6 text-ocean-500" />
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>当前接入进度</span>
                  <span>
                    {engine.stats.readyUnits} / {engine.stats.totalUnits}
                  </span>
                </div>
                <Progress
                  value={(engine.stats.readyUnits / Math.max(engine.stats.totalUnits, 1)) * 100}
                />
              </div>

              <div className="rounded-[1.25rem] bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                当前我们先把首页、单元页、单元训练页、地图挑战页和错题本串起来。等你后续补其它章节时，只要按同样结构新增单元数据，就不需要再改主 UI。
              </div>

              <button
                type="button"
                onClick={engine.clearProgress}
                className={cn(buttonVariants({ variant: "secondary" }), "w-full sm:w-auto")}
              >
                重置演示进度
              </button>
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
