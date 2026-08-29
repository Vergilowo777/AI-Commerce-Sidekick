import { ActivitySquare, CheckCircle, Clock } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Activity() {
  const { activities } = useStore();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">操作日志</h1>
        <p className="text-sm text-slate-500 mt-1">记录人工与 AI 助手的所有关键后台操作，确保可追溯。</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6">
          <div className="relative border-l border-slate-200 ml-3 space-y-8">
            {activities.map((activity, idx) => (
              <div key={activity.id} className="relative pl-6">
                <div className="absolute -left-[21px] top-1 bg-white p-1">
                  {activity.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500 bg-white" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500 bg-white" />
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                  <h3 className="font-medium text-slate-900">{activity.action}</h3>
                  <span className="text-xs text-slate-500 font-mono">{activity.time}</span>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-3 mt-2 border border-slate-100 text-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div>
                    <span className="text-slate-500">操作对象：</span>
                    <span className="font-medium text-slate-800">{activity.target}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">操作人：</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      activity.operator === 'AI 助手' || activity.operator === '系统自动'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {activity.operator}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
