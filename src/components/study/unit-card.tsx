import { ArrowRight, Compass, Lock, MapPinned } from "lucide-react";
import { Link } from "react-router-dom";
import type { UnitSummary } from "../../types";
import { Badge } from "../ui/badge";
import { buttonVariants } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { cn } from "../../utils/cn";

const accentStyles: Record<UnitSummary["accent"], string> = {
  ocean: "from-ocean-600/14 via-white to-ocean-50",
  mint: "from-mint-300/16 via-white to-mint-100/50",
  sand: "from-amber-200/30 via-white to-sand",
  slate: "from-slate-200/40 via-white to-slate-50"
};

export function UnitCard({
  unit,
  featured = false
}: {
  unit: UnitSummary;
  featured?: boolean;
}) {
  return (
    <Card
      className={cn(
        "h-full bg-gradient-to-br",
        accentStyles[unit.accent],
        featured && "border-ocean-200 shadow-[0_24px_64px_rgba(18,88,200,0.16)]"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{unit.bookLabel}</Badge>
            <Badge variant={unit.ready ? "success" : "slate"}>
              {unit.ready ? "已接入" : "规划中"}
            </Badge>
          </div>
          <CardTitle className="mt-4 text-xl sm:text-2xl">
            {unit.chapter} {unit.title}
          </CardTitle>
          <CardDescription className="mt-2 max-w-2xl text-sm sm:text-base">
            {unit.description}
          </CardDescription>
        </div>

        <div className="rounded-[1.4rem] bg-white/90 px-4 py-3 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Mastery
          </div>
          <div className="mt-2 text-3xl font-bold text-ink">{unit.masteryRate}%</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-[1.2rem] bg-white/82 p-4">
          <div className="text-xs text-slate-500">知识点</div>
          <div className="mt-2 text-2xl font-bold text-ink">{unit.knowledgeCount}</div>
        </div>
        <div className="rounded-[1.2rem] bg-white/82 p-4">
          <div className="text-xs text-slate-500">训练题</div>
          <div className="mt-2 text-2xl font-bold text-ink">{unit.questionCount}</div>
        </div>
        <div className="rounded-[1.2rem] bg-white/82 p-4">
          <div className="text-xs text-slate-500">地图题</div>
          <div className="mt-2 text-2xl font-bold text-ink">{unit.mapCount}</div>
        </div>
        <div className="rounded-[1.2rem] bg-white/82 p-4">
          <div className="text-xs text-slate-500">待复习</div>
          <div className="mt-2 text-2xl font-bold text-ink">{unit.dueCount}</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
          <span>掌握率</span>
          <span>{unit.masteryRate}%</span>
        </div>
        <Progress value={unit.masteryRate} />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/unit/${unit.unitId}`}
          className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "flex-1 sm:flex-none")}
        >
          查看单元
        </Link>

        {unit.ready ? (
          <>
            <Link
              to={`/training/${unit.unitId}`}
              className={cn(buttonVariants({ size: "lg" }), "flex-1 sm:flex-none")}
            >
              开始训练
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to={`/maps/${unit.unitId}`}
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "flex-1 sm:flex-none")}
            >
              <MapPinned className="mr-2 h-4 w-4" />
              地图挑战
            </Link>
          </>
        ) : (
          <div className="inline-flex items-center rounded-[1.3rem] bg-white/80 px-4 py-3 text-sm font-medium text-slate-500">
            <Lock className="mr-2 h-4 w-4" />
            预留入口，后续接入 JSON 即可上线
          </div>
        )}
      </div>

      {featured ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-ocean-50 px-3 py-1 text-sm font-medium text-ocean-800">
          <Compass className="h-4 w-4" />
          当前推荐作为首个完整训练单元
        </div>
      ) : null}
    </Card>
  );
}
