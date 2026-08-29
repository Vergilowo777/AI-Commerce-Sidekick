import { Link } from "wouter";
import { CheckCircle2, ChevronRight, Plug, Settings2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";

export default function Integrations() {
  const { integrations } = useStore();
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <nav className="flex items-center gap-2 text-sm text-slate-500"><Link href="/">{t('ui.home')}</Link><ChevronRight className="h-4 w-4" /><span className="font-medium text-slate-900">{t('pages.integrations')}</span></nav>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('pages.integrations')}</h1><p className="mt-1 text-sm text-slate-500">{t('integrations.subtitle')}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {integrations.map((item) => (
          <div key={item.id} className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Plug className="h-5 w-5" /></span>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${item.status === "connected" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {item.status === "connected" ? t('integrations.connected') : t('integrations.disconnected')}
              </span>
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">{item.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{item.provider} · {t('integrations.syncScope')}</p>
            {item.lastSyncedAt && <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600"><CheckCircle2 className="h-3.5 w-3.5" />{t('integrations.lastSynced')} {item.lastSyncedAt}</p>}
            <Link href={`/integrations/${item.id}`} className={`mt-6 flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${item.status === "connected" ? "border border-slate-200 text-slate-700 hover:bg-slate-50" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
              <Settings2 className="h-4 w-4" />{item.status === "connected" ? t('integrations.manage') : t('integrations.authorize')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}