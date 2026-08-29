import type {
  BusinessMetrics,
  ChannelPerformance,
  Product,
  SKU,
  TrendPoint,
} from "@/store/useStore";

type AnalysisInput = {
  question: string;
  products: Product[];
  skus: SKU[];
  metrics: BusinessMetrics;
  trendData: TrendPoint[];
  channelPerformance: ChannelPerformance[];
};

export type DemoAnalysis = {
  intent: string;
  facts: Record<string, unknown>;
  demoAnswer: string;
};

const currency = (value: number) =>
  new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(value);

const percentChange = (current: number, previous: number) =>
  ((current - previous) / previous) * 100;

export function analyzeDemoQuestion({
  question,
  products,
  skus,
  metrics,
  trendData,
  channelPerformance,
}: AnalysisInput): DemoAnalysis {
  const normalized = question.trim().toLowerCase();

  if (
    normalized.includes("没货") ||
    normalized.includes("库存") ||
    normalized.includes("缺货")
  ) {
    const riskySkus = skus
      .filter((sku) => sku.stock <= sku.alertLevel)
      .map((sku) => {
        const product = products.find((item) => item.id === sku.productId);
        const daysLeft =
          sku.sold7d > 0 ? Number((sku.stock / (sku.sold7d / 7)).toFixed(1)) : null;
        return {
          sku: sku.sku,
          product: product?.name ?? sku.productId,
          stock: sku.stock,
          alertLevel: sku.alertLevel,
          daysLeft,
        };
      });

    return {
      intent: "inventory_risk",
      facts: { riskySkus },
      demoAnswer: `当前有 ${riskySkus.length} 个 SKU 存在缺货风险。A102-WHT 只剩 12 件，按近 7 日销量预计约 1.9 天售罄；A102-BLU 只剩 8 件，预计约 3.7 天售罄。建议优先为 A102-WHT 补货，并把预警阈值从 15 件提高到 30 件。`,
    };
  }

  if (
    normalized.includes("卖得最好") ||
    normalized.includes("销量最高") ||
    normalized.includes("最好商品")
  ) {
    const best = [...products].sort((a, b) => b.sales30d - a.sales30d)[0];
    return {
      intent: "top_product",
      facts: {
        product: best.name,
        sales30d: best.sales30d,
        revenue30d: best.revenue30d,
        margin: best.profitMargin,
      },
      demoAnswer: `最近 30 天销量最高的是「${best.name}」，共售出 ${best.sales30d.toLocaleString("zh-CN")} 件，贡献 GMV ${currency(best.revenue30d)}。需要注意的是，它的毛利率只有 ${(best.profitMargin * 100).toFixed(1)}%，销量增长很快，但对利润拉动有限。`,
    };
  }

  if (
    normalized.includes("利润下降") ||
    normalized.includes("利润为什么") ||
    normalized.includes("gmv 上升")
  ) {
    const gmvChange = percentChange(
      metrics.currentMonthGmv,
      metrics.previousMonthGmv,
    );
    const profitChange = percentChange(
      metrics.currentMonthProfit,
      metrics.previousMonthProfit,
    );
    const lowMargin = [...products].sort(
      (a, b) => a.profitMargin - b.profitMargin,
    )[0];

    return {
      intent: "profit_decline",
      facts: {
        currentMonthGmv: metrics.currentMonthGmv,
        previousMonthGmv: metrics.previousMonthGmv,
        gmvChange,
        currentMonthProfit: metrics.currentMonthProfit,
        previousMonthProfit: metrics.previousMonthProfit,
        profitChange,
        lowMarginProduct: {
          name: lowMargin.name,
          margin: lowMargin.profitMargin,
          sales30d: lowMargin.sales30d,
        },
      },
      demoAnswer: `本月 GMV 为 ${currency(metrics.currentMonthGmv)}，环比上升 ${gmvChange.toFixed(1)}%，但利润为 ${currency(metrics.currentMonthProfit)}，环比下降 ${Math.abs(profitChange).toFixed(1)}%。主要原因是低毛利的「${lowMargin.name}」销量增长到 ${lowMargin.sales30d.toLocaleString("zh-CN")} 件、占比明显提高，其毛利率仅 ${(lowMargin.profitMargin * 100).toFixed(1)}%。建议检查该商品投放成本与促销力度，并把资源更多分配给毛利更健康的耳机和家居办公类商品。`,
    };
  }

  if (
    normalized.includes("毛利率最低") ||
    normalized.includes("低毛利") ||
    normalized.includes("利润率最低")
  ) {
    const lowest = [...products]
      .sort((a, b) => a.profitMargin - b.profitMargin)
      .slice(0, 3);
    return {
      intent: "low_margin_products",
      facts: {
        products: lowest.map((product) => ({
          name: product.name,
          margin: product.profitMargin,
          sales30d: product.sales30d,
          profit30d: product.profit30d,
        })),
      },
      demoAnswer: `毛利率最低的三款商品依次是：1）快充移动电源 20000mAh，19.5%；2）人体工学电竞椅，37.7%；3）模块化桌面收纳架，51.9%。其中移动电源销量最高但利润贡献偏低，是本月“GMV 上升、利润下降”的主要影响项。`,
    };
  }

  if (
    normalized.includes("30天") ||
    normalized.includes("30 天") ||
    normalized.includes("销售情况") ||
    normalized.includes("销售额下降")
  ) {
    const gmvChange = percentChange(
      metrics.currentMonthGmv,
      metrics.previousMonthGmv,
    );
    const profitChange = percentChange(
      metrics.currentMonthProfit,
      metrics.previousMonthProfit,
    );
    return {
      intent: "sales_overview_30d",
      facts: {
        metrics,
        trendData,
        channelPerformance,
      },
      demoAnswer: `最近 30 天全渠道 GMV 为 ${currency(metrics.currentMonthGmv)}，环比上升 ${gmvChange.toFixed(1)}%；订单量保持增长，但利润环比下降 ${Math.abs(profitChange).toFixed(1)}%，退款率从 ${(metrics.previousRefundRate * 100).toFixed(1)}% 升至 ${(metrics.refundRate * 100).toFixed(1)}%。天猫仍是 GMV 贡献最高的渠道，拼多多订单增长快但利润率偏低。建议本周优先处理低毛利促销和加湿器退款异常。`,
    };
  }

  if (normalized.includes("退款") || normalized.includes("售后")) {
    const highestRefund = [...products].sort(
      (a, b) => b.refundRate - a.refundRate,
    )[0];
    return {
      intent: "refund_anomaly",
      facts: {
        product: highestRefund.name,
        refundRate: highestRefund.refundRate,
        baseline: metrics.previousRefundRate,
      },
      demoAnswer: `退款异常最明显的是「${highestRefund.name}」，最近 30 天退款率达到 ${(highestRefund.refundRate * 100).toFixed(1)}%，明显高于店铺基准 ${(metrics.previousRefundRate * 100).toFixed(1)}%。Demo 售后原因集中在物流慢和包装破损，建议先排查仓配环节，并暂停放大该商品的促销流量。`,
    };
  }

  if (normalized.includes("渠道") || normalized.includes("流量")) {
    const bestChannel = [...channelPerformance].sort((a, b) => b.gmv - a.gmv)[0];
    const weakestProfit = [...channelPerformance].sort(
      (a, b) => a.profit - b.profit,
    )[0];
    return {
      intent: "channel_performance",
      facts: { bestChannel, weakestProfit },
      demoAnswer: `天猫贡献最高，最近 30 天 GMV 为 ${currency(bestChannel.gmv)}，利润 ${currency(bestChannel.profit)}。拼多多订单量不低，但利润只有 ${currency(weakestProfit.profit)}，转化率为 ${(weakestProfit.conversionRate * 100).toFixed(1)}%，建议检查低价促销与投放回报。`,
    };
  }

  if (
    normalized.includes("小红书") ||
    normalized.includes("文案") ||
    normalized.includes("标题")
  ) {
    const featured = products[0];
    return {
      intent: "marketing_copy",
      facts: {
        product: featured.name,
        category: featured.category,
        price: featured.price,
      },
      demoAnswer: `已识别为营销内容任务。建议前往「Marketing」页面选择「${featured.name}」，可生成商品标题、商品描述、小红书文案、抖音文案和营销推广文案，并支持一键复制。`,
    };
  }

  return {
    intent: "business_overview",
    facts: { metrics, inventoryRiskCount: metrics.inventoryRisks },
    demoAnswer: `当前经营重点有三项：本月 GMV 环比增长，但利润下降；有 ${metrics.inventoryRisks} 个 SKU 存在缺货风险；店铺退款率已升至 ${(metrics.refundRate * 100).toFixed(1)}%。您可以继续追问利润下降原因、低库存商品、低毛利商品或退款异常。`,
  };
}