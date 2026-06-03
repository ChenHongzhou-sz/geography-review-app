import { useState } from "react";
import { motion } from "framer-motion";
import { MapPinned } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { StudyCard } from "../components/study/study-card";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import type { ReviewCard } from "../types";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function MapPage({ engine }: { engine: StudyEngine }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<ReviewCard[]>(() => engine.mapDeck);
  const card = sessionCards[currentIndex];

  return (
    <AppShell pathname="/map">
      <div className="mx-auto max-w-4xl space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>地图题专练</CardTitle>
              <CardDescription className="mt-2">
                真实地图题库已扩展到 {engine.mapChallenges.length} 组，优先使用教材和课件中的原图，不使用 AI 生成图，并会尽量避开最近刚做过的地图。
              </CardDescription>
            </div>
            <div className="rounded-[1.4rem] bg-mint-100 px-4 py-3 text-mint-700">
              <div className="text-sm">地图掌握率</div>
              <div className="text-3xl font-bold">{engine.stats.mapMasteryRate}%</div>
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
            onRate={(rating) => {
              engine.reviewKnowledge(card, rating);
              setCurrentIndex((value) => value + 1);
            }}
          />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card>
              <div className="mb-3 inline-flex rounded-full bg-ocean-50 px-3 py-1 text-sm font-semibold text-ocean-900">
                地图专练完成
              </div>
              <CardTitle>这一轮真实地图题已经完成</CardTitle>
              <CardDescription className="mt-2">
                你可以返回智能训练继续混合刷题，或者直接换一组不同地图继续练。
              </CardDescription>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/review" className={buttonVariants({ size: "lg" })}>
                  回到智能训练
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSessionCards(engine.mapDeck);
                    setCurrentIndex(0);
                  }}
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  换一组地图
                </button>
                <Link
                  to="/mistakes"
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  <MapPinned className="mr-2 h-4 w-4" />
                  查看错题
                </Link>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </AppShell>
  );
}
