import { useStore } from "@/store/useStore";
import { Link, useLocation } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AskSidekickButton } from "@/components/AskSidekickButton";
import { useI18n } from "@/lib/i18n";

export default function ProductDetail({ id }: { id: string }) {
  const { products, skus, orders } = useStore();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const product = products.find(p => p.id === id);

  if (!product) return <div className="p-8 text-center text-slate-500">{t("ui.notFoundProduct")}</div>;

  const productSkus = skus.filter(s => s.productId === id);
  const productOrders = orders.filter(o => o.productId === id);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Breadcrumbs items={[
        { label: t("pages.products"), href: "/products" },
        { label: product.name }
      ]} />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{product.id} · {product.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AskSidekickButton context={{
            type: "product",
            id: product.id,
            label: product.name,
            facts: [`30天销量: ${product.sales30d}`, `毛利率: ${(product.profitMargin * 100).toFixed(1)}%`]
          }} />
          <Link href={`/analytics/products/${product.id}`} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
            {t("ui.analytics")}
          </Link>
          <Link href={`/marketing?product=${product.id}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            {t("ui.marketingCopy")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("ui.priceCost")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">¥{product.price} / ¥{product.cost}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("ui.sales30")}</p>
          <p className="mt-2 text-xl font-bold text-slate-900">{product.sales30d}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("ui.margin")}</p>
          <p className={`mt-2 text-xl font-bold ${product.profitMargin < 0.3 ? "text-red-600" : "text-emerald-600"}`}>
            {(product.profitMargin * 100).toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">{t("ui.refundRate")}</p>
          <p className={`mt-2 text-xl font-bold ${product.refundRate > 0.08 ? "text-red-600" : "text-slate-900"}`}>
            {(product.refundRate * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900">{t("ui.skuDetails")}</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {productSkus.map(sku => (
              <div 
                key={sku.sku} 
                className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer group"
                onClick={() => setLocation(`/products/${product.id}/skus/${sku.sku}`)}
              >
                <div>
                  <p className="font-medium text-slate-900">{sku.sku}</p>
                  <p className="mt-1 text-xs text-slate-500">{t("ui.channel")}: {sku.channel} · {t("ui.inventory")}: {sku.stock}</p>
                </div>
                <div className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  {t("ui.details")}
                </div>
              </div>
            ))}
            {productSkus.length === 0 && <div className="p-8 text-center text-sm text-slate-500">{t("ui.noSku")}</div>}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 p-4 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">{t("ui.recentOrders")}</h3>
            <Link href={`/orders?productId=${product.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">{t("ui.viewAll")}</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {productOrders.slice(0, 5).map(order => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer group"
                onClick={() => setLocation(`/orders/${order.id}`)}
              >
                <div>
                  <p className="font-medium text-slate-900">{order.id}</p>
                  <p className="mt-1 text-xs text-slate-500">{order.date} · {order.channel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">¥{order.amount}</p>
                  <p className="mt-1 text-xs font-medium text-blue-600 group-hover:text-blue-700">{t("ui.details")}</p>
                </div>
              </div>
            ))}
            {productOrders.length === 0 && <div className="p-8 text-center text-sm text-slate-500">{t("ui.noOrderData")}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
