import { useStore } from "@/store/useStore";
import { useState } from "react";
import { CheckCircle, Clock, XCircle, LayoutList, History, ArrowRight } from "lucide-react";
import React from "react";
import { useI18n } from "@/lib/i18n";

export default function TasksActivity() {
  const store = useStore() as any;
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'tasks' | 'activity'>('tasks');
  const tasks = store.tasks || [];
  const activities = store.activities || [];

  const handleConfirm = (id: string) => {
    store.confirmAgentTask?.(id);
  };

  const handleCancel = (id: string) => {
    store.cancelAgentTask?.(id);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">{t('pages.tasks')}</h1><p className="text-sm text-slate-500 mt-1">{t('tasks.subtitle')}</p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors flex items-center ${
            activeTab === 'tasks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <LayoutList className="w-4 h-4 mr-2" />
          {t('tasks.pending')}
          {tasks.filter((t: any) => t.status === 'pending_confirmation').length > 0 && (
            <span className="ml-2.5 bg-blue-100 text-blue-700 py-0.5 px-2 rounded-md text-[11px]">
              {tasks.filter((t: any) => t.status === 'pending_confirmation').length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('activity')}
          className={`px-5 py-3 text-sm font-bold border-b-2 transition-colors flex items-center ${
            activeTab === 'activity' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className="w-4 h-4 mr-2" />
          {t('tasks.activity')}
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {tasks.filter((t: any) => t.status === 'pending_confirmation').length === 0 ? (
            <div className="p-16 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <LayoutList className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-lg font-bold text-slate-900">{t('tasks.empty')}</p><p className="text-[15px] text-slate-500 mt-1">{t('tasks.emptyHint')}</p>
            </div>
          ) : (
            tasks.filter((t: any) => t.status === 'pending_confirmation').map((task: any) => (
              <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-300 transition-colors group">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                        {t('tasks.requiresApproval')}
                      </span>
                      <span className="text-xs font-medium text-slate-400 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" /> {t('tasks.justNow')}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{task.title}</h3>
                    <p className="text-[15px] text-slate-600 leading-relaxed mb-4">
                      {task.actionType === 'restock' ? `将为 ${String(task.payload.skuId)} 补货 ${String(task.payload.quantity)} 件。` :
                       task.actionType === 'update_threshold' ? `将 ${String(task.payload.skuId)} 的预警阈值更新为 ${String(task.payload.alertLevel)}。` :
                       t('tasks.confirmCopy')}
                    </p>
                    
                    {task.payload && (
                      <div className="bg-slate-50 rounded-xl border border-slate-100 p-3.5 text-sm flex flex-wrap items-center gap-4">
                        <div className="flex items-center text-slate-500">
                          <span className="uppercase text-[11px] font-bold tracking-wider mr-2">{t('tasks.target')}</span>
                          <span className="font-semibold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">{String(task.payload.skuId || task.payload.productId || task.payload.title || task.id)}</span>
                        </div>
                        {(task.payload.quantity || task.payload.alertLevel) && (
                          <>
                            <ArrowRight className="w-4 h-4 text-slate-300 hidden sm:block" />
                            <div className="flex items-center text-slate-500">
                               <span className="uppercase text-[11px] font-bold tracking-wider mr-2">{t('tasks.newValue')}</span>
                              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{String(task.payload.quantity || task.payload.alertLevel)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex sm:flex-col flex-row gap-3 w-full md:w-40 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
                    <button 
                      onClick={() => handleConfirm(task.id)}
                      className="flex-1 md:w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-center"
                    >
                      {t('action.confirm')}
                    </button>
                    <button 
                      onClick={() => handleCancel(task.id)}
                      className="flex-1 md:w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors text-center"
                    >
                      {t('tasks.decline')}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="relative border-l-2 border-slate-100 ml-4 space-y-10">
              {activities.map((activity: any) => (
                <div key={activity.id} className="relative pl-8">
                  <div className="absolute -left-[23px] top-0 bg-white p-1.5 rounded-full border border-slate-100 shadow-sm">
                    {activity.status === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : activity.status === 'failed' ? (
                      <XCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-slate-900 text-base">{activity.action}</h3>
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                      {activity.time}
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 mt-3 border border-slate-100 text-[14px] flex flex-col sm:flex-row gap-5 sm:items-center">
                    <div className="flex items-center">
                       <span className="text-slate-500 uppercase text-[11px] font-bold tracking-wider mr-3">{t('tasks.target')}</span>
                      <span className="font-semibold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">{activity.target}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200 hidden sm:block"></div>
                    <div className="flex items-center">
                       <span className="text-slate-500 uppercase text-[11px] font-bold tracking-wider mr-3">{t('tasks.operator')}</span>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase ${
                        activity.operator === 'AI 助手' || activity.operator === 'System Agent'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-200 text-slate-700 border border-slate-300'
                      }`}>
                        {activity.operator === 'AI 助手' ? 'SYSTEM AGENT' : activity.operator}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {activities.length === 0 && (
                 <p className="pl-8 text-[15px] font-medium text-slate-500 py-6">{t('tasks.noActivity')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
