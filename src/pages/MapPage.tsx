import { useEffect, useState } from "react";
import { Compass, NotebookPen, Trophy } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { StudyCard } from "../components/study/study-card";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import type { ReviewCard } from "../types";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function MapPage({ engine }: { engine: StudyEngine }) {
  const params = useParams();
  const unitId = params.unitId ?? "";
  const unit = engine.getUnit(unitId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<ReviewCard[]>(() =>
    engine.getUnitMapDeck(unitId)
  );
  const card = sessionCards[currentIndex];

  useEffect(() => {
    if (unit) {
      engine.setFeaturedUnit(unit.unitId);
    }

    setSessionCards(engine.getUnitMapDeck(unitId));
    setCurrentIndex(0);
  }, [engine, unit, unitId]);

  if (!unit) {
    return <Navigate to="/units" replace />;
  }

  if (!unit.ready) {
    return <Navigate to={`/unit/${unit.unitId}`} replace />;
  }

  return (
    <AppShell
      title={`${unit.title} 地图挑战`}
      subtitle="地图挑战集中训练亚洲位置图、地理分区图和自然环境图。所有图片都来自你提供的课件原图，不做外部下载和重绘。"
      headerAside={
        <div className="rounded-[1.5rem] bg-mint-100 px-5 py-4 text-mint-700">
          <div className="text-sm">地图掌握率</div>
          <div className="mt-2 text-3xl font-bold">{engine.stats.mapMasteryRate}%</div>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>{unit.title} 地图专项</CardTitle>
              <CardDescription className="mt-2">
                当前轮次优先抽取位置、分区、地形和季风相关的原图地图题，尽量避免同一张图连续重复。
              </CardDescription>
            </div>
            <div className="rounded-[1.4rem] bg-slate-950 px-4 py-3 text-white">
              <div className="text-sm text-slate-300">地图题</div>
              <div className="text-3xl font-bold">{unit.mapCount}</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={(currentIndex / Math.max(sessionCards.length, 1)) * 100} />
          </div>
        </Card>

        {card ? (
          <StudyCard
            card={card}
            indexLabel={`${currentIndex + 1} / ${sessionCards.length}`}
            onAdvance={({ rating, answeredCorrectly }) => {
              engine.reviewKnowledge(card, rating, { answeredCorrectly });
              setCurrentIndex((value) => value + 1);
            }}
          />
        ) : (
          <Card>
            <div className="mb-3 inline-flex rounded-full bg-ocean-50 px-3 py-1 text-sm font-semibold text-ocean-900">
              地图挑战完成
            </div>
            <CardTitle>这一轮地图题已经完成</CardTitle>
            <CardDescription className="mt-2">
              可以继续回到单元训练，或者进入单元闯关，把地图题和综合题一起带一遍。
            </CardDescription>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={`/training/${unit.unitId}`} className={buttonVariants({ size: "lg" })}>
                <Compass className="mr-2 h-4 w-4" />
                回到单元训练
              </Link>
              <Link to="/sprint" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                <Trophy className="mr-2 h-4 w-4" />
                单元闯关
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSessionCards(engine.getUnitMapDeck(unit.unitId));
                  setCurrentIndex(0);
                }}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                再来一轮地图题
              </button>
              <Link to="/mistakes" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                <NotebookPen className="mr-2 h-4 w-4" />
                查看错题本
              </Link>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
