import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { BookOpen, Compass, House, Map, TimerReset } from "lucide-react";
import { cn } from "../../utils/cn";

const navItems = [
  { to: "/", label: "首页", icon: House },
  { to: "/review", label: "训练", icon: Compass },
  { to: "/map", label: "地图", icon: Map },
  { to: "/mistakes", label: "错题", icon: BookOpen },
  { to: "/sprint", label: "冲刺", icon: TimerReset }
];

const titleMap: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "GeoMemory",
    subtitle: "训练优先，而非阅读优先"
  },
  "/review": {
    title: "智能训练",
    subtitle: "按复习周期自动混合抽题"
  },
  "/map": {
    title: "地图挑战",
    subtitle: "优先使用教材与课件原图作为地图来源"
  },
  "/mistakes": {
    title: "错题本",
    subtitle: "把失分点重新练到熟"
  },
  "/sprint": {
    title: "考前冲刺",
    subtitle: "30 / 60 / 90 分钟节奏包"
  }
};

export function AppShell({
  pathname,
  children
}: {
  pathname: string;
  children: ReactNode;
}) {
  const pageMeta = titleMap[pathname] ?? titleMap["/"];

  return (
    <div className="min-h-screen px-4 pb-28 pt-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl safe-pb">
        <header className="mb-6 rounded-[2rem] border border-white/70 bg-white/68 px-5 py-5 shadow-glow backdrop-blur-2xl sm:px-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-ocean-50 px-3 py-1 text-xs font-semibold text-ocean-900">
                七年级地理记忆训练营
              </div>
              <h1 className="title-balance text-3xl font-bold tracking-tight sm:text-[2.2rem]">
                {pageMeta.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {pageMeta.subtitle}
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-gradient-to-br from-ocean-500 via-ocean-700 to-mint-500 px-4 py-3 text-white shadow-lg">
              <div className="text-xs uppercase tracking-[0.22em] text-white/70">
                Mobile First
              </div>
              <div className="mt-1 text-lg font-semibold">手机 / iPad 均可用</div>
            </div>
          </div>
        </header>

        <main>{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-3xl px-4 pb-4 pt-2 sm:px-6">
        <div className="grid grid-cols-5 gap-2 rounded-[1.8rem] border border-white/80 bg-white/88 p-2 shadow-glow backdrop-blur-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 rounded-[1.2rem] px-2 py-3 text-xs font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-br from-ocean-500 to-mint-500 text-white shadow-md"
                      : "text-slate-500 hover:bg-slate-100 hover:text-ink"
                  )
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
