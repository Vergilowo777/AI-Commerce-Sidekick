import { useSyncExternalStore } from 'react';
import { format, subDays } from 'date-fns';

export type Language = 'zh-CN' | 'zh-TW' | 'en' | 'ja' | 'ko';

export type UserProfile = {
  displayName: string;
  merchantName: string;
  contact: string;
  avatarLabel: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  cost: number;
  sales: number;
  revenue: number;
  profitMargin: number;
  sales30d: number;
  salesPrevious30d: number;
  revenue30d: number;
  profit30d: number;
  refundRate: number;
  status: 'active' | 'draft' | 'archived';
};

export type SKU = {
  sku: string;
  productId: string;
  stock: number;
  alertLevel: number;
  sold7d: number;
  margin: number;
  channel: string;
};

export type Order = {
  id: string;
  productId: string;
  customerId: string;
  channel: string;
  amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'refunded';
  refunded: boolean;
  date: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  level: '普通会员' | '银牌会员' | '金牌会员' | '黑金会员';
  totalOrders: number;
  totalSpent: number;
  refundCount: number;
  preferredChannel: string;
  lastOrderAt: string;
};

export type Activity = {
  id: string;
  time: string;
  operator: string;
  action: string;
  target: string;
  status: 'success' | 'pending' | 'failed';
};

export type Alert = {
  id: string;
  type: 'inventory' | 'anomaly' | 'opportunity';
  category: 'inventory' | 'refund' | 'margin' | 'sales' | 'profit';
  severity: 'high' | 'medium' | 'low';
  status: 'open' | 'resolved' | 'dismissed';
  title: string;
  explanation: string;
  action: string;
  productId?: string;
  skuId?: string;
  orderId?: string;
  metric: number;
  baseline: number;
  trend: 'up' | 'down' | 'stable';
  causes: string[];
  suggestions: string[];
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: 'deepseek' | 'demo';
  notice?: string | null;
  conversationId?: string;
  context?: SidekickContext | null;
};

export type Report = {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'product' | 'channel' | 'profit';
  period: string;
  summary: string;
  generatedAt: string;
  status: 'ready' | 'generating';
  metrics: { label: string; value: number; change?: number }[];
};

export type AgentTask = {
  id: string;
  title: string;
  status: 'pending_confirmation' | 'completed' | 'cancelled';
  actionType: 'restock' | 'update_threshold' | 'generate_report' | 'generate_copy';
  payload: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
};

export type Integration = {
  id: string;
  name: string;
  provider: '淘宝' | '天猫' | '京东' | '拼多多' | '抖音电商' | 'ERP';
  status: 'connected' | 'disconnected';
  lastSyncedAt?: string;
};

export type Notification = {
  id: string;
  title: string;
  content: string;
  type: 'alert' | 'task' | 'system';
  read: boolean;
  createdAt: string;
  relatedAlertId?: string;
  relatedTaskId?: string;
};

export type SidekickContext = {
  page: string;
  entityType?: 'product' | 'sku' | 'order' | 'customer' | 'alert' | 'report';
  entityId?: string;
  query?: string;
};

export type Conversation = {
  id: string;
  title: string;
  context: SidekickContext | null;
  createdAt: string;
  updatedAt: string;
};

export type BusinessMetrics = {
  todayGmv: number;
  yesterdayGmv: number;
  todayProfit: number;
  yesterdayProfit: number;
  todayOrders: number;
  yesterdayOrders: number;
  averageOrderValue: number;
  refundRate: number;
  previousRefundRate: number;
  inventoryRisks: number;
  currentMonthGmv: number;
  previousMonthGmv: number;
  currentMonthProfit: number;
  previousMonthProfit: number;
};

export type TrendPoint = {
  period: string;
  gmv: number;
  profit: number;
  orders: number;
};

export type ChannelPerformance = {
  name: string;
  gmv: number;
  profit: number;
  orders: number;
  conversionRate: number;
};

interface StoreState {
  isAuthenticated: boolean;
  language: Language;
  profile: UserProfile;
  login: (remember?: boolean) => void;
  logout: () => void;
  setLanguage: (language: Language) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  
  products: Product[];
  skus: SKU[];
  orders: Order[];
  customers: Customer[];
  reports: Report[];
  tasks: AgentTask[];
  integrations: Integration[];
  notifications: Notification[];
  conversations: Conversation[];
  activeConversationId: string | null;
  sidekickContext: SidekickContext | null;
  activities: Activity[];
  alerts: Alert[];
  messages: Message[];
  metrics: BusinessMetrics;
  trendData: TrendPoint[];
  channelPerformance: ChannelPerformance[];
  
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  addProduct: (product: Product) => void;
  updateSKUAlertLevel: (skuId: string, newLevel: number) => void;
  updateSKUAlertLevelWithActivity: (skuId: string, newLevel: number) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  removeAlert: (alertId: string) => void;
  createConversation: (title: string, context?: SidekickContext | null) => void;
  setActiveConversation: (id: string) => void;
  setSidekickContext: (context: SidekickContext | null) => void;
  createAgentTask: (input: Omit<AgentTask, 'id' | 'status' | 'createdAt' | 'completedAt'>) => void;
  confirmAgentTask: (id: string) => void;
  cancelAgentTask: (id: string) => void;
  resolveAlert: (id: string) => void;
  markNotificationRead: (id: string) => void;
  connectIntegration: (id: string) => void;
}

const initialProducts: Product[] = [
  { id: 'P1001', name: '智能无线蓝牙耳机 Pro', category: '3C数码', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80', price: 299, cost: 130, sales: 8250, revenue: 2466750, profitMargin: 0.565, sales30d: 820, salesPrevious30d: 900, revenue30d: 245180, profit30d: 103880, refundRate: 0.032, status: 'active' },
  { id: 'P1002', name: '人体工学电竞椅', category: '家居办公', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=200&q=80', price: 899, cost: 560, sales: 2340, revenue: 2103660, profitMargin: 0.377, sales30d: 188, salesPrevious30d: 170, revenue30d: 169012, profit30d: 58640, refundRate: 0.041, status: 'active' },
  { id: 'P1003', name: '极简桌面加湿器', category: '生活电器', image: 'https://images.unsplash.com/photo-1626291689255-b0400fb864b4?w=200&q=80', price: 89, cost: 36, sales: 12100, revenue: 1076900, profitMargin: 0.596, sales30d: 1200, salesPrevious30d: 1020, revenue30d: 106800, profit30d: 48720, refundRate: 0.12, status: 'active' },
  { id: 'P1004', name: '快充移动电源 20000mAh', category: '3C数码', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=200&q=80', price: 159, cost: 128, sales: 18400, revenue: 2925600, profitMargin: 0.195, sales30d: 1600, salesPrevious30d: 1350, revenue30d: 254400, profit30d: 32640, refundRate: 0.052, status: 'active' },
  { id: 'P1005', name: '模块化桌面收纳架', category: '家居办公', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=200&q=80', price: 129, cost: 62, sales: 4260, revenue: 549540, profitMargin: 0.519, sales30d: 560, salesPrevious30d: 610, revenue30d: 72240, profit30d: 34680, refundRate: 0.026, status: 'active' },
];

const initialSKUs: SKU[] = [
  { sku: 'A102-WHT', productId: 'P1001', stock: 12, alertLevel: 15, sold7d: 45, margin: 0.6, channel: '淘宝' },
  { sku: 'A102-BLK', productId: 'P1001', stock: 240, alertLevel: 50, sold7d: 120, margin: 0.6, channel: '天猫' },
  { sku: 'A102-BLU', productId: 'P1001', stock: 8, alertLevel: 20, sold7d: 15, margin: 0.6, channel: '京东' },
  { sku: 'CHR-001', productId: 'P1002', stock: 45, alertLevel: 10, sold7d: 12, margin: 0.5, channel: '京东' },
  { sku: 'HUM-W', productId: 'P1003', stock: 150, alertLevel: 30, sold7d: 80, margin: 0.61, channel: '拼多多' },
];

const initialOrders: Order[] = [
  ['ORD-24031801', 'P1001', 'C1001', '天猫', 299, 'delivered', 0],
  ['ORD-24031802', 'P1004', 'C1002', '拼多多', 159, 'shipped', 0],
  ['ORD-24031803', 'P1003', 'C1003', '淘宝', 178, 'refunded', 0],
  ['ORD-24031804', 'P1002', 'C1004', '京东', 899, 'pending', 0],
  ['ORD-24031701', 'P1004', 'C1005', '天猫', 318, 'delivered', 1],
  ['ORD-24031702', 'P1001', 'C1001', '淘宝', 299, 'shipped', 1],
  ['ORD-24031703', 'P1005', 'C1002', '京东', 129, 'delivered', 1],
  ['ORD-24031601', 'P1003', 'C1003', '拼多多', 89, 'refunded', 2],
  ['ORD-24031602', 'P1004', 'C1005', '拼多多', 159, 'delivered', 2],
  ['ORD-24031603', 'P1001', 'C1004', '天猫', 598, 'delivered', 2],
  ['ORD-24031501', 'P1002', 'C1001', '京东', 899, 'shipped', 3],
  ['ORD-24031502', 'P1003', 'C1003', '淘宝', 267, 'refunded', 3],
  ['ORD-24031401', 'P1004', 'C1002', '天猫', 159, 'delivered', 4],
  ['ORD-24031402', 'P1005', 'C1005', '淘宝', 258, 'delivered', 4],
  ['ORD-24031301', 'P1001', 'C1004', '京东', 299, 'delivered', 5],
  ['ORD-24031201', 'P1003', 'C1003', '拼多多', 89, 'refunded', 6],
].map(([id, productId, customerId, channel, amount, status, daysAgo]) => ({
  id: id as string,
  productId: productId as string,
  customerId: customerId as string,
  channel: channel as string,
  amount: amount as number,
  status: status as Order['status'],
  refunded: status === 'refunded',
  date: format(subDays(new Date(), daysAgo as number), 'yyyy-MM-dd HH:mm:ss'),
}));

const initialCustomers: Customer[] = [
  { id: 'C1001', name: '王小雅', phone: '138****1024', level: '黑金会员', totalOrders: 18, totalSpent: 5280, refundCount: 0, preferredChannel: '天猫', lastOrderAt: '2024-03-18 10:21:00' },
  { id: 'C1002', name: '陈昊', phone: '139****3816', level: '金牌会员', totalOrders: 9, totalSpent: 2156, refundCount: 1, preferredChannel: '拼多多', lastOrderAt: '2024-03-18 09:42:00' },
  { id: 'C1003', name: '林雨晴', phone: '136****7752', level: '银牌会员', totalOrders: 6, totalSpent: 890, refundCount: 4, preferredChannel: '淘宝', lastOrderAt: '2024-03-18 08:35:00' },
  { id: 'C1004', name: '赵一鸣', phone: '186****4209', level: '金牌会员', totalOrders: 12, totalSpent: 3695, refundCount: 0, preferredChannel: '京东', lastOrderAt: '2024-03-18 08:08:00' },
  { id: 'C1005', name: '周敏', phone: '137****6138', level: '普通会员', totalOrders: 3, totalSpent: 606, refundCount: 0, preferredChannel: '天猫', lastOrderAt: '2024-03-17 16:20:00' },
];

const metrics: BusinessMetrics = {
  todayGmv: 42850,
  yesterdayGmv: 38120,
  todayProfit: 11280,
  yesterdayProfit: 13090,
  todayOrders: 342,
  yesterdayOrders: 331,
  averageOrderValue: 125.3,
  refundRate: 0.048,
  previousRefundRate: 0.029,
  inventoryRisks: 2,
  currentMonthGmv: 847632,
  previousMonthGmv: 803440,
  currentMonthProfit: 238560,
  previousMonthProfit: 252420,
};

const trendData: TrendPoint[] = [
  { period: '第1周', gmv: 116000, profit: 37000, orders: 612 },
  { period: '第2周', gmv: 128000, profit: 39000, orders: 671 },
  { period: '第3周', gmv: 139000, profit: 40000, orders: 719 },
  { period: '第4周', gmv: 145000, profit: 41000, orders: 748 },
  { period: '第5周', gmv: 151000, profit: 39000, orders: 781 },
  { period: '本周', gmv: 168632, profit: 42560, orders: 837 },
];

const channelPerformance: ChannelPerformance[] = [
  { name: '天猫', gmv: 318000, profit: 103000, orders: 1510, conversionRate: 0.046 },
  { name: '淘宝', gmv: 214000, profit: 67000, orders: 1128, conversionRate: 0.038 },
  { name: '京东', gmv: 184000, profit: 51000, orders: 824, conversionRate: 0.041 },
  { name: '拼多多', gmv: 131632, profit: 17560, orders: 906, conversionRate: 0.029 },
];

const initialAlerts: Alert[] = [
  { id: 'AL-001', type: 'inventory', category: 'inventory', severity: 'high', status: 'open', title: '智能无线蓝牙耳机(白色) 库存告警', explanation: '当前库存仅剩 12 件，低于预警阈值(15件)。按过去7天销量预测，将在2天内售罄。', action: '一键补货', productId: 'P1001', skuId: 'A102-WHT', metric: 12, baseline: 15, trend: 'down', causes: ['近7日售出45件', '白色款补货尚未入仓'], suggestions: ['补货100件', '将预警阈值调整至30件'] },
  { id: 'AL-002', type: 'anomaly', category: 'refund', severity: 'high', status: 'open', title: '极简桌面加湿器退款率异常', explanation: '过去24小时退款率升至12%，显著高于3%的基线。', action: '查看退款订单', productId: 'P1003', orderId: 'ORD-24031803', metric: 0.12, baseline: 0.03, trend: 'up', causes: ['客户反馈发货较慢', '包装破损投诉增加'], suggestions: ['核查近期开奖订单', '优化仓配时效与包装'] },
  { id: 'AL-003', type: 'anomaly', category: 'margin', severity: 'high', status: 'open', title: '快充移动电源毛利偏低', explanation: '当前毛利率19.5%，低于25%的经营红线。', action: '查看定价建议', productId: 'P1004', metric: 0.195, baseline: 0.25, trend: 'down', causes: ['采购成本上升', '拼多多渠道补贴加大'], suggestions: ['将售价上调至169元', '与供应商重谈采购价'] },
  { id: 'AL-004', type: 'anomaly', category: 'sales', severity: 'medium', status: 'open', title: '模块化桌面收纳架销量下滑', explanation: '近30日销量560件，较前30日610件下降8.2%。', action: '生成营销方案', productId: 'P1005', metric: 560, baseline: 610, trend: 'down', causes: ['搜索曝光下降', '竞品开启促销'], suggestions: ['更新主图和标题', '投放站内关键词广告'] },
  { id: 'AL-005', type: 'anomaly', category: 'profit', severity: 'high', status: 'open', title: 'GMV增长但利润下滑', explanation: '本月GMV环比增长5.5%，利润却环比下降5.5%。', action: '查看利润拆解', metric: 238560, baseline: 252420, trend: 'down', causes: ['低毛利移动电源销量占比提升', '退款率上升'], suggestions: ['控制低毛利渠道投放', '优先处理加湿器退款问题'] },
];

const initialReports: Report[] = [
  { id: 'RP-001', title: '3月18日经营日报', type: 'daily', period: '2024-03-18', summary: 'GMV增长12.4%，但利润受退款和低毛利商品影响下滑。', generatedAt: '2024-03-18 09:00:00', status: 'ready', metrics: [{ label: 'GMV', value: 42850, change: 0.124 }, { label: '利润', value: 11280, change: -0.138 }] },
  { id: 'RP-002', title: '第11周周度复盘', type: 'weekly', period: '2024-W11', summary: '耳机仍是增长主力，建议优先保障白色款库存。', generatedAt: '2024-03-17 20:00:00', status: 'ready', metrics: [{ label: 'GMV', value: 168632, change: 0.117 }, { label: '订单', value: 837, change: 0.074 }] },
  { id: 'RP-003', title: '加湿器退款专项报告', type: 'product', period: '2024-03-12 至 2024-03-18', summary: '退款集中于发货时效和包装问题。', generatedAt: '2024-03-18 08:40:00', status: 'ready', metrics: [{ label: '退款率', value: 0.12, change: 0.09 }] },
  { id: 'RP-004', title: '全渠道效能分析', type: 'channel', period: '2024-03', summary: '天猫贡献最高利润，拼多多需改善利润率。', generatedAt: '2024-03-16 18:00:00', status: 'ready', metrics: [{ label: '天猫GMV', value: 318000 }, { label: '拼多多利润', value: 17560 }] },
  { id: 'RP-005', title: '3月利润结构报告', type: 'profit', period: '2024-03', summary: 'GMV上涨而利润下降，移动电源成本是核心拖累。', generatedAt: '2024-03-18 09:10:00', status: 'ready', metrics: [{ label: '本月利润', value: 238560, change: -0.055 }, { label: '本月GMV', value: 847632, change: 0.055 }] },
];

const initialActivities: Activity[] = [
  { id: '1', time: format(subDays(new Date(), 0), 'yyyy-MM-dd 10:30:00'), operator: '系统自动', action: '自动生成商品文案', target: 'P1004', status: 'success' },
  { id: '2', time: format(subDays(new Date(), 0), 'yyyy-MM-dd 09:15:22'), operator: '李运营', action: '调整商品价格', target: 'P1003', status: 'success' },
  { id: '3', time: format(subDays(new Date(), 1), 'yyyy-MM-dd 16:45:00'), operator: 'AI 助手', action: '回复客户评价', target: 'P1001', status: 'success' }
];

const initialMessages: Message[] = [
  { id: '1', role: 'assistant', content: '早上好！我是您的 AI 经营副驾驶。为您整理了今天的核心数据：昨日全网 GMV 突破 4.2 万，但有 2 个商品需要您立即关注（库存不足）。需要我为您做什么？', timestamp: new Date().toISOString() }
];

const initialConversations: Conversation[] = [
  { id: 'CV-001', title: '今日经营诊断', context: { page: 'dashboard' }, createdAt: '2024-03-18 09:00:00', updatedAt: '2024-03-18 09:00:00' },
];

const initialTasks: AgentTask[] = [
  { id: 'TK-001', title: '补货白色耳机 100 件', status: 'pending_confirmation', actionType: 'restock', payload: { skuId: 'A102-WHT', quantity: 100 }, createdAt: '2024-03-18 09:05:00' },
  { id: 'TK-002', title: '生成移动电源优化文案', status: 'completed', actionType: 'generate_copy', payload: { productId: 'P1004' }, createdAt: '2024-03-18 08:50:00', completedAt: '2024-03-18 08:55:00' },
];

const initialIntegrations: Integration[] = [
  { id: 'INT-001', name: '天猫旗舰店', provider: '天猫', status: 'connected', lastSyncedAt: '2024-03-18 10:25:00' },
  { id: 'INT-002', name: '淘宝店铺', provider: '淘宝', status: 'connected', lastSyncedAt: '2024-03-18 10:24:00' },
  { id: 'INT-003', name: '京东店铺', provider: '京东', status: 'connected', lastSyncedAt: '2024-03-18 10:23:00' },
  { id: 'INT-004', name: '拼多多店铺', provider: '拼多多', status: 'disconnected' },
  { id: 'INT-005', name: '抖音电商', provider: '抖音电商', status: 'disconnected' },
  { id: 'INT-006', name: '聚水潭 ERP', provider: 'ERP', status: 'connected', lastSyncedAt: '2024-03-18 10:22:00' },
];

const initialNotifications: Notification[] = [
  { id: 'NT-001', title: '白色耳机库存紧急', content: 'A102-WHT 仅剩12件，建议立即补货。', type: 'alert', read: false, createdAt: '2024-03-18 10:20:00', relatedAlertId: 'AL-001' },
  { id: 'NT-002', title: '待确认 AI 操作', content: '补货白色耳机100件等待您的确认。', type: 'task', read: false, createdAt: '2024-03-18 09:05:00', relatedTaskId: 'TK-001' },
];

let generatedId = 1;
const nextId = (prefix: string) => `${prefix}-${String(generatedId++).padStart(4, '0')}`;

type StorePatch = Partial<StoreState> | ((state: StoreState) => Partial<StoreState>);

const listeners = new Set<() => void>();

let storeState: StoreState;

const setStoreState = (patch: StorePatch) => {
  const nextPatch = typeof patch === 'function' ? patch(storeState) : patch;
  storeState = { ...storeState, ...nextPatch };
  listeners.forEach((listener) => listener());
};

storeState = {
  isAuthenticated: typeof window !== 'undefined' && window.localStorage.getItem('sidekick_demo_session') === '1',
  language: (typeof window !== 'undefined' && (window.localStorage.getItem('sidekick_language') as Language)) || 'zh-CN',
  profile: {
    displayName: '演示账户',
    merchantName: '智营优选旗舰店',
    contact: 'demo_admin@example.com',
    avatarLabel: 'DEMO',
  },
  login: (remember = false) => {
    if (typeof window !== 'undefined') {
      if (remember) window.localStorage.setItem('sidekick_demo_session', '1');
      else window.localStorage.removeItem('sidekick_demo_session');
    }
    setStoreState({ isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') window.localStorage.removeItem('sidekick_demo_session');
    setStoreState({ isAuthenticated: false });
  },
  setLanguage: (language) => {
    if (typeof window !== 'undefined') window.localStorage.setItem('sidekick_language', language);
    setStoreState({ language });
  },
  updateProfile: (profile) => setStoreState((state) => ({ profile: { ...state.profile, ...profile } })),

  products: initialProducts,
  skus: initialSKUs,
  orders: initialOrders,
  customers: initialCustomers,
  reports: initialReports,
  tasks: initialTasks,
  integrations: initialIntegrations,
  notifications: initialNotifications,
  conversations: initialConversations,
  activeConversationId: 'CV-001',
  sidekickContext: { page: 'dashboard' },
  activities: initialActivities,
  alerts: initialAlerts,
  messages: initialMessages,
  metrics,
  trendData,
  channelPerformance,

  addActivity: (activity) =>
    setStoreState((state) => ({
      activities: [
        { id: nextId('ACT'), ...activity },
        ...state.activities,
      ],
    })),

  addProduct: (product) =>
    setStoreState((state) => ({
      products: [product, ...state.products],
    })),

  updateSKUAlertLevel: (skuId, newLevel) =>
    setStoreState((state) => ({
      skus: state.skus.map((sku) =>
        sku.sku === skuId ? { ...sku, alertLevel: newLevel } : sku,
      ),
    })),

  updateSKUAlertLevelWithActivity: (skuId, newLevel) =>
    setStoreState((state) => {
      const timestamp = new Date().toISOString();
      return {
        skus: state.skus.map((sku) =>
          sku.sku === skuId ? { ...sku, alertLevel: newLevel } : sku,
        ),
        activities: [
          {
            id: nextId('ACT'),
            time: timestamp,
            operator: 'System Agent',
            action: 'Update Inventory Threshold',
            target: skuId,
            status: 'success',
          },
          ...state.activities,
        ],
      };
    }),

  addMessage: (msg) =>
    setStoreState((state) => {
      const newMessage = {
        id: nextId('MSG'),
        timestamp: new Date().toISOString(),
        ...msg,
        conversationId: state.activeConversationId ?? undefined,
        context: state.sidekickContext,
      };
      return {
        messages: [...state.messages, newMessage],
        conversations: state.conversations.map((conversation) =>
          conversation.id === state.activeConversationId
            ? { ...conversation, updatedAt: newMessage.timestamp }
            : conversation,
        ),
      };
    }),

  removeAlert: (alertId) =>
    setStoreState((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== alertId),
    })),

  createConversation: (title, context = null) =>
    setStoreState((state) => {
      const timestamp = new Date().toISOString();
      const conversation: Conversation = { id: nextId('CV'), title, context, createdAt: timestamp, updatedAt: timestamp };
      return { conversations: [conversation, ...state.conversations], activeConversationId: conversation.id, sidekickContext: context };
    }),

  setActiveConversation: (id) =>
    setStoreState((state) => {
      const conversation = state.conversations.find((item) => item.id === id);
      return conversation ? { activeConversationId: id, sidekickContext: conversation.context } : {};
    }),

  setSidekickContext: (context) =>
    setStoreState((state) => ({
      sidekickContext: context,
      conversations: state.conversations.map((conversation) =>
        conversation.id === state.activeConversationId
          ? { ...conversation, context, updatedAt: new Date().toISOString() }
          : conversation,
      ),
    })),

  createAgentTask: (input) =>
    setStoreState((state) => {
      const task: AgentTask = { ...input, id: nextId('TK'), status: 'pending_confirmation', createdAt: new Date().toISOString() };
      const notification: Notification = { id: nextId('NT'), title: '待确认 AI 操作', content: `${task.title}等待您的确认。`, type: 'task', read: false, createdAt: task.createdAt, relatedTaskId: task.id };
      return { tasks: [task, ...state.tasks], notifications: [notification, ...state.notifications] };
    }),

  confirmAgentTask: (id) =>
    setStoreState((state) => {
      const task = state.tasks.find((item) => item.id === id);
      if (!task || task.status !== 'pending_confirmation') return {};
      const completedAt = new Date().toISOString();
      let skus = state.skus;
      let reports = state.reports;
      let products = state.products;
      let target = task.title;
      if (task.actionType === 'restock') {
        const skuId = String(task.payload.skuId);
        const quantity = Number(task.payload.quantity);
        skus = state.skus.map((sku) => sku.sku === skuId ? { ...sku, stock: sku.stock + quantity } : sku);
        target = skuId;
      } else if (task.actionType === 'update_threshold') {
        const skuId = String(task.payload.skuId);
        const alertLevel = Number(task.payload.alertLevel);
        skus = state.skus.map((sku) => sku.sku === skuId ? { ...sku, alertLevel } : sku);
        target = skuId;
      } else if (task.actionType === 'generate_report') {
        const reportType = (task.payload.type as Report['type']) || 'daily';
        const report: Report = { id: nextId('RP'), title: String(task.payload.title || 'AI 生成经营报告'), type: reportType, period: String(task.payload.period || '当前周期'), summary: String(task.payload.summary || 'AI 已基于当前经营数据生成报告。'), generatedAt: completedAt, status: 'ready', metrics: [] };
        reports = [report, ...state.reports];
        target = report.id;
      } else if (task.actionType === 'generate_copy') {
        const productId = String(task.payload.productId);
        products = state.products.map((product) => product.id === productId ? product : product);
        target = productId;
      }
      const actionNames: Record<AgentTask['actionType'], string> = { restock: '执行补货', update_threshold: '更新库存预警阈值', generate_report: '生成经营报告', generate_copy: '生成商品文案' };
      return {
        skus, reports, products,
        tasks: state.tasks.map((item) => item.id === id ? { ...item, status: 'completed', completedAt } : item),
        activities: [{ id: nextId('ACT'), time: completedAt, operator: 'AI 助手', action: actionNames[task.actionType], target, status: 'success' }, ...state.activities],
        notifications: state.notifications.map((notification) => notification.relatedTaskId === id ? { ...notification, read: true } : notification),
      };
    }),

  cancelAgentTask: (id) =>
    setStoreState((state) => ({
      tasks: state.tasks.map((task) => task.id === id && task.status === 'pending_confirmation' ? { ...task, status: 'cancelled' } : task),
      notifications: state.notifications.map((notification) => notification.relatedTaskId === id ? { ...notification, read: true } : notification),
    })),

  resolveAlert: (id) =>
    setStoreState((state) => ({
      alerts: state.alerts.map((alert) => alert.id === id ? { ...alert, status: 'resolved' } : alert),
    })),

  markNotificationRead: (id) =>
    setStoreState((state) => ({
      notifications: state.notifications.map((notification) => notification.id === id ? { ...notification, read: true } : notification),
    })),

  connectIntegration: (id) =>
    setStoreState((state) => ({
      integrations: state.integrations.map((integration) =>
        integration.id === id ? { ...integration, status: 'connected', lastSyncedAt: new Date().toISOString() } : integration,
      ),
    })),
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => storeState;

export const useStore = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
