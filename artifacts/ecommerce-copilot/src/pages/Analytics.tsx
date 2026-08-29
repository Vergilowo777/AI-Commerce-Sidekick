import {
  BarChart3,
  CircleDollarSign,
  PackageSearch,
  ReceiptText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useStore } from "@/store/useStore";
import { Link, useLocation } from "wouter";
import AnalyticsDetail from "./AnalyticsDetail";
import { useI18n } from "@/lib/i18n";

const currency = (value: number) =>
  new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);

export default function Analytics() {
  const { metrics, trendData, channelPerformance, products } = useStore();
  const { t, language } = useI18n();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const view = searchParams.get("view");
  const channel = searchParams.get("channel");
  const productId = searchParams.get("product");

  if (view || channel || productId) {
    return <AnalyticsDetail view={view} channel={channel} productId={productId} />;
  }

  const gmvChange =
    ((metrics.currentMonthGmv - metrics.previousMonthGmv) /
      metrics.previousMonthGmv) *
    100;
  const profitChange =
    ((metrics.currentMonthProfit - metrics.previousMonthProfit) /
      metrics.previousMonthProfit) *
    100;
  const rankedProducts = [...products].sort(
    (a, b) => b.revenue30d - a.revenue30d,
  );

  const summaryCards = [
    {
       label: t("dashboard.trend"),
      value: currency(metrics.currentMonthGmv),
      change: `+${gmvChange.toFixed(1)}%`,
      positive: true,
      icon: BarChart3,
      link: "/analytics?view=revenue"
    },
    {
       label: t("dashboard.profit"),
      value: currency(metrics.currentMonthProfit),
      change: `${profitChange.toFixed(1)}%`,
      positive: false,
      icon: CircleDollarSign,
      link: "/analytics?view=revenue"
    },
    {
       label: t("dashboard.orders"),
      value: trendData.reduce((sum, item) => sum + item.orders, 0).toLocaleString("zh-CN"),
      change: "+6.5%",
      positive: true,
      icon: ReceiptText,
      link: "/orders"
    },
    {
       label: t("dashboard.refund"),
      value: `${(metrics.refundRate * 100).toFixed(1)}%`,
      change: `+${((metrics.refundRate - metrics.previousRefundRate) * 100).toFixed(1)}pp`,
      positive: false,
      icon: PackageSearch,
      link: "/orders?status=refunded"
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("pages.analytics")}</h1>
          <p className="mt-1 text-sm text-slate-500">
            销售、利润、订单、渠道与商品表现使用同一套 Demo 数据计算。
          </p>
        </div>
        <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto">
          <option>最近 30 天</option>
          <option>本月</option>
          <option>上月</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <Link key={card.label} href={card.link} className="block group">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-colors group-hover:border-blue-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 group-hover:text-slate-900 transition-colors">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
              <div className={`mt-3 flex items-center gap-1 text-sm font-medium ${
                card.positive ? "text-emerald-600" : "text-red-600"
              }`}>
                {card.positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {card.change}
                <span className="font-normal text-slate-400">环比</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">销售与利润趋势</h3>
              <p className="mt-1 text-sm text-slate-500">GMV 持续上涨，但利润增长明显落后。</p>
            </div>
             <Link href="/analytics?view=revenue" className="text-sm text-blue-600 hover:text-blue-700">{t("ui.details")}</Link>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="analyticsGmv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="analyticsProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="period" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} tickFormatter={(value) => `¥${value / 1000}k`} />
                <Tooltip formatter={(value: number) => currency(value)} />
                <Legend />
                <Area type="monotone" dataKey="gmv" name="GMV" stroke="#2563eb" strokeWidth={2} fill="url(#analyticsGmv)" />
                 <Area type="monotone" dataKey="profit" name={t("dashboard.profit")} stroke="#10b981" strokeWidth={2} fill="url(#analyticsProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">渠道表现</h3>
              <p className="mt-1 text-sm text-slate-500">点击图表柱子查看渠道详情。</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelPerformance} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={48} tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip formatter={(value: number) => currency(value)} cursor={{fill: '#f8fafc'}} />
                <Legend />
                 <Bar 
                  dataKey="gmv" 
                  name="GMV" 
                  fill="#2563eb" 
                  radius={[0, 4, 4, 0]} 
                  onClick={(data) => setLocation(`/analytics?channel=${data.name}`)}
                  cursor="pointer"
                />
                <Bar 
                  dataKey="profit" 
                   name={t("dashboard.profit")} 
                  fill="#10b981" 
                  radius={[0, 4, 4, 0]} 
                  onClick={(data) => setLocation(`/analytics?channel=${data.name}`)}
                  cursor="pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-lg font-semibold text-slate-900">商品表现</h3>
          <p className="mt-1 text-sm text-slate-500">点击行可以查看商品分析详情。</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                 <th className="px-6 py-3">{t("ui.product")}</th>
                 <th className="px-6 py-3">{t("ui.sales30")}</th>
                <th className="px-6 py-3">GMV</th>
                 <th className="px-6 py-3">{t("dashboard.profit")}</th>
                 <th className="px-6 py-3">{t("ui.margin")}</th>
                 <th className="px-6 py-3">{t("ui.refundRate")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className="text-sm hover:bg-slate-50/70 cursor-pointer group"
                  onClick={() => setLocation(`/analytics?product=${product.id}`)}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{product.name}</p>
                    <p className="mt-1 text-xs text-slate-400">{product.id} · {product.category}</p>
                  </td>
                   <td className="px-6 py-4 text-slate-700">{product.sales30d.toLocaleString(language)}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{currency(product.revenue30d)}</td>
                  <td className="px-6 py-4 text-slate-700">{currency(product.profit30d)}</td>
                  <td className={`px-6 py-4 font-medium ${product.profitMargin < 0.3 ? "text-red-600" : "text-emerald-600"}`}>
                    {(product.profitMargin * 100).toFixed(1)}%
                  </td>
                  <td className={`px-6 py-4 font-medium ${product.refundRate > 0.08 ? "text-red-600" : "text-slate-700"}`}>
                    {(product.refundRate * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">AI 诊断</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">GMV 上升，但利润下降</h3>
        <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
          本月 GMV 环比上升 {gmvChange.toFixed(1)}%，利润却下降 {Math.abs(profitChange).toFixed(1)}%。
          低毛利的移动电源销量增长到 1,600 件，拉高了 GMV，但毛利率只有 19.5%。
          同时桌面加湿器退款率升至 12%。建议减少低毛利促销投入，并优先排查加湿器售后原因。
        </p>
      </div>
    </div>
  );
}
