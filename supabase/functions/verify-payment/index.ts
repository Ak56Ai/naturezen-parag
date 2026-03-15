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

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // Update order
    const { data, error } = await supabase
      .from("orders")
      .update({
        status: "PAID",
        payment_id: razorpay_payment_id,
        razorpay_order_id: razorpay_order_id,
        razorpay_signature: razorpay_signature
      })
      .eq("id", order_id)
      .select()

    if (error) {
      console.error("Database update error:", error)
      throw new Error("Failed to update order status")
    }

    console.log("Order updated:", data)

    // Insert payment log (recommended)
    await supabase.from("payment_logs").insert({
      order_id: order_id,
      payment_method: "razorpay",
      payment_status: "SUCCESS",
      razorpay_payment_id: razorpay_payment_id,
      razorpay_order_id: razorpay_order_id,
      amount: 0
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment verified successfully"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    )

  } catch (error) {
    console.error("Payment verification error:", error)

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    )
  }
})