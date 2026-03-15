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
    console.log("Verifying payment...")

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      order_id
    } = await req.json()

    console.log("Payment data:", {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      order_id
    })

    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")

    if (!razorpayKeySecret) {
      throw new Error("Razorpay key secret not configured")
    }

    // Verify signature
    const crypto = await import("node:crypto")

    const expectedSignature = crypto
      .createHmac("sha256", razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex")

    console.log("Expected:", expectedSignature)
    console.log("Received:", razorpay_signature)

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid payment signature")
    }

    console.log("Signature verified")

    // Initialize Supabase with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase configuration missing")
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // First, check if the order exists
    const { data: existingOrder, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single()

    if (fetchError) {
      console.error("Error fetching order:", fetchError)
      throw new Error(`Order not found: ${fetchError.message}`)
    }

    console.log("Found order:", existingOrder)

    // Update order with payment details
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "PAID",
        payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        razorpay_signature: razorpay_signature,
        updated_at: new Date().toISOString()
      })
      .eq("id", order_id)
      .select()

    if (error) {
      console.error("Database update error:", error)
      throw new Error(`Failed to update order status: ${error.message}`)
    }

    console.log("Order updated successfully:", data)

    // Insert payment log
    const { error: logError } = await supabase
      .from("payment_logs")
      .insert({
        order_id: order_id,
        payment_method: "razorpay",
        payment_status: "SUCCESS",
        razorpay_payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        amount: existingOrder.total_amount
      })

    if (logError) {
      console.error("Payment log error:", logError)
      // Don't throw error for logging failure
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified successfully",
        order: data[0]
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    )

  } catch (error) {
    console.error("Payment verification error:", error)

    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    )
  }
})