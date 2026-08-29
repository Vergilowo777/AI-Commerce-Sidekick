import { useStore } from "@/store/useStore";
import { Link } from "wouter";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AskSidekickButton } from "@/components/AskSidekickButton";
import { useI18n } from "@/lib/i18n";

export default function OrderDetail({ id }: { id: string }) {
  const { orders, products, customers } = useStore();
  const { t } = useI18n();
  const order = orders.find(o => o.id === id);
  
  if (!order) return <div className="p-8 text-center text-slate-500">{t("ui.notFoundOrder")}</div>;
  const product = products.find(p => p.id === order.productId);

  const statusLabel = {
    pending: t("ui.pending"), shipped: t("ui.shipped"), delivered: t("ui.delivered"), refunded: t("ui.refunded"),
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <Breadcrumbs items={[
        { label: t("pages.orders"), href: "/orders" },
        { label: order.id }
      ]} />
      
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("ui.order")} {order.id}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("ui.order")} · {order.date}</p>
        </div>
        <AskSidekickButton context={{
          type: "order",
          id: order.id,
          label: order.id,
          facts: [`状态: ${statusLabel[order.status]}`, `金额: ¥${order.amount}`]
        }} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-6">{t("ui.orderInfo")}</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">{t("ui.status")}</span><span className="font-medium text-slate-900">{statusLabel[order.status]}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{t("ui.channel")}</span><span className="font-medium text-slate-900">{order.channel}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{t("ui.amount")}</span><span className="font-medium text-slate-900">¥{order.amount}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">{t("ui.customer")}</span><Link href={`/customers/${order.customerId}`} className="font-medium text-blue-600 hover:underline">{customers.find((item) => item.id === order.customerId)?.name ?? order.customerId}</Link></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-6">{t("ui.productInfo")}</h3>
          <div className="flex items-center gap-4">
            {product && (
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <p className="font-medium text-slate-900">{product?.name || order.productId}</p>
              <Link href={`/products/${order.productId}`} className="mt-1 text-sm text-blue-600 hover:text-blue-700 block">
                {t("ui.productDetails")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
