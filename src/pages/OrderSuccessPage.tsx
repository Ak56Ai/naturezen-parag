import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CircleCheck as CheckCircle, Package, Truck, Calendar, Download, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600 bg-green-100';
      case 'COD_PENDING':
        return 'text-blue-600 bg-blue-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Payment Successful';
      case 'COD_PENDING':
        return 'Order Confirmed - COD';
      case 'PENDING':
        return 'Payment Pending';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <Link to="/" className="text-green-600 hover:text-green-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="h-12 w-12 text-green-600" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {order.payment_method === 'cod' ? 'Order Placed Successfully!' : 'Payment Successful!'}
            </h1>
            
            <p className="text-gray-600 text-lg mb-6">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Order ID</p>
                  <p className="font-mono font-semibold text-gray-900">{order.id}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Package className="h-6 w-6 text-green-600 mr-3" />
              <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
            </div>

            <div className="space-y-4">
              {order.order_items.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                    <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>₹{order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Truck className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="text-gray-700">
                <p className="font-semibold">{order.shipping_address.fullName}</p>
                <p>{order.shipping_address.address}</p>
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}</p>
                <p className="mt-2">
                  <span className="text-gray-600">Phone:</span> {order.shipping_address.phone}
                </p>
                <p>
                  <span className="text-gray-600">Email:</span> {order.shipping_address.email}
                </p>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-900">Order Timeline</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-900">Order Placed</p>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {order.status === 'PAID' && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                    <div>
                      <p className="font-semibold text-gray-900">Payment Confirmed</p>
                      <p className="text-gray-600 text-sm">Payment processed successfully</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-600">Processing</p>
                    <p className="text-gray-500 text-sm">We're preparing your order</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-600">Shipped</p>
                    <p className="text-gray-500 text-sm">Your order is on the way</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold text-gray-600">Delivered</p>
                    <p className="text-gray-500 text-sm">Estimated delivery in 3-5 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              <Download className="mr-2 h-5 w-5" />
              Download Invoice
            </button>
            
            <Link
              to="/orders"
              className="flex items-center justify-center border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors"
            >
              View All Orders
            </Link>
          </div>

          <Link
            to="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Thank You for Choosing NaturZen!</h3>
          <p className="text-green-100 mb-6">
            Your wellness journey continues with our premium natural products. 
            We're committed to delivering the highest quality items to support your healthy lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Rate Your Experience
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
              Join Our Newsletter
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;