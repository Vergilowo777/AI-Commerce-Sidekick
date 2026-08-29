import { useMemo, useState } from "react";
import { Bell, Bot, Check, ChevronDown, LogOut, Search, Settings, User, X } from "lucide-react";
import { useLocation } from "wouter";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/store/useStore";

type SearchResult = { key: string; label: string; meta: string; href: string };

export default function Header() {
  const store = useStore();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const normalizedQuery = query.trim().toLowerCase();
  const unreadCount = store.notifications.filter((item) => !item.read).length;

  const searchResults = useMemo<SearchResult[]>(() => {
    if (!normalizedQuery) return [];
    const includes = (...values: Array<string | number | undefined>) => values.some((value) => String(value ?? "").toLowerCase().includes(normalizedQuery));
    return [
      ...store.products.filter((item) => includes(item.id, item.name, item.category)).map((item) => ({ key: `product-${item.id}`, label: item.name, meta: `${t("search.product")} · ${item.id}`, href: `/products/${item.id}` })),
      ...store.skus.filter((item) => includes(item.sku, item.channel)).map((item) => ({ key: `sku-${item.sku}`, label: item.sku, meta: `SKU · ${t("search.inventory")} ${item.stock}`, href: `/products/${item.productId}/skus/${item.sku}` })),
      ...store.orders.filter((item) => includes(item.id, item.channel, item.amount)).map((item) => ({ key: `order-${item.id}`, label: item.id, meta: `${t("search.order")} · ${item.channel} · ¥${item.amount}`, href: `/orders/${item.id}` })),
      ...store.customers.filter((item) => includes(item.id, item.name, item.phone)).map((item) => ({ key: `customer-${item.id}`, label: item.name, meta: `${t("search.customer")} · ${item.id}`, href: `/customers/${item.id}` })),
      ...store.alerts.filter((item) => includes(item.id, item.title, item.explanation)).map((item) => ({ key: `alert-${item.id}`, label: item.title, meta: `${t("search.risk")} · ${item.severity}`, href: `/alerts/${item.id}` })),
      ...store.reports.filter((item) => includes(item.id, item.title, item.summary)).map((item) => ({ key: `report-${item.id}`, label: item.title, meta: `${t("search.report")} · ${item.period}`, href: `/reports/${item.id}` })),
    ].slice(0, 8);
  }, [normalizedQuery, store.products, store.skus, store.orders, store.customers, store.alerts, store.reports, t]);

  const navigate = (href: string) => { setQuery(""); setNotificationsOpen(false); setAccountOpen(false); setLocation(href); };
  const openNotification = (id: string, href: string) => { store.markNotificationRead(id); navigate(href); };
  const unreadLabel = t("notification.unread", "{count} unread").replace("{count}", String(unreadCount));

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-6">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input data-testid="input-global-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && searchResults[0] && navigate(searchResults[0].href)} placeholder={t("search.placeholder")} className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500" />
        {query && <button data-testid="button-clear-search" onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-200"><X className="h-3.5 w-3.5" /></button>}
        {normalizedQuery && <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          {searchResults.length ? <div className="max-h-96 overflow-y-auto py-2">{searchResults.map((result) => <button data-testid={`button-search-result-${result.key}`} key={result.key} onClick={() => navigate(result.href)} className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-slate-50"><span className="truncate text-sm font-medium text-slate-900">{result.label}</span><span className="shrink-0 text-xs text-slate-500">{result.meta}</span></button>)}</div> : <div className="p-6 text-center text-sm text-slate-500">{t("search.empty")}</div>}
        </div>}
      </div>

      <div className="ml-3 flex items-center gap-2 md:gap-4">
        <button data-testid="button-ask-sidekick" onClick={() => navigate("/sidekick")} className="hidden items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 lg:flex"><Bot className="h-4 w-4" /> {t("action.ask")}</button>
        <LanguageSwitcher compact />
        <div className="relative">
          <button data-testid="button-notifications" onClick={() => setNotificationsOpen((open) => !open)} className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100"><Bell className="h-5 w-5" />{unreadCount > 0 && <span className="absolute right-0.5 top-0.5 min-w-4 rounded-full border-2 border-white bg-red-500 px-0.5 text-center text-[9px] font-bold text-white">{unreadCount}</span>}</button>
          {notificationsOpen && <div className="absolute right-0 top-12 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3"><div><p className="text-sm font-semibold text-slate-900">{t("notification.title")}</p><p className="text-xs text-slate-500">{unreadLabel}</p></div><button data-testid="button-mark-all-read" onClick={() => store.notifications.filter((item) => !item.read).forEach((item) => store.markNotificationRead(item.id))} className="flex items-center gap-1 text-xs font-medium text-blue-600"><Check className="h-3 w-3" /> {t("notification.allRead")}</button></div><div className="max-h-80 overflow-y-auto">{store.notifications.map((item) => { const href = item.relatedAlertId ? `/alerts/${item.relatedAlertId}` : item.relatedTaskId ? "/tasks" : "/"; return <button data-testid={`button-notification-${item.id}`} key={item.id} onClick={() => openNotification(item.id, href)} className={`block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50 ${item.read ? "" : "bg-blue-50/60"}`}><div className="flex items-start gap-2"><span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.read ? "bg-slate-200" : "bg-blue-500"}`} /><div><p className="text-sm font-medium text-slate-900">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.content}</p></div></div></button>; })}</div></div>}
        </div>
        <div className="hidden h-6 w-px bg-slate-200 sm:block" />
        <div className="relative">
          <button data-testid="button-account-menu" className="flex items-center gap-3 rounded-lg p-1 hover:bg-slate-50" onClick={() => setAccountOpen((open) => !open)} aria-expanded={accountOpen}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">{store.profile.avatarLabel || <User className="h-4 w-4" />}</span><span className="hidden text-left text-sm md:block"><span className="block font-medium text-slate-700">{store.profile.displayName}</span><span className="block text-xs text-slate-400">{store.profile.merchantName}</span></span><ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" /></button>
          {accountOpen && <div className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl"><div className="border-b border-slate-100 px-4 py-3"><p className="text-sm font-medium text-slate-900">{store.profile.displayName}</p><p className="mt-0.5 truncate text-xs text-slate-500">{store.profile.contact}</p></div><button data-testid="button-account-settings" onClick={() => navigate("/settings")} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-50"><Settings className="h-4 w-4" />{t("action.settings")}</button><button data-testid="button-sign-out" onClick={() => { store.logout(); setLocation("/login"); }} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" />{t("action.logout")}</button></div>}
        </div>
      </div>
    </header>
  );
}