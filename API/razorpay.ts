import Razorpay from 'razorpay';
import crypto from 'crypto';

const KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret_key';
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'placeholder_webhook_secret';

// Determine if we have real configured keys or placeholder keys
export const isConfiguredRazorpay = 
  KEY_ID.startsWith('rzp_') && 
  KEY_ID !== 'rzp_test_placeholder_key' && 
  KEY_SECRET !== 'placeholder_secret_key' && 
  KEY_SECRET.length >= 8;

export const isLiveMode = KEY_ID.startsWith('rzp_live_');

let razorpayInstance: Razorpay | null = null;
if (isConfiguredRazorpay) {
  try {
    razorpayInstance = new Razorpay({
      key_id: KEY_ID,
      key_secret: KEY_SECRET,
    });
  } catch (err) {
    console.warn('Failed to initialize Razorpay SDK instance:', err);
  }
}

export interface CreateOrderParams {
  amountPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  isSimulated?: boolean;
}

export const RazorpayService = {
  getKeyId(): string {
    return KEY_ID;
  },

  isLive(): boolean {
    return isLiveMode;
  },

  isConfigured(): boolean {
    return isConfiguredRazorpay;
  },

  async createOrder(params: CreateOrderParams): Promise<RazorpayOrderResult> {
    if (isConfiguredRazorpay && razorpayInstance) {
      try {
        const order = await razorpayInstance.orders.create({
          amount: params.amountPaise,
          currency: params.currency || 'INR',
          receipt: params.receipt,
          notes: params.notes || {}
        });
        return {
          id: order.id,
          amount: typeof order.amount === 'number' ? order.amount : Number(order.amount),
          currency: order.currency,
          receipt: String(order.receipt || params.receipt),
          status: order.status,
          isSimulated: false
        };
      } catch (err: any) {
        console.error('Razorpay SDK error creating order:', err);
        throw new Error(err?.error?.description || err?.message || 'Razorpay order creation failed');
      }
    }

    // In test / placeholder mode, return a reliable mock order format compatible with Razorpay Checkout
    const mockOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    console.log(`[RAZORPAY TEST SIMULATOR] Generated order ${mockOrderId} for receipt ${params.receipt} (₹${params.amountPaise / 100})`);
    return {
      id: mockOrderId,
      amount: params.amountPaise,
      currency: params.currency || 'INR',
      receipt: params.receipt,
      status: 'created',
      isSimulated: true
    };
  },

  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
    // If running with simulator order
    if (orderId.startsWith('order_test_') || !isConfiguredRazorpay) {
      return true;
    }

    try {
      const generated = crypto
        .createHmac('sha256', KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      return generated === signature;
    } catch (e) {
      console.error('Signature verification error:', e);
      return false;
    }
  },

  verifyWebhookSignature(rawBody: Buffer | string, signature: string): boolean {
    if (!signature || !WEBHOOK_SECRET || WEBHOOK_SECRET === 'placeholder_webhook_secret') {
      return true; // permit in dev placeholder mode
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', WEBHOOK_SECRET)
        .update(rawBody)
        .digest('hex');

      return expectedSignature === signature;
    } catch (err) {
      console.error('Webhook signature verification error:', err);
      return false;
    }
  }
};
