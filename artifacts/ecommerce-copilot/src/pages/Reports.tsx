import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, FileText, BarChart, TrendingUp, PieChart, Users, Download, Eye } from 'lucide-react';
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

const defaultReports = [
  { id: 'R1001', title: '2024 Q1 销售与 GMV 分析', type: 'Sales', icon: BarChart, date: '2024-04-01', size: '2.4 MB', status: 'Ready' },
  { id: 'R1002', title: '智能库存健康度与预警预测', type: 'Inventory', icon: TrendingUp, date: '2024-03-28', size: '1.1 MB', status: 'Ready' },
  { id: 'R1003', title: '核心高净值客户群像分析', type: 'Customer', icon: Users, date: '2024-03-25', size: '3.8 MB', status: 'Ready' },
  { id: 'R1004', title: '多渠道投放转化 ROI 追踪', type: 'Channel', icon: PieChart, date: '2024-03-20', size: '1.9 MB', status: 'Ready' },
  { id: 'R1005', title: '618 大促前瞻营销策略', type: 'Marketing', icon: FileText, date: '2024-03-15', size: '4.2 MB', status: 'Ready' },
];

export default function Reports() {
  const store = useStore() as any;
  const { t } = useI18n();
  const reports = store.reports || defaultReports;

  return (
    <div className="max-w-6xl">
      <Breadcrumb items={[{ label: t('ui.home'), href: '/' }, { label: t('pages.reports') }]} />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('pages.reports')}</h1><p className="text-slate-500 mt-1">{t('reports.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report: any) => {
          const Icon = report.icon || FileText;
          return (
            <div key={report.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-6 flex-1">
                <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 line-clamp-2">{report.title}</h3>
                <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                  <span>{report.date}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>{report.size}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                  {report.status === 'Ready' ? t('ui.ready') : report.status}
                </span>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <Link href={`/reports/${report.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium">
                    <Eye className="w-4 h-4" />
                    {t('ui.details')}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
