import { useEffect, useState } from "react";
import { useGetAiStatus } from "@workspace/api-client-react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { useStore } from "@/store/useStore";
import { 
  Store, 
  Link as LinkIcon,
  Bell,
  Bot,
  Save,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function Settings() {
  const { data: aiStatus, isLoading } = useGetAiStatus();
  const { t } = useI18n();
  const { profile, updateProfile } = useStore();
  
  // Safely determine configuration status
  const isAiConfigured = Boolean(aiStatus?.configured);

  const [storeName, setStoreName] = useState("智营优选旗舰店");
  const [industry, setIndustry] = useState("3C数码");
  const [currency, setCurrency] = useState("CNY");
  const [timezone, setTimezone] = useState("Asia/Shanghai");

  const [notifStock, setNotifStock] = useState(true);
  const [notifOrder, setNotifOrder] = useState(true);
  const [notifDaily, setNotifDaily] = useState(false);

  const [channels, setChannels] = useState([
    { id: 'taobao', name: '淘宝 / 天猫', status: 'connected', syncTime: '10 分钟前' },
    { id: 'jd', name: '京东', status: 'connected', syncTime: '15 分钟前' },
    { id: 'pdd', name: '拼多多', status: 'disconnected', syncTime: '--' },
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileDraft, setProfileDraft] = useState(profile);

  useEffect(() => {
    setProfileDraft(profile);
  }, [profile]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateProfile(profileDraft);
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleToggleChannel = (id: string) => {
    setChannels(channels.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: c.status === 'connected' ? 'disconnected' : 'connected',
          syncTime: c.status === 'connected' ? '--' : '刚刚'
        };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("settings.title")}</h1>
          <p className="text-slate-500 mt-1">{t("settings.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-sm font-medium text-green-600 flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
               {t("settings.accountSaved")}
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
             {t("action.save")}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
          <Store className="w-5 h-5 text-slate-500" />
          <h2 className="font-semibold text-slate-900">{t("settings.account")}</h2>
        </div>
        <div className="p-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="display-name">{t("settings.displayName")}</label>
            <input data-testid="input-display-name" id="display-name" type="text" value={profileDraft.displayName} onChange={(event) => setProfileDraft({ ...profileDraft, displayName: event.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="merchant-name">{t("settings.merchantName")}</label>
            <input data-testid="input-merchant-name" id="merchant-name" type="text" value={profileDraft.merchantName} onChange={(event) => setProfileDraft({ ...profileDraft, merchantName: event.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="contact">{t("settings.contact")}</label>
            <input data-testid="input-contact" id="contact" type="text" value={profileDraft.contact} onChange={(event) => setProfileDraft({ ...profileDraft, contact: event.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="avatar-label">{t("settings.avatar")}</label>
            <input data-testid="input-avatar-label" id="avatar-label" type="text" value={profileDraft.avatarLabel} onChange={(event) => setProfileDraft({ ...profileDraft, avatarLabel: event.target.value })} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="md:col-span-2 border-t border-slate-100 pt-5">
            <label className="block text-sm font-medium text-slate-700 mb-2">{t("settings.language")}</label>
            <LanguageSwitcher />
            <p className="mt-2 text-xs text-slate-500">{t("settings.languageHint")}</p>
          </div>
        </div>
      </div>

      {/* AI Configuration Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Bot className="w-5 h-5 text-blue-400" />
            <h2 className="font-semibold">{t("settings.aiEngine")}</h2>
          </div>
          {isLoading ? (
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded">{t("settings.checking")}</span>
          ) : isAiConfigured ? (
            <span className="flex items-center gap-1.5 text-xs bg-green-500/20 text-green-400 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {t("settings.connected")}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-medium border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5" />
              {t("status.demo")}
            </span>
          )}
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className={`shrink-0 p-4 rounded-xl border ${isAiConfigured ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
              <Zap className="w-8 h-8" />
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-lg font-medium text-slate-900">
                {isAiConfigured ? t("settings.aiActive") : t("settings.localAnalytics")}
              </h3>
              {isAiConfigured ? (
                <p className="text-slate-600 text-sm leading-relaxed max-w-3xl">
                  系统已成功连接至 DeepSeek 服务端引擎。当前正为您提供实时的深度经营分析、智能客服应答策略以及多维度商品优化建议。所有的 API 交互均在加密服务端进行，保障您的商业数据安全。
                </p>
              ) : (
                <div className="space-y-4 max-w-4xl">
                  <p className="text-slate-600 text-sm leading-relaxed">
                    系统当前未检测到服务端的 <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded border border-slate-200 font-mono text-xs">DEEPSEEK_API_KEY</code> 配置。应用正使用本地 Demo Analytics 模块为您提供模拟分析结果。
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 shadow-sm">
                    <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">{t("settings.unlockAi")}</p>
                      <p className="text-amber-700/90 leading-relaxed">
                        请在服务器端将您的 DeepSeek API 密钥配置为系统环境变量（Secret）。为严格保障账号安全，本系统禁止在浏览器前端页面直接输入或传输任何核心密钥。配置完成后，刷新页面即可接入完整智能经营服务。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Merchant Basics */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-900">{t("settings.storeInfo")}</h2>
          </div>
          <div className="p-6 space-y-5 flex-1">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("settings.storeName")}</label>
              <input 
                type="text" 
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("settings.industry")}</label>
              <select 
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
              >
                <option value="3C数码">3C数码</option>
                <option value="服饰鞋包">服饰鞋包</option>
                <option value="美妆个护">美妆个护</option>
                <option value="家居日用">家居日用</option>
                <option value="食品生鲜">食品生鲜</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("settings.currency")}</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                >
                  <option value="CNY">人民币 (CNY)</option>
                  <option value="USD">美元 (USD)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("settings.timezone")}</label>
                <select 
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
                >
                  <option value="Asia/Shanghai">北京时间 (UTC+8)</option>
                  <option value="America/New_York">纽约时间 (UTC-5)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Channels */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-900">{t("settings.channels")}</h2>
            </div>
            <div className="p-0">
              {channels.map((channel, idx) => (
                <div key={channel.id} className={`flex items-center justify-between px-6 py-4 ${idx !== channels.length - 1 ? 'border-b border-slate-100' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                      channel.id === 'taobao' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                      channel.id === 'jd' ? 'bg-red-50 text-red-600 border-red-100' :
                      'bg-pink-50 text-pink-600 border-pink-100'
                    }`}>
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">{channel.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {channel.status === 'connected' ? `上次同步: ${channel.syncTime}` : '暂未授权连接'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleChannel(channel.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      channel.status === 'connected' 
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    {channel.status === 'connected' ? '解除授权' : '去授权'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-slate-500" />
              <h2 className="font-semibold text-slate-900">{t("settings.notifications")}</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{t("settings.stockAlert")}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t("settings.stockAlertHint")}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifStock} onChange={(e) => setNotifStock(e.target.checked)} />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{t("settings.refundAlert")}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t("settings.refundAlertHint")}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifOrder} onChange={(e) => setNotifOrder(e.target.checked)} />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">{t("settings.dailyBrief")}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t("settings.dailyBriefHint")}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notifDaily} onChange={(e) => setNotifDaily(e.target.checked)} />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
