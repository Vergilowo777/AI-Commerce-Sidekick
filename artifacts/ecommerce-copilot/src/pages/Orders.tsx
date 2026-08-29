import { useState } from "react";
import { Search } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useLocation } from "wouter";
import OrderDetail from "./OrderDetail";
import { useI18n } from "@/lib/i18n";

export default function Orders() {
  const { orders, products } = useStore();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const detailId = searchParams.get("id");
  const urlProductId = searchParams.get("productId");
  const urlChannel = searchParams.get("channel");
  
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [channel, setChannel] = useState(urlChannel || "全部渠道");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [refundedOnly, setRefundedOnly] = useState(false);

  if (detailId) {
    return <OrderDetail id={detailId} />;
  }

  const getProductName = (productId: string) =>
    products.find((product) => product.id === productId)?.name || productId;

  const filteredOrders = orders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesRefunded = refundedOnly ? order.status === "refunded" : true;
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getProductName(order.productId).includes(searchTerm);
    const matchesChannel = channel === "全部渠道" || order.channel === channel;
    const matchesProduct = urlProductId ? order.productId === urlProductId : true;
    const matchesMin = minAmount ? order.amount >= Number(minAmount) : true;
    const matchesMax = maxAmount ? order.amount <= Number(maxAmount) : true;
    
    return matchesTab && matchesRefunded && matchesSearch && matchesChannel && matchesProduct && matchesMin && matchesMax;
  });

  const statusLabel: Record<string, string> = {
    pending: t("ui.pending"), shipped: t("ui.shipped"), delivered: t("ui.delivered"), refunded: t("ui.refunded"),
  };

  const statusClass: Record<string, string> = {
    pending: "bg-amber-100 text-amber-800",
    shipped: "bg-blue-100 text-blue-800",
    delivered: "bg-green-100 text-green-800",
    refunded: "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("pages.orders")}</h1>
          <p className="mt-1 text-sm text-slate-500">跨平台订单、退款与商品销售的 Demo 明细。</p>
        </div>
        <select className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto">
          <option>最近 7 天</option>
          <option>最近 30 天</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50/50">
          <nav className="flex overflow-x-auto px-4">
            {[
              { id: "all", label: "全部订单" },
              { id: "pending", label: "待发货" },
              { id: "shipped", label: "已发货" },
              { id: "delivered", label: "已妥投" },
              { id: "refunded", label: "售后 / 退款" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col flex-wrap gap-4 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
               placeholder={t("ui.searchOrders")}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
            >
              {["全部渠道", "淘宝", "天猫", "京东", "拼多多"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minAmount}
                onChange={e => setMinAmount(e.target.value)}
                placeholder="最小金额"
                className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-slate-400">-</span>
              <input
                type="number"
                value={maxAmount}
                onChange={e => setMaxAmount(e.target.value)}
                placeholder="最大金额"
                className="w-24 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={refundedOnly} 
                onChange={e => setRefundedOnly(e.target.checked)} 
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
              />
              仅看退款
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                 <th className="px-6 py-3">{t("ui.orderInfo")}</th>
                 <th className="px-6 py-3">{t("ui.product")}</th>
                 <th className="px-6 py-3">{t("ui.amount")}</th>
                 <th className="px-6 py-3">{t("ui.status")}</th>
                 <th className="px-6 py-3 text-right">{t("ui.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="transition-colors hover:bg-slate-50/70 cursor-pointer group"
                  onClick={() => setLocation(`/orders?id=${order.id}`)}
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{order.id}</p>
                    <p className="mt-1 text-xs text-slate-500">{order.date} · {order.channel}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{getProductName(order.productId)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">¥{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded px-2 py-1 text-xs font-medium ${statusClass[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                       {t("ui.details")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
             <div className="py-12 text-center text-slate-500">{t("ui.noOrders")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
