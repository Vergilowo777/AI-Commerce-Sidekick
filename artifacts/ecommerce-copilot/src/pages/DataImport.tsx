import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronRight, Database, UploadCloud, CheckCircle2, FileJson, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
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

const steps = [
  "选择数据类型",
  "上传文件",
  "字段映射",
  "数据校验",
  "预览确认",
  "完成导入"
];

export default function DataImport() {
  const [, setLocation] = useLocation();
  const { addActivity } = useStore();
  const { t } = useI18n();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [dataType, setDataType] = useState<string>('orders');
  const [fileSelected, setFileSelected] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);

  const nextStep = () => {
    if (currentStep === 3) { // Going to validation step
      setCurrentStep(4);
      setIsValidating(true);
      setValidationProgress(0);
      
      const interval = setInterval(() => {
        setValidationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsValidating(false);
            setCurrentStep(5); // Auto jump to preview after validation
            return 100;
          }
          return prev + 25;
        });
      }, 500);
      return;
    }
    
    if (currentStep === 5) { // Going to finish
      addActivity({
        time: new Date().toISOString().replace('T', ' ').slice(0, 19),
        operator: '李运营',
        action: `批量导入 ${dataType === 'orders' ? '订单' : dataType === 'customers' ? '客户' : '商品'} 数据`,
        target: '2,450 条记录',
        status: 'success'
      });
    }
    
    setCurrentStep(Math.min(6, currentStep + 1));
  };

  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">{t('import.selectType')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'orders', title: '订单数据', desc: '导入历史订单、发货状态及退款记录' },
                { id: 'customers', title: '客户数据', desc: '导入客户档案、联系方式与会员标签' },
                { id: 'products', title: '商品目录', desc: '导入 SKU、价格体系与初始库存' },
              ].map(type => (
                <div 
                  key={type.id}
                  onClick={() => setDataType(type.id)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    dataType === type.id 
                      ? 'border-blue-600 bg-blue-50 shadow-sm' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                    <Database className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900">{type.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{type.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">{t('import.upload')}</h2>
            <div 
              onClick={() => setFileSelected(true)}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                fileSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              {fileSelected ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <FileJson className="w-8 h-8" />
                  </div>
                  <p className="font-medium text-slate-900">data_export_2024.csv</p>
                  <p className="text-sm text-slate-500 mt-1">大小: 2.4 MB • 2,450 条记录</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <p className="font-medium text-slate-900 mb-1">{t('import.dropFile')}</p><p className="text-sm text-slate-500">{t('import.fileHint')}</p>
                </div>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">{t('import.mapping')}</h2><p className="text-sm text-slate-500 mb-4">{t('import.mappingHint')}</p>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-medium text-slate-700">源文件列头</th>
                    <th className="px-6 py-3 font-medium text-slate-700">预览数据 (第一行)</th>
                    <th className="px-6 py-3 font-medium text-slate-700">目标系统字段</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { source: 'order_id', preview: 'ORD-202403-001', target: '订单ID (主键)' },
                    { source: 'create_time', preview: '2024-03-20 10:30', target: '创建时间' },
                    { source: 'total_amount', preview: '299.00', target: '订单总金额' },
                    { source: 'customer_name', preview: '张三', target: '客户姓名' },
                  ].map((row, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-6 py-3 font-medium text-slate-900">{row.source}</td>
                      <td className="px-6 py-3 text-slate-500">{row.preview}</td>
                      <td className="px-6 py-3">
                        <select className="w-full border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none">
                          <option>{row.target}</option>
                          <option>忽略此列</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 py-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-xl font-bold text-slate-900">{t('import.validating')}</h2>
            <div className="w-full max-w-md bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${validationProgress}%` }}
              ></div>
            </div>
            <p className="text-slate-500 font-medium">{validationProgress}% 已完成</p>
            <div className="text-sm text-slate-400 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
              {t('import.scanning')}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">校验完成：预览即将导入的数据</h2>
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-lg font-medium border border-green-100">
                <CheckCircle2 className="w-4 h-4" />
                2,450 条记录校验通过，0 条错误
              </div>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 font-medium text-slate-700">订单ID</th>
                    <th className="px-6 py-3 font-medium text-slate-700">创建时间</th>
                    <th className="px-6 py-3 font-medium text-slate-700">金额</th>
                    <th className="px-6 py-3 font-medium text-slate-700">客户</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { id: 'ORD-202403-001', time: '2024-03-20 10:30', amount: '¥299.00', name: '张三' },
                    { id: 'ORD-202403-002', time: '2024-03-20 11:15', amount: '¥1,299.00', name: '李四' },
                    { id: 'ORD-202403-003', time: '2024-03-20 12:05', amount: '¥89.00', name: '王五' },
                  ].map((row, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-6 py-3 font-medium text-slate-900">{row.id}</td>
                      <td className="px-6 py-3 text-slate-500">{row.time}</td>
                      <td className="px-6 py-3 text-slate-900">{row.amount}</td>
                      <td className="px-6 py-3 text-slate-500">{row.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-slate-50 text-center py-2 text-xs text-slate-500 border-t border-slate-100">
                仅显示前 3 条记录...
              </div>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="py-12 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('import.success')}</h2><p className="text-slate-500">{t('import.successHint')}</p>
            </div>
            <div className="flex gap-4 mt-4">
              <button 
                onClick={() => setLocation(dataType === 'orders' ? '/orders' : dataType === 'customers' ? '/customers' : '/products')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                {t('import.viewData')}
              </button>
              <button 
                onClick={() => { setCurrentStep(1); setFileSelected(false); }}
                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                {t('import.continue')}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: t('ui.home'), href: '/' }, { label: t('pages.import') }]} />
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-6">
          <div className="flex items-center justify-between">
            {steps.map((stepName, index) => {
              const stepNum = index + 1;
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;
              return (
                <div key={index} className="flex flex-col items-center relative z-10 w-1/6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-2 transition-colors ${
                    isActive ? 'bg-blue-600 text-white shadow-md' :
                    isPast ? 'bg-blue-100 text-blue-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : stepNum}
                  </div>
                  <span className={`text-xs font-medium text-center ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                    {stepName}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Progress Line */}
          <div className="relative -mt-10 mb-8 mx-auto w-5/6 h-0.5 bg-slate-100 z-0">
            <div 
              className="absolute left-0 top-0 h-full bg-blue-200 transition-all duration-300" 
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8 md:p-12 min-h-[400px]">
          {renderStepContent()}
        </div>

        {currentStep < 6 && currentStep !== 4 && (
          <div className="border-t border-slate-100 bg-slate-50/50 p-6 flex items-center justify-between">
            <button 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {t('import.previous')}
            </button>
            <button 
              onClick={nextStep}
              disabled={(currentStep === 2 && !fileSelected)}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              {currentStep === 5 ? t('import.confirm') : t('import.next')} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
