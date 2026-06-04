import { ArrowRight, Sparkles, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { cn } from "../utils/cn";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function SprintPage({ engine }: { engine: StudyEngine }) {
  return (
    <AppShell
      title="考前冲刺"
      subtitle="冲刺页先作为训练节奏入口保留下来。现在默认围绕亚洲单元组织，后续多个单元上线后也可以继续复用这套结构。"
      headerAside={
        <div className="rounded-[1.5rem] bg-slate-950 px-5 py-4 text-white">
          <div className="text-sm text-slate-300">当前主单元</div>
          <div className="mt-2 text-2xl font-bold">{engine.featuredUnit.title}</div>
        </div>
      }
    >
      <div className="mx-auto max-w-5xl space-y-5">
        <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-ocean-900 text-white">
          <div className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold">
            冲刺训练策略
          </div>
          <CardTitle className="text-white">考前这页先帮你安排训练节奏</CardTitle>
          <CardDescription className="mt-3 max-w-3xl text-slate-300">
            当前版本先把冲刺包和单元训练打通，方便学生在短时间内集中完成亚洲单元的高频知识、地图题和错题回炉。
          </CardDescription>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {engine.sprintPresets.map((preset, index) => (
            <Card key={preset.minutes} className="h-full">
              <div className="mb-4 flex items-center justify-between">
                <Badge variant={index === 0 ? "default" : index === 1 ? "success" : "sand"}>
                  {preset.minutes} 分钟
                </Badge>
                <TimerReset className="h-5 w-5 text-slate-400" />
              </div>
              <CardTitle>{preset.label}</CardTitle>
              <CardDescription className="mt-2">
                预估完成 {preset.itemCount} 个训练项目，适合考前按时长快速切换任务。
              </CardDescription>

              <div className="mt-4 flex flex-wrap gap-2">
                {preset.focus.map((focus) => (
                  <Badge key={focus} variant="slate">
                    {focus}
                  </Badge>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  to={`/training/${engine.featuredUnit.unitId}`}
                  className={cn(buttonVariants({ size: "lg" }), "w-full")}
                >
                  开始冲刺
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-ocean-500" />
            <CardTitle>使用建议</CardTitle>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.3rem] bg-ocean-50 p-4">
              <div className="text-sm font-semibold text-ocean-700">30 分钟</div>
              <div className="mt-2 text-sm leading-7 text-slate-700">
                适合课间或晚自习前，先把待复习知识点快速过一轮。
              </div>
            </div>
            <div className="rounded-[1.3rem] bg-mint-100 p-4">
              <div className="text-sm font-semibold text-mint-700">60 分钟</div>
              <div className="mt-2 text-sm leading-7 text-slate-700">
                适合周末强化，把地图题和错题本一起带上。
              </div>
            </div>
            <div className="rounded-[1.3rem] bg-sand p-4">
              <div className="text-sm font-semibold text-amber-900">90 分钟</div>
              <div className="mt-2 text-sm leading-7 text-slate-700">
                适合考前总复习，完整串联本章知识框架与识图能力。
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
