import { useStore } from "@/store/useStore";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AskSidekickButton } from "@/components/AskSidekickButton";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function InventoryDetail({ skuId }: { skuId: string }) {
  const { skus, products, alerts } = useStore();
  const { t } = useI18n();
  const sku = skus.find(s => s.sku === skuId);
  
  if (!sku) return <div className="p-8 text-center text-slate-500">{t("ui.notFoundInventory")}</div>;
  const product = products.find(p => p.id === sku.productId);

  const relatedAlert = alerts.find(a => a.type === 'inventory' && a.title.includes(skuId) || a.title.includes(product?.name || ''));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Breadcrumbs items={[
        { label: t("pages.inventory"), href: "/inventory" },
        { label: sku.sku }
      ]} />
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{sku.sku}</h1>
          <p className="mt-1 text-sm text-slate-500">
            商品: <Link href={`/products/${sku.productId}`} className="text-blue-600 hover:underline">{product?.name || sku.productId}</Link>
          </p>
        </div>
        <AskSidekickButton context={{
          type: "inventory",
          id: sku.sku,
          label: sku.sku,
          facts: [`库存: ${sku.stock}`, `阈值: ${sku.alertLevel}`]
        }} />
      </div>

      {relatedAlert && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-2 text-amber-800 font-medium">
            <AlertTriangle className="h-5 w-5" />
            {relatedAlert.title}
          </div>
          <p className="mt-1 text-sm text-amber-700">{relatedAlert.explanation}</p>
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
          <p className="text-sm text-slate-500">预计周转</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {sku.sold7d > 0 ? (sku.stock / (sku.sold7d / 7)).toFixed(1) : '∞'} 天
          </p>
        </div>
      </div>
    </div>
  );
}
