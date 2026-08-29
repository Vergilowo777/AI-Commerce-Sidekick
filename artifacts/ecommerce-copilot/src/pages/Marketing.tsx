import { useState } from "react";
import { PenTool, Check, Copy, Wand2 } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useI18n } from "@/lib/i18n";

export default function Marketing() {
  const { products, addActivity } = useStore();
  const { t } = useI18n();
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || "");
  const [contentType, setContentType] = useState("title");
  const [tone, setTone] = useState("enthusiastic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedCopy("");
    
    // Simulate generation
    setTimeout(() => {
      const product = products.find(p => p.id === selectedProduct);
      let result = "";
      
      if (contentType === "title") {
        result = `${product?.name}｜高品质${product?.category}｜精选好物`;
      } else if (contentType === "description") {
        result = `${product?.name}，为日常使用带来更稳定、更舒适的体验。\n\n精选材质与可靠工艺，兼顾功能、细节和耐用性。适合追求品质生活、重视使用体验的消费者。\n\n核心卖点：品质可靠｜设计简洁｜售后无忧`;
      } else if (contentType === "xiaohongshu") {
        result = `最近发现一款很适合提升生活质感的${product?.category}：${product?.name}。\n\n实际使用下来，设计简洁不占空间，细节处理也很扎实，日常使用方便又省心。\n\n分享三个值得关注的亮点：\n1. 设计耐看，放在家里很协调\n2. 使用体验稳定，适合长期使用\n3. 价格友好，品质感超出预期\n\n#好物分享 #生活方式 #${product?.category}`;
      } else if (contentType === "douyin") {
        result = `如果你正在挑选${product?.category}，先看看这款${product?.name}。\n\n它把实用性、耐用度和外观都照顾到了，日常使用省心，送人也体面。\n\n现在限时到手价 ¥${product?.price}，点击进入商品页，库存有限，先到先得。`;
      } else {
        result = `【${product?.name}】\n\n为注重品质与效率的消费者打造。${product?.category}精选产品，兼顾实用功能、稳定表现与简洁设计。\n\n活动期间到手价 ¥${product?.price}，欢迎进入店铺了解更多。`;
      }
      
      setGeneratedCopy(result);
      setIsGenerating(false);
      
      addActivity({
        time: new Date().toISOString().replace('T', ' ').slice(0, 19),
        operator: '演示账户',
        action: 'AI生成营销文案',
        target: product?.id || "",
        status: 'success'
      });
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('pages.marketing')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('marketing.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 h-fit">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">{t('marketing.product')}</label>
            <select 
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-sm rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (¥{p.price})</option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">{t('marketing.format')}</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setContentType("title")}
                className={`px-4 py-3 text-sm font-medium border rounded-lg transition-all ${
                  contentType === 'title' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t('marketing.title')}
              </button>
              <button 
                onClick={() => setContentType("description")}
                className={`px-4 py-3 text-sm font-medium border rounded-lg transition-all ${
                  contentType === 'description' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t('marketing.description')}
              </button>
              <button 
                onClick={() => setContentType("xiaohongshu")}
                className={`px-4 py-3 text-sm font-medium border rounded-lg transition-all ${
                  contentType === 'xiaohongshu' 
                    ? 'border-red-500 bg-red-50 text-red-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t('marketing.xiaohongshu')}
              </button>
              <button 
                onClick={() => setContentType("douyin")}
                className={`px-4 py-3 text-sm font-medium border rounded-lg transition-all ${
                  contentType === 'douyin' 
                    ? 'border-slate-900 bg-slate-100 text-slate-900' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t('marketing.douyin')}
              </button>
              <button 
                onClick={() => setContentType("marketing")}
                className={`col-span-2 px-4 py-3 text-sm font-medium border rounded-lg transition-all ${
                  contentType === 'marketing' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t('marketing.promotion')}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">{t('marketing.tone')}</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'enthusiastic', label: t('marketing.enthusiastic') },
                { id: 'professional', label: t('marketing.professional') },
                { id: 'minimalist', label: t('marketing.minimalist') },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                    tone === t.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 animate-spin text-blue-200" />
                {t('marketing.generating')}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                {t('marketing.generate')}
              </div>
            )}
          </button>
        </div>

        {/* Result */}
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full blur-2xl"></div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{t('marketing.preview')}</h3>
            {generatedCopy && (
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t('marketing.copied') : t('marketing.copy')}
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-5 relative z-10 font-mono text-sm overflow-y-auto">
            {generatedCopy ? (
              <pre className="text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                {generatedCopy}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
                <Wand2 className="w-8 h-8 opacity-20" />
                <p>{t('marketing.empty')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
