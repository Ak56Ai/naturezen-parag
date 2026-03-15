const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Creating Razorpay order...');
    const { amount, receipt } = await req.json()
    console.log('Amount:', amount, 'Receipt:', receipt);

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!razorpayKeyId || !razorpayKeySecret) {
      console.error('Razorpay credentials not found');
      throw new Error('Razorpay credentials not configured')
    }

    console.log('Using Razorpay Key ID:', razorpayKeyId);

    const orderData = {
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: receipt,
      payment_capture: 1
    }

    console.log('Order data:', orderData);

    const credentials = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Razorpay API error:', errorData)
      throw new Error(`Failed to create Razorpay order: ${errorData}`)
    }

    const order = await response.json()
    console.log('Razorpay order created:', order);

    return new Response(
      JSON.stringify(order),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})