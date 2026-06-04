import type { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BookOpen, Compass, House, Map, NotebookPen } from "lucide-react";
import { DEFAULT_UNIT_ID } from "../../data/units";
import { cn } from "../../utils/cn";

const navItems = [
  {
    to: "/",
    label: "首页",
    icon: House,
    match: (pathname: string) => pathname === "/"
  },
  {
    to: "/units",
    label: "单元",
    icon: BookOpen,
    match: (pathname: string) => pathname === "/units" || pathname.startsWith("/unit/")
  },
  {
    to: `/training/${DEFAULT_UNIT_ID}`,
    label: "训练",
    icon: Compass,
    match: (pathname: string) => pathname.startsWith("/training/")
  },
  {
    to: `/maps/${DEFAULT_UNIT_ID}`,
    label: "地图",
    icon: Map,
    match: (pathname: string) => pathname.startsWith("/maps/")
  },
  {
    to: "/mistakes",
    label: "错题本",
    icon: NotebookPen,
    match: (pathname: string) => pathname.startsWith("/mistakes")
  }
];

export function AppShell({
  title,
  subtitle,
  badge = "GeoMemory 地理训练营",
  headerAside,
  children
}: {
  title: string;
  subtitle: string;
  badge?: string;
  headerAside?: ReactNode;
  children: ReactNode;
}) {
  const location = useLocation();

  return (
    <div className="min-h-screen px-4 pb-28 pt-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl safe-pb">
        <header className="relative mb-6 overflow-hidden rounded-[2rem] border border-white/70 bg-white/68 px-5 py-5 shadow-glow backdrop-blur-2xl sm:px-7">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-ocean-300/12 via-transparent to-mint-300/16" />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-ocean-50 px-3 py-1 text-xs font-semibold text-ocean-900">
                {badge}
              </div>
              <h1 className="title-balance text-3xl font-bold tracking-tight sm:text-[2.2rem]">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                {subtitle}
              </p>
            </div>

            {headerAside ? (
              <div className="min-w-[220px]">{headerAside}</div>
            ) : (
              <div className="rounded-[1.5rem] bg-gradient-to-br from-ocean-500 via-ocean-700 to-mint-500 px-4 py-3 text-white shadow-lg">
                <div className="text-xs uppercase tracking-[0.22em] text-white/72">
                  Mobile First
                </div>
                <div className="mt-1 text-lg font-semibold">手机 / iPad 均可用</div>
              </div>
            )}
          </div>
        </header>

        <main>{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-3xl px-4 pb-4 pt-2 sm:px-6">
        <div className="grid grid-cols-5 gap-2 rounded-[1.8rem] border border-white/80 bg-white/88 p-2 shadow-glow backdrop-blur-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.match(location.pathname);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[1.2rem] px-2 py-3 text-xs font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-br from-ocean-500 to-mint-500 text-white shadow-md"
                    : "text-slate-500 hover:bg-slate-100 hover:text-ink"
                )}
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
