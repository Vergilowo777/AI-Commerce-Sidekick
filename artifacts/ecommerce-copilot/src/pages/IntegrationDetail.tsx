import { useState } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { ChevronRight, ShieldCheck, Zap, Activity, ArrowRight, CheckCircle2, Lock } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useI18n } from '@/lib/i18n';

const Breadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => (
  <nav className="flex text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
    <ol className="flex items-center space-x-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {item.href ? (
            <Link href={item.href} className="hover:text-blue-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />}
        </li>
      ))}
    </ol>
  </nav>
);

const integrationData: Record<string, any> = {
  douyin: { name: '抖音小店', status: 'disconnected', color: 'bg-slate-900 text-white' },
  taobao: { name: '淘宝 / 天猫', status: 'connected', color: 'bg-orange-50 text-orange-600' },
  jd: { name: '京东', status: 'connected', color: 'bg-red-50 text-red-600' },
  pdd: { name: '拼多多', status: 'disconnected', color: 'bg-pink-50 text-pink-600' },
  wechat: { name: '微信小商店', status: 'disconnected', color: 'bg-green-50 text-green-600' },
  shopify: { name: 'Shopify', status: 'disconnected', color: 'bg-emerald-50 text-emerald-600' },
};

export default function IntegrationDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { addActivity, integrations, connectIntegration } = useStore();
  const { t } = useI18n();
  
  const id = params.id || 'INT-001';
  const storedIntegration = integrations.find((item) => item.id === id);
  const info = storedIntegration
    ? { name: storedIntegration.name, status: storedIntegration.status, color: 'bg-blue-50 text-blue-600' }
    : integrationData[id] || integrationData.douyin;
  
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState(info.status);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setStep(2);
    }, 1500);
  };

  const handleComplete = () => {
    setStatus('connected');
    connectIntegration(id);
    addActivity({
      time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      operator: '管理员',
      action: `完成 ${info.name} 渠道 Demo 授权模拟`,
      target: 'Demo 同步状态开启',
      status: 'success'
    });
    setLocation('/integrations');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[
        { label: t('ui.home'), href: '/' }, { label: t('pages.integrations'), href: '/integrations' },
        { label: `${info.name} ${t('integrations.configuration')}` }
      ]} />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl shadow-sm border border-slate-200/50 ${info.color}`}>
              {info.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{info.name} {t('integrations.integration')}</h1>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className={`inline-flex items-center gap-1 font-medium ${status === 'connected' ? 'text-green-600' : 'text-slate-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-slate-300'}`} />
                   {status === 'connected' ? t('integrationDetail.connected') : t('integrationDetail.disconnected')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {status === 'connected' ? (
          <div className="p-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 flex items-start gap-4 mb-8">
              <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-green-800">{t('integrationDetail.healthy')}</h3><p className="text-green-700 mt-1 text-sm">{t('integrationDetail.healthyHint')}</p>
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-4">{t('integrationDetail.capabilities')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-3 bg-slate-50">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-slate-700">{t('integrationDetail.orders')}</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-3 bg-slate-50">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-slate-700">{t('integrationDetail.inventory')}</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-3 bg-slate-50">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-slate-700">{t('integrationDetail.refunds')}</span>
              </div>
              <div className="border border-slate-200 rounded-lg p-4 flex items-center gap-3 bg-slate-50">
                <Activity className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-slate-700">{t('integrationDetail.customers')}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            {step === 1 ? (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{t('integrationDetail.demoAuthorization')}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {t('integrationDetail.authorizationHint', `This MVP simulates authorization for ${info.name} only.`)}
                  </p>
                </div>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <ShieldCheck className="w-5 h-5 text-slate-400" /> {t('integrationDetail.permissionOrders')}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <ShieldCheck className="w-5 h-5 text-slate-400" /> {t('integrationDetail.permissionInventory')}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Lock className="w-5 h-5 text-amber-500" /> {t('integrationDetail.permissionSafe')}
                  </div>
                </div>

                <button 
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto min-w-[200px]"
                >
                  {isConnecting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{t('integrationDetail.authorize', `Authorize ${info.name}`)} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            ) : (
              <div className="py-8 flex flex-col items-center text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('integrationDetail.completed')}</h2><p className="text-slate-500">{t('integrationDetail.completedHint')}</p>
                </div>
                <div className="flex gap-4 mt-4">
                  <button 
                    onClick={handleComplete}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                  >
                    {t('integrationDetail.finish')}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
