import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

import { useStore } from '@/store/useStore';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Products from '@/pages/Products';
import Orders from '@/pages/Orders';
import Inventory from '@/pages/Inventory';
import Analytics from '@/pages/Analytics';
import Assistant from '@/pages/Assistant';
import Marketing from '@/pages/Marketing';
import Activity from '@/pages/Activity';
import Settings from '@/pages/Settings';
import Customers from '@/pages/Customers';
import CustomerDetail from '@/pages/CustomerDetail';
import Alerts from '@/pages/Alerts';
import AlertDetail from '@/pages/AlertDetail';
import Reports from '@/pages/Reports';
import ReportDetail from '@/pages/ReportDetail';
import TasksActivity from '@/pages/TasksActivity';
import DataImport from '@/pages/DataImport';
import Integrations from '@/pages/Integrations';
import IntegrationDetail from '@/pages/IntegrationDetail';
import ProductDetail from '@/pages/ProductDetail';
import SkuDetail from '@/pages/SkuDetail';
import OrderDetail from '@/pages/OrderDetail';
import InventoryDetail from '@/pages/InventoryDetail';
import AnalyticsDetail from '@/pages/AnalyticsDetail';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useStore();
  const [, setLocation] = useLocation();

  if (!isAuthenticated) {
    setLocation('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-4 pb-24 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function Router() {
  const { isAuthenticated } = useStore();
  
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/*">
        {isAuthenticated ? (
          <ProtectedLayout>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/products/:productId/skus/:sku">
                {(params) => <SkuDetail productId={params.productId} skuId={params.sku} />}
              </Route>
              <Route path="/products/:id">
                {(params) => <ProductDetail id={params.id} />}
              </Route>
              <Route path="/products" component={Products} />
              <Route path="/orders/:id">
                {(params) => <OrderDetail id={params.id} />}
              </Route>
              <Route path="/orders" component={Orders} />
              <Route path="/inventory/:sku">
                {(params) => <InventoryDetail skuId={params.sku} />}
              </Route>
              <Route path="/inventory" component={Inventory} />
              <Route path="/analytics/channels/:name">
                {(params) => <AnalyticsDetail channel={params.name} />}
              </Route>
              <Route path="/analytics/products/:id">
                {(params) => <AnalyticsDetail productId={params.id} />}
              </Route>
              <Route path="/analytics/:view">
                {(params) => <AnalyticsDetail view={params.view} />}
              </Route>
              <Route path="/analytics" component={Analytics} />
              <Route path="/customers/:id" component={CustomerDetail} />
              <Route path="/customers" component={Customers} />
              <Route path="/alerts/:id" component={AlertDetail} />
              <Route path="/alerts" component={Alerts} />
              <Route path="/reports/:id" component={ReportDetail} />
              <Route path="/reports" component={Reports} />
              <Route path="/sidekick" component={Assistant} />
              <Route path="/assistant" component={Assistant} />
              <Route path="/marketing" component={Marketing} />
              <Route path="/tasks" component={TasksActivity} />
              <Route path="/activity" component={TasksActivity} />
              <Route path="/data-import" component={DataImport} />
              <Route path="/integrations/:id" component={IntegrationDetail} />
              <Route path="/integrations" component={Integrations} />
              <Route path="/settings" component={Settings} />
              <Route>
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-slate-500">页面未找到 (404)</div>
                </div>
              </Route>
            </Switch>
          </ProtectedLayout>
        ) : (
          <Login />
        )}
      </Route>
    </Switch>
  );
}

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}
