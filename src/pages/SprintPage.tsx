import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TimerReset } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import type { StudyEngine } from "../hooks/useStudyEngine";
import { cn } from "../utils/cn";

export function SprintPage({ engine }: { engine: StudyEngine }) {
  return (
    <AppShell pathname="/sprint">
      <div className="mx-auto max-w-5xl space-y-5">
        <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-ocean-900 text-white">
          <div className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold">
            冲刺包策略
          </div>
          <CardTitle className="text-white">考前这页只做一件事：帮你安排时间</CardTitle>
          <CardDescription className="mt-3 max-w-3xl text-slate-300">
            冲刺包会优先照顾高频知识点、地图题和易错点。当前是纯前端版本，点击后直接回到训练页继续学习。
          </CardDescription>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          {engine.sprintPresets.map((preset, index) => (
            <motion.div
              key={preset.minutes}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, delay: index * 0.06 }}
            >
              <Card className="h-full">
                <div className="mb-4 flex items-center justify-between">
                  <Badge variant={index === 0 ? "default" : index === 1 ? "success" : "sand"}>
                    {preset.minutes} 分钟
                  </Badge>
                  <TimerReset className="h-5 w-5 text-slate-400" />
                </div>
                <CardTitle>{preset.label}</CardTitle>
                <CardDescription className="mt-2">
                  预计完成 {preset.itemCount} 道练习，适合考前快速提分。
                </CardDescription>

                <div className="mt-4 flex flex-wrap gap-2">
                  {preset.focus.map((focus) => (
                    <Badge key={focus} variant="slate">
                      {focus}
                    </Badge>
                  ))}
                </div>

                <div className="mt-6 flex gap-3">
                  <Link
                    to="/review"
                    className={cn(buttonVariants({}), "flex-1")}
                  >
                    开始冲刺
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Sparkles className="h-5 w-5 text-ocean-500" />
            <CardTitle>冲刺建议</CardTitle>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.3rem] bg-ocean-50 p-4">
              <div className="text-sm font-semibold text-ocean-700">30 分钟</div>
              <div className="mt-2 text-sm leading-7 text-slate-700">
                适合午休、晚自习前，优先过一遍待复习点。
              </div>
            </div>
            <div className="rounded-[1.3rem] bg-mint-100 p-4">
              <div className="text-sm font-semibold text-mint-700">60 分钟</div>
              <div className="mt-2 text-sm leading-7 text-slate-700">
                适合周末复盘，地图题和高频点一起抓。
              </div>
            </div>
            <div className="rounded-[1.3rem] bg-sand p-4">
              <div className="text-sm font-semibold text-amber-900">90 分钟</div>
              <div className="mt-2 text-sm leading-7 text-slate-700">
                适合考前总复习，把错题和重点题重新拉齐。
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
