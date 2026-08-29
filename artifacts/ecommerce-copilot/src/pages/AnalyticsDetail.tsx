import { useStore } from "@/store/useStore";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AskSidekickButton } from "@/components/AskSidekickButton";
import { BarChart3 } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function AnalyticsDetail({ view, channel, productId }: { view?: string | null, channel?: string | null, productId?: string | null }) {
  const { metrics, channelPerformance, products } = useStore();
  const { t } = useI18n();
  
  let title = t("pages.analytics");
  let facts: string[] = [];

  if (view === "revenue") {
    title = "营收分析 (Revenue)";
    facts = [`30日GMV: ¥${metrics.currentMonthGmv}`, `30日利润: ¥${metrics.currentMonthProfit}`];
  } else if (channel) {
    title = `渠道分析: ${channel}`;
    const perf = channelPerformance.find(c => c.name === channel);
    if (perf) facts = [`GMV: ¥${perf.gmv}`, `转化率: ${(perf.conversionRate * 100).toFixed(1)}%`];
  } else if (productId) {
    const p = products.find(p => p.id === productId);
    if (p) {
      title = `商品表现: ${p.name}`;
      facts = [`销量: ${p.sales30d}`, `GMV: ¥${p.revenue30d}`];
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Breadcrumbs items={[
        { label: t("pages.analytics"), href: "/analytics" },
        { label: title }
      ]} />
      
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <AskSidekickButton context={{
          type: "analytics",
          id: title,
          label: title,
          facts
        }} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm min-h-[400px] flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6" />
          </div>
          <p className="mb-6">{title} 的详细数据图表将在这里展示 (Demo)。</p>
          <div className="flex justify-center gap-4">
            {productId && (
              <Link href={`/products/${productId}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                {t("ui.backProduct")}
              </Link>
            )}
            {channel && (
              <Link href={`/orders?channel=${channel}`} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800">
                查看 {channel} 订单
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
