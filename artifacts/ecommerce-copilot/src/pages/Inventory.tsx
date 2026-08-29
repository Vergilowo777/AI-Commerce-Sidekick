import { useState } from "react";
import { Search, Bot, AlertTriangle, ArrowRight } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useLocation } from "wouter";
import InventoryDetail from "./InventoryDetail";
import { useI18n } from "@/lib/i18n";

export default function Inventory() {
  const { skus, products, updateSKUAlertLevel, addActivity } = useStore();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const detailSku = searchParams.get("sku");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (detailSku) {
    return <InventoryDetail skuId={detailSku} />;
  }

  const getProductName = (productId: string) => {
    return products.find(p => p.id === productId)?.name || productId;
  };

  const handleSaveThreshold = (skuId: string) => {
    const val = parseInt(editValue, 10);
    if (!isNaN(val) && val >= 0) {
      updateSKUAlertLevel(skuId, val);
      addActivity({
        time: new Date().toISOString().replace('T', ' ').slice(0, 19),
        operator: '演示账户',
        action: '修改库存告警阈值',
        target: skuId,
        status: 'success'
      });
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
         <h1 className="text-2xl font-bold text-slate-900">{t("pages.inventory")}</h1>
        <p className="text-sm text-slate-500 mt-1">智能监控多渠道 SKU 库存水位，预防超卖与缺货。</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">低库存告警</h3>
          </div>
          <p className="text-3xl font-bold text-amber-900">2 <span className="text-base font-normal text-amber-700 ml-1">个 SKU</span></p>
          <p className="text-sm text-amber-700 mt-2">预计未来 3 天内售罄</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">AI 补货建议</h3>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                根据过去 7 天的销量趋势分析，<strong className="text-slate-900">智能无线蓝牙耳机 Pro (A102-BLU, 京东)</strong> 的周转天数已不足 3 天。建议立即从总仓调拨 50 件，或联系供应商补发货。
              </p>
              <button 
                className="mt-3 text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 transition-colors"
                onClick={() => setLocation('/inventory/A102-BLU')}
              >
                查看 SKU 详情 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
               placeholder={t("ui.searchSku")}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">SKU / {t("ui.product")}</th>
                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("ui.channel")}</th>
                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("ui.currentStock")}</th>
                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("ui.sales7")}</th>
                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("ui.alertThreshold")}</th>
                 <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("ui.status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {skus.map(sku => {
                const isRisk = sku.stock <= sku.alertLevel;
                const daysLeft = sku.sold7d > 0 ? (sku.stock / (sku.sold7d / 7)).toFixed(1) : '∞';
                
                return (
                  <tr 
                    key={sku.sku} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    onClick={() => setLocation(`/inventory/${sku.sku}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{sku.sku}</div>
                      <div className="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{getProductName(sku.productId)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {sku.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-bold ${isRisk ? 'text-red-600' : 'text-slate-900'}`}>
                        {sku.stock}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {sku.sold7d}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === sku.sku ? (
                        <div className="flex items-center gap-2">
                          <input 
                            type="number" 
                            className="w-16 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-500"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveThreshold(sku.sku)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleSaveThreshold(sku.sku); }}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded font-medium hover:bg-blue-100"
                          >
                             {t("action.save")}
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="text-sm text-slate-600 hover:text-blue-600 border-b border-dashed border-transparent hover:border-blue-300 inline-block"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(sku.sku);
                            setEditValue(sku.alertLevel.toString());
                          }}
                        >
                          {sku.alertLevel}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isRisk ? (
                        <div className="flex items-center gap-1.5 text-red-600 text-sm font-medium">
                          <AlertTriangle className="w-4 h-4" />
                           {t("ui.warning")} ({daysLeft})
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                           {t("ui.healthy")}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
