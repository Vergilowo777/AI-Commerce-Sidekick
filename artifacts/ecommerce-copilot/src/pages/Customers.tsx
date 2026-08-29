import { useState } from 'react';
import { Link } from 'wouter';
import { Users, Search, Filter, ChevronRight, Star, MoreHorizontal } from 'lucide-react';
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

const defaultCustomers = [
  { id: 'C1001', name: '李明', segment: '高净值', repurchaseRate: 0.85, aov: 1250, totalSpent: 12500, lastOrder: '2024-03-15' },
  { id: 'C1002', name: '王芳', segment: '忠诚客户', repurchaseRate: 0.65, aov: 450, totalSpent: 4500, lastOrder: '2024-03-10' },
  { id: 'C1003', name: '张伟', segment: '流失风险', repurchaseRate: 0.20, aov: 120, totalSpent: 240, lastOrder: '2023-11-20' },
  { id: 'C1004', name: '刘洋', segment: '新客户', repurchaseRate: 0.0, aov: 899, totalSpent: 899, lastOrder: '2024-03-17' },
  { id: 'C1005', name: '陈静', segment: '高净值', repurchaseRate: 0.92, aov: 2100, totalSpent: 35600, lastOrder: '2024-03-18' },
];

export default function Customers() {
  const store = useStore() as any;
  const { t } = useI18n();
  const customers = store.customers || defaultCustomers;
  
  const [search, setSearch] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');

  const filtered = customers.filter((c: any) => {
    const matchSearch = c.name.includes(search) || c.id.includes(search);
    const matchSegment = filterSegment === 'all' || c.level === filterSegment;
    return matchSearch && matchSegment;
  });

  return (
    <div className="max-w-6xl">
      <Breadcrumb items={[{ label: t('ui.home'), href: '/' }, { label: t('pages.customers') }]} />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('pages.customers')}</h1>
          <p className="text-slate-500 mt-1">{t('customers.subtitle')}</p>
        </div>
        <Link href="/data-import" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2">
          <Users className="w-4 h-4" />
          {t('customers.import')}
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder={t('customers.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-500" />
            <select 
              value={filterSegment}
              onChange={(e) => setFilterSegment(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="all">{t('ui.all')}</option>
              <option value="黑金会员">黑金会员</option>
              <option value="金牌会员">金牌会员</option>
              <option value="银牌会员">银牌会员</option>
              <option value="普通会员">普通会员</option>
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/50 border-b border-slate-100 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">{t('customers.customer')}</th><th className="px-6 py-4 font-medium">{t('customers.segment')}</th><th className="px-6 py-4 font-medium">{t('customers.repurchase')}</th><th className="px-6 py-4 font-medium">{t('customers.aov')}</th><th className="px-6 py-4 font-medium">{t('customers.spent')}</th><th className="px-6 py-4 font-medium">{t('customers.lastOrder')}</th><th className="px-6 py-4 font-medium text-right">{t('ui.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((customer: any) => (
                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{customer.name}</div>
                        <div className="text-xs text-slate-500">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      customer.level === '黑金会员' ? 'bg-purple-100 text-purple-700' :
                      customer.level === '金牌会员' ? 'bg-amber-100 text-amber-700' :
                      customer.refundCount > 2 ? 'bg-red-100 text-red-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {customer.level === '黑金会员' && <Star className="w-3 h-3 mr-1" />}
                      {customer.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{Math.max(0, 100 - customer.refundCount * 12)}%</td>
                  <td className="px-6 py-4 text-slate-600">¥{Math.round(customer.totalSpent / customer.totalOrders).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">¥{customer.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500">{customer.lastOrderAt.slice(0, 10)}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/customers/${customer.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {t('ui.details')}
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    {t('customers.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
