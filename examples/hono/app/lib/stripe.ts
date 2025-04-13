import { Env } from '../global';

// Stripeインスタンスを取得する関数
export const getStripe = async (env?: Env) => {
  // Stripe APIをインポート
  const { Stripe } = await import('stripe');
  
  // Stripe APIキーを取得
  const apiKey = env?.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey) {
    throw new Error('Stripe API key is not set');
  }
  
  // Stripeインスタンスを作成
  return new Stripe(apiKey, {
    apiVersion: '2023-10-16', // 最新のAPI バージョンを指定
    appInfo: {
      name: 'Figma Clone',
      version: '1.0.0',
    },
  });
};

// 価格IDからプラン情報を取得する関数
export const getPlanDetails = (priceId: string): { name: string; features: string[] } => {
  // プラン情報のマッピング
  const plans: Record<string, { name: string; features: string[] }> = {
    'price_free': {
      name: 'Free',
      features: [
        '1 プロジェクト',
        '基本的なUI要素',
        '個人利用のみ',
      ],
    },
    'price_standard': {
      name: 'Standard',
      features: [
        '5 プロジェクト',
        'すべてのUI要素',
        '3人までのチームメンバー',
        'エクスポート機能',
      ],
    },
    'price_premium': {
      name: 'Premium',
      features: [
        '無制限のプロジェクト',
        'すべてのUI要素',
        '無制限のチームメンバー',
        'エクスポート機能',
        '優先サポート',
      ],
    },
  };
  
  return plans[priceId] || {
    name: 'Unknown',
    features: ['詳細不明'],
  };
};

// サブスクリプションの作成
export const createSubscription = async (
  customerId: string,
  priceId: string,
  env?: Env
) => {
  const stripe = await getStripe(env);
  
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
};

// 顧客の作成
export const createCustomer = async (
  email: string,
  name: string,
  env?: Env
) => {
  const stripe = await getStripe(env);
  
  return stripe.customers.create({
    email,
    name,
  });
};

// 支払いの確認
export const confirmPayment = async (
  paymentIntentId: string,
  env?: Env
) => {
  const stripe = await getStripe(env);
  
  return stripe.paymentIntents.confirm(paymentIntentId);
};

// サブスクリプションの取得
export const getSubscription = async (
  subscriptionId: string,
  env?: Env
) => {
  const stripe = await getStripe(env);
  
  return stripe.subscriptions.retrieve(subscriptionId);
};

// サブスクリプションのキャンセル
export const cancelSubscription = async (
  subscriptionId: string,
  env?: Env
) => {
  const stripe = await getStripe(env);
  
  return stripe.subscriptions.cancel(subscriptionId);
};

// 請求書の発行
export const createInvoice = async (
  customerId: string,
  env?: Env
) => {
  const stripe = await getStripe(env);
  
  return stripe.invoices.create({
    customer: customerId,
    auto_advance: true,
  });
};

// Webhookイベントの検証
export const constructEvent = async (
  payload: string,
  signature: string,
  webhookSecret: string,
  env?: Env
) => {
  const stripe = await getStripe(env);
  
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  );
};
