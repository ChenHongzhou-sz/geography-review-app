import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function MistakesPage({ engine }: { engine: StudyEngine }) {
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
        </Card>

        {engine.wrongItems.length === 0 ? (
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
