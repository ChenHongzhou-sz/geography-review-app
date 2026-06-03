import { motion } from "framer-motion";
import { ArrowRight, Brain, Flame, MapPinned, NotebookPen, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { cn } from "../utils/cn";
import type { StudyEngine } from "../hooks/useStudyEngine";

const ratioRows = [
  { label: "选择题", value: 40 },
  { label: "地图题", value: 25 },
  { label: "记忆卡片", value: 20 },
  { label: "判断题", value: 10 },
  { label: "填空题", value: 5 }
];

const actions = [
  {
    to: "/review",
    title: "开始训练",
    description: "自动混合抽题，直接进入主流程",
    icon: Brain,
    accent: "from-ocean-500 to-ocean-700"
  },
  {
    to: "/map",
    title: "地图挑战",
    description: "真实原图地图题与区域识别题",
    icon: MapPinned,
    accent: "from-mint-500 to-mint-700"
  },
  {
    to: "/mistakes",
    title: "错题重练",
    description: "先消灭最近最容易失分的点",
    icon: NotebookPen,
    accent: "from-amber-400 to-orange-500"
  },
  {
    to: "/sprint",
    title: "考前冲刺",
    description: "30 / 60 / 90 分钟节奏包",
    icon: TimerReset,
    accent: "from-sky-500 to-cyan-500"
  }
];

export function HomePage({ engine }: { engine: StudyEngine }) {
  return (
    <AppShell pathname="/">
      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="space-y-5"
        >
          <Card className="overflow-hidden bg-gradient-to-br from-ocean-900 via-ocean-700 to-mint-600 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Badge className="mb-3 bg-white/12 text-white" variant="default">
                  今日节奏
                </Badge>
                <h2 className="title-balance text-3xl font-bold sm:text-[2.55rem]">
                  今日待复习 {engine.stats.dueKnowledge} 个知识点
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-white/80">
                  打开就练，不找章节，不翻教材。系统已经按复习周期把今天最值得练的题混好了。
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/72">
                  当前题库包含 {engine.knowledgeBase.length} 条知识卡片与 {engine.mapChallenges.length} 组真实地图题，手机和 iPad 都按低重复节奏来出题。
                </p>
              </div>

              <div className="grid min-w-[210px] gap-3 rounded-[1.7rem] bg-white/12 p-4 backdrop-blur">
                <div>
                  <div className="text-sm text-white/70">掌握率</div>
                  <div className="text-3xl font-bold">{engine.stats.masteryRate}%</div>
                </div>
                <div className="flex items-center justify-between rounded-[1.2rem] bg-black/10 px-3 py-2">
                  <span className="text-sm text-white/80">连续学习</span>
                  <span className="flex items-center gap-1 text-base font-semibold">
                    <Flame className="h-4 w-4" />
                    {engine.stats.streakDays} 天
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {actions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className={cn(
                      "rounded-[1.5rem] bg-white/10 p-4 transition-transform hover:-translate-y-1",
                      "border border-white/10"
                    )}
                  >
                    <div
                      className={cn(
                        "mb-3 inline-flex rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg",
                        action.accent
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-lg font-semibold">{action.title}</div>
                    <div className="mt-1 text-sm leading-6 text-white/78">
                      {action.description}
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card>
              <CardTitle>今日训练配比</CardTitle>
              <CardDescription className="mt-2">
                按 PRD 的学习节奏，优先覆盖选择题和地图题。
              </CardDescription>
              <div className="mt-5 space-y-4">
                {ratioRows.map((row) => (
                  <div key={row.label}>
                    <div className="mb-2 flex items-center justify-between text-sm font-medium">
                      <span>{row.label}</span>
                      <span>{row.value}%</span>
                    </div>
                    <Progress value={row.value} />
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardTitle>学习概况</CardTitle>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-[1.3rem] bg-ocean-50 p-4">
                  <div className="text-sm text-ocean-700">已掌握知识点</div>
                  <div className="mt-2 text-3xl font-bold text-ink">
                    {engine.stats.masteredKnowledge}
                  </div>
                </div>
                <div className="rounded-[1.3rem] bg-mint-100 p-4">
                  <div className="text-sm text-mint-700">地图掌握率</div>
                  <div className="mt-2 text-3xl font-bold text-ink">
                    {engine.stats.mapMasteryRate}%
                  </div>
                </div>
                <div className="rounded-[1.3rem] bg-slate-100 p-4">
                  <div className="text-sm text-slate-600">今日学习时间</div>
                  <div className="mt-2 text-3xl font-bold text-ink">
                    {engine.stats.todayMinutes} 分钟
                  </div>
                </div>
                <div className="rounded-[1.3rem] bg-sand p-4">
                  <div className="text-sm text-amber-900">累计学习时长</div>
                  <div className="mt-2 text-3xl font-bold text-ink">
                    {engine.stats.totalMinutes} 分钟
                  </div>
                </div>
              </div>
              <CardDescription className="mt-4">
                地图题当前优先使用教材与课件抽取的原图，未接入 AI 生成地图。
              </CardDescription>
            </Card>
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.05 }}
          className="space-y-5"
        >
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <CardTitle>章节掌握率</CardTitle>
                <CardDescription className="mt-1">
                  先看哪里最需要补。
                </CardDescription>
              </div>
              <Badge variant="success">共 {engine.chapters.length} 章</Badge>
            </div>

            <div className="space-y-4">
              {engine.stats.chapterRates.map((chapter) => (
                <div key={chapter.chapter} className="rounded-[1.2rem] bg-slate-50 p-4">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-ink">{chapter.chapter}</div>
                      <div className="text-xs text-slate-500">{chapter.book}</div>
                    </div>
                    <div className="text-sm font-semibold text-slate-600">
                      待复习 {chapter.dueCount}
                    </div>
                  </div>
                  <Progress value={chapter.masteryRate} />
                  <div className="mt-2 text-right text-sm font-medium text-ocean-700">
                    {chapter.masteryRate}%
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardTitle>章节浏览</CardTitle>
            <CardDescription className="mt-2">
              这里只做查阅，不做冗长阅读。
            </CardDescription>
            <div className="mt-4 space-y-3">
              {engine.chapters.map((chapter) => (
                <details
                  key={chapter.chapter}
                  className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-3"
                >
                  <summary className="cursor-pointer list-none font-semibold text-ink">
                    {chapter.chapter}
                  </summary>
                  <div className="mt-3 text-sm leading-7 text-slate-600">
                    <div>{chapter.pageSpan}</div>
                    <div>{chapter.sections.join(" / ")}</div>
                  </div>
                </details>
              ))}
            </div>
          </Card>

          <Card className="bg-slate-950 text-white">
            <CardTitle className="text-white">演示数据说明</CardTitle>
            <CardDescription className="mt-2 text-slate-300">
              当前首页和训练流已经接入扩充后的知识卡片、真实地图题和演示进度，方便先看交互。
            </CardDescription>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/review"
                  className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
                >
                  立即开始
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={engine.clearProgress}
                  className={cn(
                    buttonVariants({
                      variant: "secondary"
                    }),
                    "w-full sm:w-auto"
                  )}
                >
                  重置演示进度
                </button>
              </div>
          </Card>
        </motion.aside>
      </div>
    </AppShell>
  );
}
