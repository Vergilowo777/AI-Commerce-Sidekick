import { useState } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { ChevronRight, FileText, Sparkles, Download, Share2, Bot, Calendar, HardDrive } from 'lucide-react';
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

export default function ReportDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { addActivity } = useStore();
  const store = useStore() as any;
  const { t } = useI18n();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const storedReport = store.reports?.find((item: any) => item.id === params.id);
  const report = {
    id: params.id,
    title: storedReport?.title || '经营分析报告',
    date: storedReport?.generatedAt || '2024-04-01',
    size: '2.4 MB',
    type: storedReport?.type || '经营数据',
    content: `报告概要：
在2024年第一季度，全网 GMV 达到 ¥8,476,320，环比增长 12.5%。
天猫渠道依然是主力军，贡献了 45% 的营收；拼多多渠道虽然客单价较低，但订单量增速最快，达到了 35%。

关键发现：
1. 退款率略有上升，主要集中在 3C 数码品类。
2. 周末的下单转化率明显高于工作日。
3. "极简桌面加湿器"成为本季度爆款，库存周转率极高。`
  };

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsGenerating(false);
      setSummary(`AI 核心提炼：
1. **强劲增长**：Q1 总 GMV 突破 847万，环比增长 12.5%，表现优异。
2. **渠道分化**：天猫稳固基本盘，拼多多成新增长引擎（订单增速35%）。
3. **风险预警**：3C 数码品类退款率存在异常，建议立即排查供应链与物流延迟问题。
4. **行动建议**：加大拼多多渠道直通车投放，并针对"加湿器"提前备战 Q2 旺季库存。`);
      
      // Log demo action
      addActivity({
        time: new Date().toISOString().replace('T', ' ').slice(0, 19),
        operator: '系统自动',
        action: '生成数据报告 AI 摘要',
        target: report.title,
        status: 'success'
      });
    }, 1500);
  };

  const handleAskContext = () => {
    if (store.setSidekickContext) {
      store.setSidekickContext({ page: report.title, entityType: 'report', entityId: report.id, query: summary || storedReport?.summary });
    }
    setLocation('/sidekick');
  };

  return (
    <div className="max-w-5xl">
      <Breadcrumb items={[
        { label: t('ui.home'), href: '/' }, { label: t('pages.reports'), href: '/reports' },
        { label: report.title }
      ]} />

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{report.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {report.date}</span>
                <span className="flex items-center gap-1"><HardDrive className="w-4 h-4" /> {report.size}</span>
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">{report.type}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              {t('reportDetail.share')}
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t('reportDetail.download')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-4">{t('reportDetail.content')}</h2>
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-100 leading-relaxed">
                {report.content}
              </pre>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl shadow-lg border border-slate-700 p-6 relative overflow-hidden text-white">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Bot className="w-24 h-24" />
            </div>
            
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2 relative z-10">
              <Sparkles className="w-5 h-5 text-blue-400" />
              {t('reportDetail.aiSummary')}
            </h3>
            
            {!summary ? (
              <div className="relative z-10">
                <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                  {t('reportDetail.aiHint')}
                </p>
                <button 
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-80"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isGenerating ? t('reportDetail.analyzing') : t('reportDetail.generate')}
                </button>
              </div>
            ) : (
              <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap mb-4">
                  {summary}
                </div>
                <button 
                  onClick={handleAskContext}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Bot className="w-4 h-4" />
                  {t('reportDetail.ask')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
