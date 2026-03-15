import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, Phone, Mail, User, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getCurrentUser } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { createRazorpayOrder, openRazorpayCheckout, verifyPayment } from '../lib/razorpay';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    // Check if cart is empty after component mounts
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [cart.length, navigate]);
  const checkUser = async () => {
    setFormLoading(true);
    try {
    const { user } = await getCurrentUser();
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    setUser(user);
    setShippingDetails(prev => ({
      ...prev,
      email: user.email || '',
      fullName: user.user_metadata?.full_name || '',
    }));
    } catch (error) {
      console.error('Error checking user:', error);
      toast.error('Failed to load user information');
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of required) {
      if (!shippingDetails[field as keyof typeof shippingDetails]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(shippingDetails.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    // Validate phone number (basic validation)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(shippingDetails.phone.replace(/\D/g, ''))) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    
    // Validate pincode
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(shippingDetails.pincode)) {
      toast.error('Please enter a valid 6-digit PIN code');
      return false;
    }
    
    return true;
  };

  const createOrder = async () => {

    if (!cart || cart.length === 0) {
      toast.error("Cart is empty");
      return null;
    }

    if (!validateForm()) return null;

    if (!user?.id) {
      toast.error('User not authenticated');
      navigate('/login');
      return null;
    }

    const orderData = {
      user_id: user.id,
      total_amount: finalAmount,
      status: 'PENDING',
      payment_method: paymentMethod,

      order_items: cart.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total_price: item.product.price * item.quantity
      })),

      shipping_address: shippingDetails
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error(error);
      toast.error('Failed to create order');
      return null;
    }

    return data;
  };

  const handleRazorpayPayment = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      console.log('Starting Razorpay payment process...');
      
      // Create order in database
      const order = await createOrder();
      if (!order) {
        setLoading(false);
        return;
      }

      console.log('Creating Razorpay order for amount:', order.total_amount);
      
      // Create Razorpay order
      const razorpayOrder = await createRazorpayOrder(
        Math.round(order.total_amount * 100), // Convert to paise
        order.id
      );

      await supabase
        .from('orders')
        .update({
          razorpay_order_id: razorpayOrder.id
        })
        .eq('id', order.id);

      console.log('Razorpay order created:', razorpayOrder);

      // Open Razorpay checkout
      openRazorpayCheckout(
        razorpayOrder,
        {
          name: shippingDetails.fullName,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
        },
        async (response) => {
          try {
            console.log('Payment successful, verifying...', response);
            
            // Verify payment
            await verifyPayment(response, order.id);
            
            // Log successful payment
            await supabase
              .from('payment_logs')
              .insert([{
                order_id: order.id,
                payment_method: 'razorpay',
                payment_status: 'SUCCESS',
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                amount: order.total_amount,
              }]);

            // Update order status

            console.log('Order updated to PAID status');
            
            clearCart();
            toast.success('Payment successful!');
            navigate(`/order-success/${order.id}`);
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed');
          }

          setLoading(false);
        },
        (error) => {
          console.error('Payment failed:', error);
          // Log failed payment
          supabase
            .from('payment_logs')
            .insert([{
              order_id: order.id,
              payment_method: 'razorpay',
              payment_status: 'FAILED',
              amount: order.total_amount,
              error_message: error.description || 'Payment failed',
            }]);
          toast.error('Payment failed or cancelled');
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  const handleCODOrder = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      console.log('Processing COD order...');
      
      const order = await createOrder();
      if (!order) {
        setLoading(false);
        return;
      }

      // Log COD order
      await supabase
        .from('payment_logs')
        .insert([{
          order_id: order.id,
          payment_method: 'cod',
          payment_status: 'PENDING',
          amount: order.total_amount,
        }]);

      // Update order status to COD
      await supabase
        .from('orders')
        .update({ status: 'COD_PENDING' })
        .eq('id', order.id);

      console.log('COD order created successfully');
      
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${order.id}`);
    } catch (error) {
      console.error('Error placing COD order:', error);
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) {
      return; // Prevent double submission
    }
    
    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
    } else {
      await handleCODOrder();
    }
  };

  const totalAmount = getTotalPrice();
  const tax = totalAmount * 0.18;
  const finalAmount = totalAmount + tax;

  // Show loading state while checking user
  if (formLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  // Show empty cart message
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate('/cart')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Cart
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="space-y-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <MapPin className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Shipping Information</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          name="fullName"
                          value={shippingDetails.fullName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          value={shippingDetails.email}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={shippingDetails.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        disabled={loading}
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Street address, apartment, suite, etc."
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingDetails.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingDetails.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        disabled={loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        PIN Code
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingDetails.pincode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                        disabled={loading}
                        placeholder="6-digit PIN code"
                        maxLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <CreditCard className="h-6 w-6 text-green-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                      disabled={loading}
                    />
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold">Online Payment</p>
                        <p className="text-sm text-gray-600">Pay securely with Razorpay</p>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                      disabled={loading}
                    />
                    <div className="flex items-center">
                      <Truck className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <p className="font-semibold">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-3">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200 mb-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <Lock className="mr-2 h-5 w-5" />
                    {paymentMethod === 'razorpay' ? 'Pay Now' : 'Place Order'}
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;