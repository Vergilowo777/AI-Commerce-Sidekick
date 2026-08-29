import { useState } from 'react';
import { Link, useParams, useLocation } from 'wouter';
import { ChevronRight, User, ShoppingBag, MessageSquare, TrendingUp, Calendar, MapPin, Tag } from 'lucide-react';
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

const defaultCustomer = { 
  id: 'C1001', 
  name: '李明', 
  segment: '高净值', 
  repurchaseRate: 0.85, 
  aov: 1250, 
  totalSpent: 12500, 
  lastOrder: '2024-03-15',
  phone: '+86 138 **** 5678',
  location: '上海市, 浦东新区',
  tags: ['数码发烧友', '大促敏感', '高优客服'],
  orders: [
    { id: 'ORD-240315', date: '2024-03-15', amount: 2999, status: '已送达', items: ['智能无线蓝牙耳机 Pro', '无线充电板'] },
    { id: 'ORD-231111', date: '2023-11-11', amount: 899, status: '已送达', items: ['人体工学电竞椅'] },
    { id: 'ORD-230618', date: '2023-06-18', amount: 8602, status: '已送达', items: ['高端游戏主机'] },
  ]
};

export default function CustomerDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const store = useStore() as any;
  const { t } = useI18n();
  
  // Try to find in store, otherwise fallback to default mock
  const customers = store.customers || [defaultCustomer];
  const rawCustomer = customers.find((c: any) => c.id === params.id) || defaultCustomer;
  const relatedOrders = (store.orders || []).filter((order: any) => order.customerId === rawCustomer.id);
  const customer = {
    ...rawCustomer,
    segment: rawCustomer.level || rawCustomer.segment,
    aov: rawCustomer.aov ?? Math.round(rawCustomer.totalSpent / Math.max(rawCustomer.totalOrders, 1)),
    lastOrder: rawCustomer.lastOrderAt?.slice(0, 10) || rawCustomer.lastOrder,
    location: rawCustomer.location || `${t('customerDetail.preferredChannel')}：${rawCustomer.preferredChannel}`,
    tags: rawCustomer.tags || [rawCustomer.level, rawCustomer.preferredChannel, rawCustomer.refundCount > 2 ? '售后关注' : '稳定客户'],
    orders: relatedOrders.length ? relatedOrders.map((order: any) => ({
      ...order,
      items: [store.products.find((product: any) => product.id === order.productId)?.name || order.productId],
      date: order.date.slice(0, 10),
      status: order.status === 'refunded' ? '已退款' : order.status === 'pending' ? '待发货' : '履约中',
    })) : (rawCustomer.orders || []),
  };

  const handleAskSidekick = () => {
    if (store.setSidekickContext) {
      store.setSidekickContext({ page: customer.name, entityType: 'customer', entityId: customer.id, query: `分析客户 ${customer.name} 的复购与触达策略` });
    }
    setLocation('/sidekick');
  };

  return (
    <div className="max-w-5xl">
      <Breadcrumb items={[
        { label: t('ui.home'), href: '/' }, { label: t('pages.customers'), href: '/customers' },
        { label: customer.name }
      ]} />
      
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between mb-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold shadow-sm">
            {customer.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              {customer.name}
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                {customer.segment}
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Tag className="w-4 h-4" /> {customer.id}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {customer.location}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleAskSidekick}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4 text-blue-400" />
          {t('customerDetail.ask')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('customers.spent')}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">¥{customer.totalSpent.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('customerDetail.averageOrder')}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">¥{customer.aov.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-start gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">{t('customers.lastOrder')}</p>
            <p className="text-xl font-bold text-slate-900 mt-1">{customer.lastOrder}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="font-semibold text-slate-900">{t('customerDetail.tags')}</h2>
        </div>
        <div className="p-6 flex flex-wrap gap-2">
          {customer.tags.map((tag: string, i: number) => (
            <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-md text-sm font-medium">
              {tag}
            </span>
          ))}
          <button className="px-3 py-1.5 border border-dashed border-slate-300 text-slate-500 hover:text-slate-700 hover:border-slate-400 rounded-md text-sm font-medium transition-colors">
            + {t('customerDetail.addTag')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="font-semibold text-slate-900">{t('customerDetail.orders')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 bg-slate-50/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">{t('customerDetail.orderNo')}</th><th className="px-6 py-4 font-medium">{t('ui.date')}</th><th className="px-6 py-4 font-medium">{t('customerDetail.items')}</th><th className="px-6 py-4 font-medium">{t('ui.status')}</th><th className="px-6 py-4 font-medium text-right">{t('customerDetail.amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customer.orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900"><Link href={`/orders/${order.id}`} className="hover:text-blue-600">{order.id}</Link></td>
                  <td className="px-6 py-4 text-slate-500">{order.date}</td>
                  <td className="px-6 py-4 text-slate-700">
                    {order.items.join(', ')}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 text-right">
                    ¥{order.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
