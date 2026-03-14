import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Verifying payment...');
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, order_id } = await req.json()
    console.log('Payment data:', { razorpay_payment_id, razorpay_order_id, razorpay_signature, order_id });

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    
    if (!razorpayKeySecret) {
      console.error('Razorpay key secret not found');
      throw new Error('Razorpay key secret not configured')
    }

    // Create signature for verification
    const crypto = await import('node:crypto');
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    console.log('Expected signature:', expectedSignature);
    console.log('Received signature:', razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch');
      throw new Error('Invalid payment signature')
    }

    console.log('Payment signature verified successfully');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Update order status in database
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'PAID',
        payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        razorpay_signature: razorpay_signature
      })
      .eq('razorpay_order_id', razorpay_order_id)

    if (error) {
      console.error('Database update error:', error)
      throw new Error('Failed to update order status')
    }

    console.log('Order status updated to PAID');

    return new Response(
      JSON.stringify({ success: true, message: 'Payment verified successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Payment verification error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})