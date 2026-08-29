import { Link, useLocation } from "wouter";
import {
  ActivitySquare,
  Archive,
  BarChart3,
  BellRing,
  Bot,
  FileBarChart,
  LayoutDashboard,
  Plug,
  Settings,
  ShoppingCart,
  Sparkles,
  UploadCloud,
  Users,
  Package,
  PenTool,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";

const groups = [
  {
    labelKey: "nav.operations",
    items: [
      { href: "/", labelKey: "nav.overview", icon: LayoutDashboard },
      { href: "/sidekick", labelKey: "nav.sidekick", icon: Bot },
      { href: "/alerts", labelKey: "nav.alerts", icon: BellRing },
      { href: "/analytics", labelKey: "nav.analytics", icon: BarChart3 },
    ],
  },
  {
    labelKey: "nav.business",
    items: [
      { href: "/products", labelKey: "nav.products", icon: Package },
      { href: "/orders", labelKey: "nav.orders", icon: ShoppingCart },
      { href: "/inventory", labelKey: "nav.inventory", icon: Archive },
      { href: "/customers", labelKey: "nav.customers", icon: Users },
      { href: "/marketing", labelKey: "nav.marketing", icon: PenTool },
    ],
  },
  {
    labelKey: "nav.collaboration",
    items: [
      { href: "/reports", labelKey: "nav.reports", icon: FileBarChart },
      { href: "/tasks", labelKey: "nav.tasks", icon: ActivitySquare },
      { href: "/data-import", labelKey: "nav.import", icon: UploadCloud },
      { href: "/integrations", labelKey: "nav.integrations", icon: Plug },
      { href: "/settings", labelKey: "nav.settings", icon: Settings },
    ],
  },
];

const mobileItems = [
  groups[0].items[0],
  groups[0].items[1],
  groups[0].items[2],
  groups[1].items[0],
  groups[2].items[1],
];

function isActive(location: string, href: string) {
  return href === "/" ? location === "/" : location.startsWith(href);
}

export default function Sidebar() {
  const [location] = useLocation();
  const { alerts } = useStore();
  const { t } = useI18n();
  const activeAlertCount = alerts.filter((alert) => alert.status === "open").length;

  return (
    <>
      <aside className="hidden w-64 flex-shrink-0 flex-col bg-slate-950 text-slate-50 md:flex">
        <div className="flex h-16 items-center border-b border-slate-800 px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-950">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
               <span className="block text-sm font-bold tracking-wide text-white">{t("app.name")}</span>
               <span className="block text-[10px] text-slate-500">{t("app.tagline")}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.labelKey} className="mb-5">
              <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                 {t(group.labelKey)}
              </p>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(location, item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                        active
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-400 hover:bg-slate-900 hover:text-white",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                       <span className="flex-1">{t(item.labelKey)}</span>
                      {item.href === "/alerts" && (
                        <span className="rounded-full bg-red-500/20 px-1.5 text-[10px] text-red-300">{activeAlertCount}</span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 p-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
            <div className="flex items-center justify-between text-xs">
               <span className="font-medium text-slate-200">{t("sidebar.demoSpace")}</span>
               <span className="text-emerald-400">{t("status.synced")}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
            </div>
             <p className="mt-2 text-[10px] leading-4 text-slate-500">{t("sidebar.demoDetails")}</p>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur md:hidden">
        {mobileItems.map((item) => {
          const active = isActive(location, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-w-14 flex-col items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium",
                active ? "text-blue-600" : "text-slate-500",
              )}
            >
              <item.icon className="h-5 w-5" />
               {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
    </>
  );
}