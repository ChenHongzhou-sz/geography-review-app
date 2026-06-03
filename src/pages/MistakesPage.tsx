import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { StudyCard } from "../components/study/study-card";
import { createReviewCard } from "../utils/review";
import type { ReviewCard } from "../types";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function MistakesPage({ engine }: { engine: StudyEngine }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCards, setSessionCards] = useState<ReviewCard[]>([]);
  const activeCard = sessionCards[currentIndex];

  const startMistakeSession = (itemIds?: string[]) => {
    const selectedItems = itemIds?.length
      ? engine.wrongItems.filter((item) => itemIds.includes(item.id))
      : engine.wrongItems;

    setSessionCards(
      selectedItems.map((item) => createReviewCard(item, "select", engine.knowledgeBase))
    );
    setCurrentIndex(0);
  };

  return (
    <AppShell pathname="/mistakes">
      <div className="mx-auto max-w-5xl space-y-5">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>错题回炉区</CardTitle>
              <CardDescription className="mt-2">
                自动记录错误次数、所属章节和知识点解析，适合每天花几分钟补漏洞。
              </CardDescription>
            </div>
            <Badge variant="sand">共 {engine.wrongItems.length} 个待回炉知识点</Badge>
          </div>
          {engine.wrongItems.length ? (
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => startMistakeSession()}
                className={buttonVariants({ size: "lg" })}
              >
                全部重做
              </button>
              <Link
                to="/review"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                去单元练习
              </Link>
            </div>
          ) : null}
        </Card>

        {activeCard ? (
          <StudyCard
            card={activeCard}
            indexLabel={`${currentIndex + 1} / ${sessionCards.length}`}
            onRate={(rating) => {
              engine.reviewKnowledge(activeCard, rating);
              setCurrentIndex((value) => value + 1);
            }}
          />
        ) : sessionCards.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="bg-slate-950 text-white">
              <div className="mb-4 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold">
                错题重做完成
              </div>
              <CardTitle className="text-white">这一轮错题已经练完了</CardTitle>
              <CardDescription className="mt-3 text-slate-300">
                标记为“会”的题会逐步从错题本中移出；仍然模糊的题会保留，方便下次继续补。
              </CardDescription>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => startMistakeSession()}
                  className={buttonVariants({ size: "lg" })}
                >
                  再做一轮
                </button>
                <Link
                  to="/review"
                  className={buttonVariants({ variant: "secondary", size: "lg" })}
                >
                  回到训练
                </Link>
              </div>
            </Card>
          </motion.div>
        ) : engine.wrongItems.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-mint-100">
                <RotateCcw className="h-6 w-6 text-mint-700" />
              </div>
              <CardTitle>错题本暂时清空了</CardTitle>
              <CardDescription className="mt-2">
                继续做题后，这里会自动汇总最近出错的知识点。
              </CardDescription>
              <div className="mt-5">
                <Link to="/review" className={buttonVariants({ size: "lg" })}>
                  回到训练
                </Link>
              </div>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {engine.wrongItems.map((item) => (
              <Card key={item.id}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{item.book}</Badge>
                    <Badge variant="slate">{item.section}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-rose-500">
                    <AlertTriangle className="h-4 w-4" />
                    错误 {item.progress.wrongCount} 次
                  </div>
                </div>

                <CardTitle>{item.knowledgePoint}</CardTitle>
                <CardDescription className="mt-2 text-base">
                  {item.question}
                </CardDescription>
                <div className="mt-4 rounded-[1.2rem] bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-ocean-700">正确答案</div>
                  <div className="mt-2 text-lg font-semibold text-ink">{item.answer}</div>
                  <div className="mt-3 text-sm leading-7 text-slate-600">
                    {item.explanation}
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => startMistakeSession([item.id])}
                    className={buttonVariants({ variant: "secondary", size: "lg" })}
                  >
                    重做这题
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
                  <span>{item.chapter}</span>
                  <span>
                    {item.source.label}
                    {item.source.page ? ` 第 ${item.source.page} 页` : ""}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
