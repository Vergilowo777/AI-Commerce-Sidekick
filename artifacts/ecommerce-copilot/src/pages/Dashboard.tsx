import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  PackageSearch,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Link, useLocation } from "wouter";
import { useI18n } from "@/lib/i18n";

export default function Dashboard() {
  const { alerts, metrics, trendData } = useStore();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const activeAlerts = alerts.filter((alert) => alert.status === "open");
  const activeInventoryRisks = activeAlerts.filter((alert) => alert.category === "inventory").length;

  const metricCards = [
    { label: t("dashboard.gmv"), value: `¥${metrics.todayGmv.toLocaleString("zh-CN")}`, trend: "+12.4%", isPositive: true, href: "/analytics/revenue" },
    { label: t("dashboard.profit"), value: `¥${metrics.todayProfit.toLocaleString("zh-CN")}`, trend: "-13.8%", isPositive: false, href: "/alerts/AL-005" },
    { label: t("dashboard.orders"), value: metrics.todayOrders.toLocaleString("zh-CN"), trend: "+3.3%", isPositive: true, href: "/orders" },
    { label: t("dashboard.refund"), value: `${(metrics.refundRate * 100).toFixed(1)}%`, trend: "+1.9pp", isPositive: false, href: "/alerts/AL-002" },
    { label: t("dashboard.inventoryRisk"), value: `${activeInventoryRisks} SKU`, trend: activeInventoryRisks ? "需处理" : "已清零", isPositive: activeInventoryRisks === 0, href: "/alerts/AL-001" },
    { label: t("dashboard.anomaly"), value: `${activeAlerts.length}`, trend: activeAlerts.length ? "AI 已定位" : "运行正常", isPositive: activeAlerts.length === 0, href: "/alerts" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("dashboard.title")}</h1>
          <p className="text-slate-500 mt-1">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium text-sm">
          <Sparkles className="w-4 h-4" />
          数据已于刚刚更新
        </div>
      </div>

      {/* Daily Brief */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <BotIcon />
            <h2 className="font-semibold">AI 经营简报</h2>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">最近 30 天 Demo 数据</span>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-slate-600 leading-relaxed text-sm">
                本月 GMV 环比上涨 <strong className="text-slate-900">5.5%</strong>，但利润下降 <strong className="text-red-600">5.5%</strong>。主要原因是低毛利的移动电源销量占比提高；同时有 2 个耳机 SKU 库存吃紧，桌面加湿器退款率升至 12%。建议优先处理补货与退款原因，再优化低毛利促销。
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">需立即处理的待办 ({activeAlerts.length})</h3>
              {activeAlerts.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
               {t("dashboard.normal")}
                </div>
              ) : (
                activeAlerts.slice(0, 2).map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <AlertIcon type={alert.type} severity={alert.severity} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{alert.title}</p>
                      <p className="text-xs text-slate-500 mt-1 truncate">{alert.explanation}</p>
                    </div>
                    <Link
                      href={`/alerts/${alert.id}`}
                      className="flex items-center gap-1 whitespace-nowrap rounded border border-slate-200 bg-white px-3 py-1.5 text-xs transition-colors hover:text-blue-600"
                    >
                       {t("ui.details")} <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4">
        {metricCards.map((m, i) => (
          <Link key={i} href={m.href} className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md">
            <p className="text-sm text-slate-500 mb-2">{m.label}</p>
            <h3 className="text-2xl font-bold text-slate-900">{m.value}</h3>
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${m.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {m.isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {m.trend}
              <ChevronRight className="ml-auto h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
            </div>
          </Link>
        ))}
      </div>

      {/* Chart */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setLocation("/analytics/revenue")}
        onKeyDown={(event) => event.key === "Enter" && setLocation("/analytics/revenue")}
        className="cursor-pointer rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-blue-300"
      >
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-semibold text-slate-900">{t("dashboard.trend")}</h3>
          <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500">
            <option>所有渠道 · 最近30天</option>
            <option>淘宝/天猫</option>
            <option>京东</option>
            <option>拼多多</option>
          </select>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `¥${value}`} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`¥${value}`, undefined]}
              />
              <Area type="monotone" dataKey="gmv" name="交易额(GMV)" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorGmv)" />
              <Area type="monotone" dataKey="profit" name="预估毛利" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function BotIcon() {
  return <Bot className="w-5 h-5 text-blue-400" />;
}
import { Bot } from "lucide-react";

function AlertIcon({ type, severity }: { type: string, severity: string }) {
  if (severity === 'high') return <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />;
  if (type === 'anomaly') return <PackageSearch className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
  return <TrendingUp className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;
}
