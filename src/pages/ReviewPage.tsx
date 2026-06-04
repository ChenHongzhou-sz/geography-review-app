import { useState } from "react";
import { Compass, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { StudyCard } from "../components/study/study-card";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import type { ReviewCard } from "../types";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function ReviewPage({ engine }: { engine: StudyEngine }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<ReviewCard[]>(() => engine.reviewDeck);
  const card = sessionCards[currentIndex];

  return (
    <AppShell
      title="今日复习"
      subtitle="这里负责全局复习调度。当前因为只接入了亚洲单元，所以会优先从亚洲题库里抽取；后续新增单元后，这里会自动混合出题。"
      headerAside={
        <div className="rounded-[1.5rem] bg-ocean-50 px-5 py-4 text-ocean-900">
          <div className="text-sm">待复习项目</div>
          <div className="mt-2 text-3xl font-bold">{engine.stats.dueKnowledge}</div>
        </div>
      }
    >
      <div className="mx-auto max-w-4xl space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>系统已经整理好今天该练的内容</CardTitle>
              <CardDescription className="mt-2">
                优先覆盖到期项目，同时尽量避开你刚练过的题，减少重复感。
              </CardDescription>
            </div>
            <div className="rounded-[1.4rem] bg-mint-100 px-4 py-3 text-mint-700">
              <div className="text-sm">当前主单元</div>
              <div className="text-2xl font-bold">{engine.featuredUnit.title}</div>
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
          <Card className="bg-slate-950 text-white">
            <div className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold">
              今日任务完成
            </div>
            <CardTitle className="text-white">这一轮复习已经完成</CardTitle>
            <CardDescription className="mt-3 text-slate-300">
              你可以继续进入单元训练，也可以切到亚洲闯关，把这一章再系统过一遍。
            </CardDescription>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={`/training/${engine.featuredUnit.unitId}`}
                className={buttonVariants({ size: "lg" })}
              >
                <Compass className="mr-2 h-4 w-4" />
                继续单元训练
              </Link>
              <Link to="/sprint" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                <Trophy className="mr-2 h-4 w-4" />
                亚洲闯关
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSessionCards(engine.reviewDeck);
                  setCurrentIndex(0);
                }}
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                再抽一组
              </button>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
