import { useParams, Link } from "wouter";
import { useStore } from "@/store/useStore";
import { useState } from "react";
import { AlertTriangle, ArrowLeft, Bot, CheckCircle, ChevronRight, Network, FileText, Activity } from "lucide-react";
import React from "react";
import { useI18n } from "@/lib/i18n";

export default function AlertDetail() {
  const params = useParams();
  const id = params?.id;
  const store = useStore() as any;
  const { t } = useI18n();
  const alert = store.alerts?.find((a: any) => a.id === id);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);

  if (!alert) {
    return (
      <div className="p-10 text-center text-slate-500 max-w-4xl mx-auto mt-12 bg-white rounded-xl border border-slate-200 shadow-sm">
        <AlertTriangle className="w-10 h-10 text-slate-300 mx-auto mb-4" />
        <p className="font-semibold text-slate-900 mb-1">{t('alertDetail.notFound')}</p><p className="text-sm mb-6">{t('alertDetail.notFoundHint')}</p>
        <Link href="/alerts" className="text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors">
          {t('alertDetail.back')}
        </Link>
      </div>
    );
  }

  const suggestions = alert.type === 'inventory' ? [
    { id: 's1', title: 'Adjust alert threshold to 30', description: 'Automatically update SKU threshold to provide earlier warnings.', action: 'update_threshold', target: 'A102-WHT', value: 30 },
    { id: 's2', title: 'Draft supplier purchase order', description: 'Generate a draft PO for 500 units based on recent run rate.', action: 'draft_po', target: 'Supplier A' }
  ] : [
    { id: 's3', title: 'Pause low-margin marketing campaigns', description: 'Identify and halt spend on campaigns yielding < 10% margin.', action: 'pause_ads' },
    { id: 's4', title: 'Flag for logistics review', description: 'Assign recent refunded orders to the warehouse team for inspection.', action: 'flag_orders' }
  ];

  const handleCreateTask = (suggestion: any) => {
    setIsCreating(true);
    setSelectedTask(suggestion.id);
    setTimeout(() => {
      store.createAgentTask?.({
        title: suggestion.title,
        actionType: suggestion.action === 'update_threshold'
          ? 'update_threshold'
          : alert.type === 'inventory'
            ? 'restock'
            : 'generate_report',
        payload: suggestion.action === 'update_threshold'
          ? { skuId: alert.skuId || 'A102-WHT', alertLevel: suggestion.value || 30, alertId: alert.id }
          : alert.type === 'inventory'
            ? { skuId: alert.skuId || 'A102-WHT', quantity: 100, alertId: alert.id }
            : { type: 'product', title: `${alert.title}专项分析`, summary: alert.explanation, alertId: alert.id },
      });
      setTaskCreated(true);
      setIsCreating(false);
    }, 800);
  };

  const handleResolve = () => {
    store.resolveAlert?.(alert.id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Link href="/alerts" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1.5" /> {t('alertDetail.back')}
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 md:p-8 border-b border-slate-100">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-100 uppercase tracking-wider">
                  {alert.severity} {t('alerts.priority')}
                </span>
                <span className="text-sm font-medium text-slate-500 flex items-center">
                  <Network className="w-4 h-4 mr-1.5" /> {alert.type}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 leading-tight">{alert.title}</h1>
            </div>
            <button onClick={handleResolve} className="shrink-0 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg transition-colors border border-slate-200">
              {t('alertDetail.resolve')}
            </button>
          </div>
          <p className="mt-5 text-slate-600 text-[15px] leading-relaxed">{alert.explanation}</p>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50">
          <div className="p-6 md:p-8">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center uppercase tracking-wider">
              <Activity className="w-4 h-4 mr-2 text-blue-600" /> {t('alertDetail.impact')}
            </h3>
            <ul className="space-y-3 text-[15px] text-slate-600">
               <li className="flex justify-between items-center"><span>{t('alertDetail.related')}</span> <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{alert.skuId || alert.productId || alert.orderId || t('alertDetail.store')}</span></li><li className="flex justify-between items-center"><span>{t('alertDetail.metric')}</span> <span className="font-semibold text-amber-600">{alert.metric < 1 ? `${(alert.metric * 100).toFixed(1)}%` : alert.metric}</span></li><li className="flex justify-between items-center"><span>{t('alertDetail.baseline')}</span> <span className="font-semibold text-slate-900">{alert.baseline < 1 ? `${(alert.baseline * 100).toFixed(1)}%` : alert.baseline}</span></li><li className="flex justify-between items-center"><span>{t('alertDetail.status')}</span> <span className="font-semibold text-slate-900">{alert.status === 'open' ? t('alertDetail.open') : t('alertDetail.resolved')}</span></li>
            </ul>
          </div>
          <div className="p-6 md:p-8">
             <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center uppercase tracking-wider">
              <FileText className="w-4 h-4 mr-2 text-blue-600" /> {t('alertDetail.causes')}
            </h3>
            <ul className="space-y-2 text-[15px] text-slate-600 list-disc list-outside ml-4 leading-relaxed">
              {alert.causes.map((cause: string) => <li key={cause}>{cause}</li>)}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-indigo-100 rounded-2xl overflow-hidden shadow-sm relative">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
        <div className="p-5 md:px-8 border-b border-slate-100 bg-indigo-50/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-700" />
            </div>
            <div>
               <h3 className="font-bold text-slate-900">{t('alertDetail.aiAnalysis')}</h3><p className="text-xs font-medium text-slate-500">{t('alertDetail.aiHint')}</p>
            </div>
          </div>
          <Link 
            href="/assistant" 
            onClick={() => store.setSidekickContext?.({ page: alert.title, entityType: 'alert', entityId: alert.id, query: alert.explanation })}
            className="text-xs font-bold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 px-4 py-2 rounded-lg transition-colors"
          >
             {t('action.ask')}
          </Link>
        </div>
        
        <div className="p-6 md:p-8">
          <p className="text-[15px] text-slate-700 mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            Based on the structural analysis, I recommend immediately updating the threshold to match the new 7-day velocity to prevent future incidents. Concurrently, a draft purchase order should be created to cover the current inventory gap.
          </p>

           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t('alertDetail.recommended')}</h4>
          <div className="space-y-4">
            {suggestions.map((s) => (
              <div key={s.id} className={`border rounded-xl p-5 transition-all ${
                selectedTask === s.id ? 'border-indigo-300 bg-indigo-50/30 shadow-sm' : 'border-slate-200 hover:border-slate-300'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-slate-900 text-[15px] mb-1.5">{s.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
                  </div>
                  <div className="shrink-0 sm:mt-0 mt-2">
                    {taskCreated && selectedTask === s.id ? (
                      <div className="flex items-center text-sm font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                         <CheckCircle className="w-4 h-4 mr-2" /> {t('alertDetail.queued')}
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleCreateTask(s)}
                        disabled={isCreating}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto ${
                          isCreating && selectedTask === s.id 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm'
                        }`}
                      >
                        {isCreating && selectedTask === s.id ? t('alertDetail.queueing') : t('alertDetail.assign')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {taskCreated && (
            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-slate-600" />
                </div>
                 <p className="text-sm font-medium text-slate-700">{t('alertDetail.confirmation')}</p>
              </div>
              <Link href="/tasks" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center">
                 {t('alertDetail.goTasks')} <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
