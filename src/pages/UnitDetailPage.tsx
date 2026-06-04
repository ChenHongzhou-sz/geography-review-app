import { BookOpen, Compass, Lock, MapPinned, Sparkles } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AppShell } from "../components/layout/app-shell";
import { Badge } from "../components/ui/badge";
import { buttonVariants } from "../components/ui/button";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { cn } from "../utils/cn";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function UnitDetailPage({ engine }: { engine: StudyEngine }) {
  const params = useParams();
  const unitId = params.unitId ?? "";
  const unit = engine.getUnit(unitId);
  const data = engine.getUnitData(unitId);

  if (!unit) {
    return <Navigate to="/units" replace />;
  }

  return (
    <AppShell
      title={`${unit.chapter} ${unit.title}`}
      subtitle={unit.description}
      headerAside={
        <div className="rounded-[1.6rem] bg-gradient-to-br from-ocean-500 via-ocean-700 to-mint-500 px-5 py-4 text-white shadow-lg">
          <div className="text-sm text-white/70">当前掌握率</div>
          <div className="mt-2 text-3xl font-bold">{unit.masteryRate}%</div>
          <div className="mt-4 text-sm text-white/78">待复习 {unit.dueCount} 个知识点</div>
        </div>
      }
    >
      {data ? (
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-ocean-900 via-ocean-700 to-mint-600 text-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex rounded-full bg-white/12 px-3 py-1 text-sm font-semibold">
                  当前已接入训练数据
                </div>
                <CardTitle className="text-3xl text-white">{data.title}</CardTitle>
                <CardDescription className="mt-3 max-w-3xl text-white/80">
                  这个单元已经接入了知识点、训练题和地图题。后续其它章节只要沿用同样的数据结构，就能直接复用这套页面。
                </CardDescription>
              </div>

              <div className="grid grid-cols-2 gap-3 rounded-[1.5rem] bg-white/10 p-4 backdrop-blur">
                <div>
                  <div className="text-sm text-white/70">知识点</div>
                  <div className="mt-1 text-2xl font-bold">{unit.knowledgeCount}</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">地图题</div>
                  <div className="mt-1 text-2xl font-bold">{unit.mapCount}</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">训练题</div>
                  <div className="mt-1 text-2xl font-bold">{unit.questionCount}</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">待复习</div>
                  <div className="mt-1 text-2xl font-bold">{unit.dueCount}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/training/${unit.unitId}`} className={cn(buttonVariants({ size: "lg" }))}>
                <Compass className="mr-2 h-4 w-4" />
                开始训练
              </Link>
              <Link
                to={`/maps/${unit.unitId}`}
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "bg-white text-ink")}
              >
                <MapPinned className="mr-2 h-4 w-4" />
                地图挑战
              </Link>
              <Link
                to="/review"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "bg-white/12 text-white")}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                今日复习
              </Link>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>单元结构</CardTitle>
                  <CardDescription className="mt-2">
                    这页展示的是训练入口，不再把首页挤成一个大列表。
                  </CardDescription>
                </div>
                <Badge variant="success">Ready</Badge>
              </div>

              <div className="mt-5 space-y-3">
                {data.sections.map((section, index) => (
                  <div
                    key={section}
                    className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 px-4 py-4"
                  >
                    <div className="text-sm text-slate-500">模块 {index + 1}</div>
                    <div className="mt-1 font-semibold text-ink">{section}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>知识点预览</CardTitle>
                  <CardDescription className="mt-2">
                    当前亚洲单元已经放入一组可训练知识点，后续其它章节会沿着同一结构继续补充。
                  </CardDescription>
                </div>
                <BookOpen className="h-5 w-5 text-ocean-500" />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {data.knowledgePoints.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-[1.25rem] bg-white/85 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ocean-600">
                      {item.section}
                    </div>
                    <div className="mt-2 font-semibold text-ink">{item.knowledgePoint}</div>
                    <div className="mt-2 text-sm leading-6 text-slate-600">{item.question}</div>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>单元掌握率</span>
                  <span>{unit.masteryRate}%</span>
                </div>
                <Progress value={unit.masteryRate} />
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
            <Lock className="h-6 w-6 text-slate-500" />
          </div>
          <CardTitle>这个单元入口已经预留好了</CardTitle>
          <CardDescription className="mt-3 max-w-2xl mx-auto">
            当前还没有接入训练数据。后续只要补一份 JSON 数据和对应图片文件，这个单元就能直接复用现有 UI 与训练页面。
          </CardDescription>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/units" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              返回单元列表
            </Link>
            <Link to="/" className={buttonVariants({ size: "lg" })}>
              回到首页
            </Link>
          </div>
        </Card>
      )}
    </AppShell>
  );
}
