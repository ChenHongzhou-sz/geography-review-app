import { AppShell } from "../components/layout/app-shell";
import { UnitCard } from "../components/study/unit-card";
import { Badge } from "../components/ui/badge";
import { Card, CardDescription, CardTitle } from "../components/ui/card";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function UnitsPage({ engine }: { engine: StudyEngine }) {
  const groups = [
    {
      title: "七年级上册",
      description: "地球、地图、陆海、天气与气候、居民与文化、发展与合作。",
      units: engine.units.filter((unit) => unit.bookCode === "七上")
    },
    {
      title: "七年级下册",
      description: "亚洲已作为首个完整单元接入，其它章节按同样方式继续扩展。",
      units: engine.units.filter((unit) => unit.bookCode === "七下")
    }
  ];

  return (
    <AppShell
      title="全部单元"
      subtitle="单元列表现在已经从首页独立出来。后面每新增一个单元，只需要补一份数据文件和图片资源，再把元信息挂进目录。"
      headerAside={
        <Card className="bg-slate-950 text-white">
          <div className="text-xs uppercase tracking-[0.18em] text-white/60">Module Progress</div>
          <div className="mt-3 text-3xl font-bold">{engine.stats.readyUnits}</div>
          <CardDescription className="mt-2 text-slate-300">
            当前已完成的可训练单元数，后续将持续增加。
          </CardDescription>
        </Card>
      }
    >
      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.title}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-ink">{group.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{group.description}</p>
              </div>
              <Badge variant="slate">{group.units.length} 个入口</Badge>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {group.units.map((unit) => (
                <UnitCard
                  key={unit.unitId}
                  unit={unit}
                  featured={unit.unitId === engine.featuredUnit.unitId}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
