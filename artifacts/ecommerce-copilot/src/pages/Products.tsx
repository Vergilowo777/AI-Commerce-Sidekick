import { type ChangeEvent, type FormEvent, useRef, useState } from "react";
import { MoreHorizontal, Plus, Search, Upload, X } from "lucide-react";
import { type Product, useStore } from "@/store/useStore";
import { useLocation } from "wouter";
import ProductDetail from "./ProductDetail";
import SkuDetail from "./SkuDetail";
import { useI18n } from "@/lib/i18n";

export default function Products() {
  const { products, addProduct, addActivity } = useStore();
  const { t } = useI18n();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const detailId = searchParams.get("id");
  const skuId = searchParams.get("sku");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("全部类目");
  const [isImporting, setIsImporting] = useState(false);
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (detailId && skuId) {
    return <SkuDetail productId={detailId} skuId={skuId} />;
  }

  if (detailId) {
    return <ProductDetail id={detailId} />;
  }

  const categories = ["全部类目", ...new Set(products.map((product) => product.category))];
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.includes(searchTerm) || product.id.includes(searchTerm);
    const matchesCategory =
      category === "全部类目" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleFileSelected = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.[0]) return;
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      setShowImportSuccess(true);
      setTimeout(() => setShowImportSuccess(false), 3000);
    }, 1200);
    event.target.value = "";
  };

  const handleCreateProduct = (event: FormEvent) => {
    event.preventDefault();
    const name = newProductName.trim();
    if (!name) return;

    const product: Product = {
      id: `P${1000 + products.length + 1}`,
      name,
      category: "3C数码",
      image: products[0]?.image ?? "",
      price: 199,
      cost: 96,
      sales: 0,
      revenue: 0,
      profitMargin: 0.518,
      sales30d: 0,
      salesPrevious30d: 0,
      revenue30d: 0,
      profit30d: 0,
      refundRate: 0,
      status: "draft",
    };

    addProduct(product);
    addActivity({
      time: new Date().toISOString().replace("T", " ").slice(0, 19),
      operator: "演示账户",
      action: "新建商品草稿",
      target: product.id,
      status: "success",
    });
    setNewProductName("");
    setShowCreate(false);
    setLocation(`/products/${product.id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("pages.products")}</h1>
          <p className="mt-1 text-sm text-slate-500">共 {products.length} 款商品，覆盖商品、SKU 与成本数据。</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelected}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            {isImporting ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isImporting ? "导入中..." : "导入 CSV / Excel"}
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            新建商品
          </button>
        </div>
      </div>

      {showImportSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          文件解析完成：已模拟导入 12 款商品及对应 SKU 数据。
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center justify-between gap-4 border-b border-slate-200 p-4 sm:flex-row">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
               placeholder={t("ui.searchProducts")}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
          >
            {categories.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                 <th className="px-6 py-3">{t("ui.productInfo")}</th>
                 <th className="px-6 py-3">{t("ui.priceCost")}</th>
                 <th className="px-6 py-3">{t("ui.sales30")}</th>
                 <th className="px-6 py-3">{t("ui.margin")}</th>
                 <th className="px-6 py-3">{t("ui.refundRate")}</th>
                 <th className="px-6 py-3 text-right">{t("ui.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className="transition-colors hover:bg-slate-50/70 cursor-pointer group"
                  onClick={() => setLocation(`/products/${product.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{product.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{product.id} · {product.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900">¥{product.price}</p>
                    <p className="text-xs text-slate-500">成本 ¥{product.cost}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{product.sales30d.toLocaleString("zh-CN")}</td>
                  <td className={`px-6 py-4 text-sm font-medium ${product.profitMargin < 0.3 ? "text-red-600" : "text-emerald-600"}`}>
                    {(product.profitMargin * 100).toFixed(1)}%
                  </td>
                  <td className={`px-6 py-4 text-sm font-medium ${product.refundRate > 0.08 ? "text-red-600" : "text-slate-700"}`}>
                    {(product.refundRate * 100).toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="rounded-lg p-2 text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600"
                      aria-label={`查看 ${product.name}`}
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
             <div className="py-12 text-center text-slate-500">{t("ui.noProducts")}</div>
          )}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <form onSubmit={handleCreateProduct} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-600">Products</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">新建商品草稿</h2>
              </div>
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="mt-6 block text-sm font-medium text-slate-700">商品名称</label>
            <input
              value={newProductName}
              onChange={(event) => setNewProductName(event.target.value)}
              autoFocus
              placeholder="例如：磁吸桌面充电支架"
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-2 text-xs text-slate-500">Demo 将创建一个默认售价 ¥199 的草稿商品，并写入操作日志。</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                取消
              </button>
              <button type="submit" disabled={!newProductName.trim()} className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 hover:bg-blue-700">
                创建草稿
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
