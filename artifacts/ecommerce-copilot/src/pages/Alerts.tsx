import { useStore } from "@/store/useStore";
import { Link } from "wouter";
import { AlertTriangle, ArrowRight, PackageX, TrendingDown, DollarSign, Activity } from "lucide-react";
import React from "react";
import { useI18n } from "@/lib/i18n";

export default function Alerts() {
  const store = useStore() as any;
  const { t } = useI18n();
  const alerts = (store.alerts || []).filter((alert: any) => alert.status === 'open');

  const getIcon = (type: string) => {
    switch (type) {
      case 'inventory': return <PackageX className="w-5 h-5 text-amber-600" />;
      case 'refund': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'margin': return <DollarSign className="w-5 h-5 text-orange-600" />;
      case 'sales': return <TrendingDown className="w-5 h-5 text-blue-600" />;
      case 'opportunity': return <Activity className="w-5 h-5 text-emerald-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 text-red-700 border-red-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('pages.alerts')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('alerts.subtitle')}</p>
      </div>

      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
            <Activity className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-900 font-medium">{t('alerts.empty')}</p><p className="text-sm text-slate-500 mt-1">{t('alerts.normal')}</p>
          </div>
        ) : (
          alerts.map((alert: any) => (
            <Link key={alert.id} href={`/alerts/${alert.id}`} className="block group">
              <div className="p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 shrink-0 group-hover:bg-blue-50 transition-colors">
                  {getIcon(alert.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-semibold text-slate-900 truncate">{alert.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${getSeverityColor(alert.severity)}`}>
                      {alert.severity} {t('alerts.priority')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">{alert.explanation}</p>
                </div>
                <div className="shrink-0 sm:self-center mt-3 sm:mt-0 flex items-center text-sm font-medium text-blue-600">
                  {t('alerts.review')}
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
