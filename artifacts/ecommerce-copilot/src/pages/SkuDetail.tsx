import { useStore } from "@/store/useStore";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AskSidekickButton } from "@/components/AskSidekickButton";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function SkuDetail({ productId, skuId }: { productId: string, skuId: string }) {
  const { skus, products, alerts } = useStore();
  const { t } = useI18n();
  const sku = skus.find(s => s.sku === skuId && s.productId === productId);
  const product = products.find(p => p.id === productId);
  
  if (!sku || !product) return <div className="p-8 text-center text-slate-500">{t("ui.notFoundSku")}</div>;

  const relatedAlert = alerts.find(a => a.title.includes(product.name) && a.title.includes('库存'));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Breadcrumbs items={[
        { label: t("pages.products"), href: "/products" },
        { label: product.name, href: `/products?id=${product.id}` },
        { label: sku.sku }
      ]} />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{sku.sku}</h1>
          <p className="mt-1 text-sm text-slate-500">所属商品: {product.name} · 渠道: {sku.channel}</p>
        </div>
        <AskSidekickButton context={{
          type: "sku",
          id: sku.sku,
          label: sku.sku,
          facts: [`当前库存: ${sku.stock}`, `7日动销: ${sku.sold7d}`]
        }} />
      </div>

      {relatedAlert && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-800 font-medium">
            <AlertTriangle className="h-5 w-5" />
            {relatedAlert.title}
          </div>
          <p className="mt-1 text-sm text-red-700">{relatedAlert.explanation}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("ui.currentStock")}</p>
          <p className={`mt-2 text-xl font-bold ${sku.stock <= sku.alertLevel ? "text-red-600" : "text-slate-900"}`}>{sku.stock}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("ui.alertThreshold")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{sku.alertLevel}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("ui.sales7")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{sku.sold7d}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("ui.margin")} ({t("ui.channel")})</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{(sku.margin * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
