import { AppShell } from "../components/layout/app-shell";
import { UnitCard } from "../components/study/unit-card";
import { Badge } from "../components/ui/badge";
import { Card, CardDescription } from "../components/ui/card";
import type { StudyEngine } from "../hooks/useStudyEngine";

export function UnitsPage({ engine }: { engine: StudyEngine }) {
  const groups = [
    {
      title: "七年级上册",
      description: "地球、地图、陆地和海洋、天气与气候、居民与文化、发展与合作。",
      units: engine.units.filter((unit) => unit.bookCode === "grade7-semester1")
    },
    {
      title: "七年级下册",
      description: "亚洲单元已接入，后续章节会继续按同样的数据结构扩展。",
      units: engine.units.filter((unit) => unit.bookCode === "grade7-semester2")
    }
  ];

  return (
    <AppShell
      title="单元列表"
      subtitle="这里按册别整理所有单元入口。已经接入数据的单元可以直接训练，未接入的单元保留卡片结构，后面继续补资料即可。"
      headerAside={
        <Card className="bg-slate-950 text-white">
          <div className="text-xs uppercase tracking-[0.18em] text-white/60">Unit Progress</div>
          <div className="mt-3 text-3xl font-bold">{engine.stats.readyUnits}</div>
          <CardDescription className="mt-2 text-slate-300">
            当前已完成的可训练单元数量。
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
