import { useEffect, useState } from "react";
import { CheckCircle2, Eye, FileText, ImageOff, Link2, MapPinned, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardDescription, CardTitle } from "../ui/card";
import type { ReviewCard, SelfRating } from "../../types";
import { resolvePublicAsset } from "../../utils/public-assets";

const typeLabel: Record<ReviewCard["questionType"], string> = {
  flashcard: "记忆卡片",
  choice: "选择题",
  judge: "判断题",
  analysis: "分析题",
  match: "连线题",
  map: "地图题"
};

export function StudyCard({
  card,
  indexLabel,
  onRate
}: {
  card: ReviewCard;
  indexLabel: string;
  onRate: (rating: SelfRating) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setRevealed(false);
    setSelectedOption(null);
    setImageFailed(false);
  }, [card.id]);

  const selectedIsCorrect =
    revealed && selectedOption && card.correctOption
      ? selectedOption === card.correctOption
      : undefined;
  const resolvedAssetPath = resolvePublicAsset(card.assetPath);
  const showImage =
    Boolean(resolvedAssetPath) &&
    (card.questionType === "map" || card.questionType === "analysis" || card.questionType === "choice");

  return (
    <motion.div
      key={card.id}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <Card className="overflow-hidden">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{card.bookLabel}</Badge>
            <Badge variant="sand">{typeLabel[card.questionType]}</Badge>
            <Badge variant="slate">{indexLabel}</Badge>
          </div>

          <div className="text-sm font-medium text-slate-500">{card.chapter}</div>
        </div>

        {showImage ? (
          <div className="mb-5 rounded-[1.4rem] border border-ocean-100 bg-gradient-to-br from-ocean-50 to-white p-2 sm:p-3">
            {resolvedAssetPath && !imageFailed ? (
              <img
                src={resolvedAssetPath}
                alt={card.prompt}
                className="mx-auto max-h-[72vh] max-w-full rounded-[1rem] bg-white"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="flex min-h-[18rem] flex-col items-center justify-center gap-3 rounded-[1rem] bg-white px-5 text-center sm:min-h-[24rem]">
                <MapPinned className="h-9 w-9 text-ocean-500" />
                <div className="text-base font-semibold text-ink">原图加载失败</div>
                <div className="max-w-md text-sm leading-6 text-slate-600">
                  {card.extractionNote ?? "当前题目保留了原图来源信息，后续可继续补充或替换素材。"}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="mb-4">
          <div className="mb-2 text-sm font-medium text-ocean-700">{card.section}</div>
          <CardTitle className="text-2xl leading-9 sm:text-[1.7rem]">{card.prompt}</CardTitle>
          <CardDescription className="mt-3 text-base leading-7 text-slate-600">
            {card.knowledgePoint}
          </CardDescription>
        </div>

        {card.questionType === "match" && card.pairs?.length ? (
          <div className="mb-5 grid gap-3 sm:grid-cols-2">
            {card.pairs.map((pair) => (
              <div
                key={`${pair.left}-${pair.right}`}
                className="rounded-[1.2rem] border border-slate-200 bg-white px-4 py-4"
              >
                <div className="text-sm font-semibold text-slate-500">{pair.left}</div>
                <div className="mt-2 flex items-center gap-2 text-base text-ink">
                  <Link2 className="h-4 w-4 text-ocean-500" />
                  <span>{revealed ? pair.right : "先在脑中完成连线，再查看答案"}</span>
                </div>
              </div>
            ))}
          </div>
        ) : card.options?.length ? (
          <div className="mb-5 grid gap-3">
            {card.options.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = revealed && card.correctOption === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setSelectedOption(option)}
                  className={[
                    "rounded-[1.2rem] border px-4 py-4 text-left text-base font-medium transition-all",
                    isCorrectOption
                      ? "border-mint-300 bg-mint-100 text-mint-700"
                      : selectedIsCorrect === false && isSelected
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : isSelected
                          ? "border-ocean-300 bg-ocean-50 text-ocean-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-ocean-200 hover:bg-slate-50"
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : (
          <CardDescription className="mb-5 rounded-[1.2rem] bg-slate-50 px-4 py-4 text-base text-slate-600">
            先在脑中作答，再点“查看答案与解析”进行核对。
          </CardDescription>
        )}

        {!revealed ? (
          <div className="space-y-3">
            <Button size="lg" className="w-full" onClick={() => setRevealed(true)}>
              <Eye className="mr-2 h-4 w-4" />
              查看答案与解析
            </Button>
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <FileText className="h-4 w-4" />
              <span>{card.sourceLabel}</span>
              {card.sourceFile ? <span>{card.sourceFile}</span> : null}
              {card.sourceSlide ? <span>第 {card.sourceSlide} 页</span> : null}
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-[1.4rem] border border-ocean-100 bg-ocean-50/70 p-4">
              <div className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-ocean-700">
                正确答案
              </div>
              <div className="text-lg font-semibold leading-8 text-ink">{card.answer}</div>
              <CardDescription className="mt-3 text-base leading-7 text-slate-700">
                {card.explanation}
              </CardDescription>

              {selectedOption ? (
                <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                  {selectedIsCorrect ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-mint-600" />
                      <span>你的作答正确：{selectedOption}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-rose-500" />
                      <span>你刚才选择的是：{selectedOption}</span>
                    </>
                  )}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                {imageFailed ? <ImageOff className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                <span>{card.sourceLabel}</span>
                {card.sourceFile ? <span>{card.sourceFile}</span> : null}
                {card.sourceSlide ? <span>第 {card.sourceSlide} 页</span> : null}
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-slate-700">现在给自己一个掌握评价</div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Button variant="danger" className="w-full" onClick={() => onRate("again")}>
                  不会
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => onRate("hard")}>
                  模糊
                </Button>
                <Button variant="success" className="w-full" onClick={() => onRate("good")}>
                  会了
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
