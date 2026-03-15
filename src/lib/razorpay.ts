export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

// Check if Razorpay is loaded
const isRazorpayLoaded = () => {
  return typeof window !== 'undefined' && window.Razorpay;
};

// Wait for Razorpay to load
const waitForRazorpay = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (isRazorpayLoaded()) {
      resolve();
      return;
    }
    
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    
    const checkRazorpay = () => {
      attempts++;
      if (isRazorpayLoaded()) {
        resolve();
      } else if (attempts >= maxAttempts) {
        reject(new Error('Razorpay failed to load'));
      } else {
        setTimeout(checkRazorpay, 100);
      }
    };
    
    checkRazorpay();
  });
};

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export const createRazorpayOrder = async (amount: number, receipt: string): Promise<RazorpayOrder> => {
  if (!RAZORPAY_KEY_ID) {
    throw new Error('Razorpay Key ID not configured');
  }
  
  console.log('Creating Razorpay order with amount:', amount, 'receipt:', receipt);
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing');
  }
  
  const response = await fetch(`${supabaseUrl}/functions/v1/create-razorpay-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ amount, receipt }),
  });

  if (!response.ok) {
    let errorText;
    try {
      const errorJson = await response.json();
      errorText = errorJson.error || errorJson.details || JSON.stringify(errorJson);
    } catch {
      errorText = await response.text();
    }
    console.error('Razorpay order creation failed:', errorText);
    throw new Error(`Failed to create Razorpay order: ${errorText}`);
  }

  const result = await response.json();
  console.log('Razorpay order created successfully:', result);
  return result;
};

export const verifyPayment = async (paymentData: RazorpayPaymentResponse, orderId: string) => {
  console.log('Verifying payment:', paymentData, 'for order:', orderId);
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing');
  }
  
  const response = await fetch(`${supabaseUrl}/functions/v1/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ ...paymentData, order_id: orderId }),
  });

  if (!response.ok) {
    let errorText;
    try {
      const errorJson = await response.json();
      errorText = errorJson.error || errorJson.details || JSON.stringify(errorJson);
    } catch {
      errorText = await response.text();
    }
    console.error('Payment verification failed:', errorText);
    throw new Error(`Payment verification failed: ${errorText}`);
  }

  const result = await response.json();
  console.log('Payment verified successfully:', result);
  return result;
};

export const openRazorpayCheckout = async (
  order: RazorpayOrder,
  userDetails: any,
  onSuccess: (response: RazorpayPaymentResponse) => void,
  onError: (error: any) => void
) => {
  try {
    // Wait for Razorpay to load
    await waitForRazorpay();
    
    if (!RAZORPAY_KEY_ID) {
      throw new Error('Razorpay Key ID not configured');
    }
    
    console.log('Opening Razorpay checkout with order:', order);
    console.log('User details:', userDetails);
    
  const options = {
    key: RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: 'NaturZen',
    description: 'Natural Wellness Products',
    image: '/favicon.ico',
    order_id: order.id,
    prefill: {
      name: userDetails.name,
      email: userDetails.email,
      contact: userDetails.phone,
    },
    theme: {
      color: '#4CAF50',
    },
    handler: (response: RazorpayPaymentResponse) => {
      console.log('Payment successful:', response);
      onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        console.log('Payment modal dismissed');
        onError(new Error('Payment cancelled by user'));
      },
    },
    retry: {
      enabled: true,
      max_count: 3,
    },
    timeout: 300, // 5 minutes
    remember_customer: false,
  };

    console.log('Razorpay options:', options);
    
    const razorpay = new (window as any).Razorpay(options);
    
    razorpay.on('payment.failed', (response: any) => {
      console.error('Payment failed:', response.error);
      onError(response.error);
    });
    
    razorpay.open();
  } catch (error) {
    console.error('Error opening Razorpay checkout:', error);
    onError(error);
  }
};