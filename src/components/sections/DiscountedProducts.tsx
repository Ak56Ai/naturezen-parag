import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Tag, Percent, Timer, Zap } from 'lucide-react';
import ProductCard from '../ProductCard';
import { supabase, Product } from '../../lib/supabase';

const DiscountedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    fetchDiscountedProducts();
    
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchDiscountedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('discount_percentage', 0)
        .order('discount_percentage', { ascending: false })
        .limit(4);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching discounted products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-yellow-100 via-red-50 to-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-300 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-yellow-100 via-red-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full mr-4">
              <Tag className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-pink-500 bg-clip-text text-transparent">
              Limited Time Offers
            </h2>
          </div>
          <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
            Don't miss these incredible deals! Premium wellness products at unbeatable prices. 
            Hurry - these offers won't last long!
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white text-center mb-12 shadow-2xl"
        >
          <div className="flex items-center justify-center mb-4">
            <Timer className="h-8 w-8 mr-3" />
            <h3 className="text-2xl font-bold">Flash Sale Ends In:</h3>
          </div>
          
          <div className="flex justify-center space-x-6">
            {[
              { value: timeLeft.hours, label: 'Hours' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Seconds' }
            ].map((time, index) => (
              <motion.div
                key={index}
                animate={{ scale: time.label === 'Seconds' ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 1, repeat: time.label === 'Seconds' ? Infinity : 0 }}
                className="bg-white/20 backdrop-blur-sm rounded-lg p-4 min-w-[80px]"
              >
                <div className="text-3xl font-bold">{time.value.toString().padStart(2, '0')}</div>
                <div className="text-sm uppercase tracking-wide">{time.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Discount Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { range: "Up to 30%", color: "from-yellow-400 to-orange-500", icon: Percent },
            { range: "Buy 2 Get 1", color: "from-red-400 to-pink-500", icon: Tag },
            { range: "Flash Deals", color: "from-purple-400 to-red-500", icon: Zap },
            { range: "Clearance", color: "from-green-400 to-blue-500", icon: Tag }
          ].map((category, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -2 }}
              className={`bg-gradient-to-r ${category.color} text-white rounded-xl p-4 text-center cursor-pointer shadow-lg`}
            >
              <category.icon className="h-6 w-6 mx-auto mb-2" />
              <div className="font-bold text-sm">{category.range}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="relative group"
            >
              {/* Deal Badge */}
              <div className="absolute -top-3 -right-3 z-10">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-bold transform rotate-12 shadow-lg">
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4" />
                    <span>{product.discount_percentage}% OFF</span>
                  </div>
                </div>
              </div>

              {/* Savings highlight */}
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-red-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              
              <div className="relative bg-white rounded-xl overflow-hidden shadow-xl border-2 border-yellow-200">
                <ProductCard product={product} />
                
                {/* Savings amount */}
                {product.original_price && (
                  <div className="absolute bottom-4 right-4 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Save ₹{(product.original_price - product.price).toFixed(0)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-yellow-500 to-red-500 rounded-3xl p-8 lg:p-12 text-white">
            <Tag className="h-16 w-16 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">Don't Miss Out!</h3>
            <p className="text-lg text-yellow-100 mb-6 max-w-3xl mx-auto">
              These amazing deals won't last forever. Shop now and save big on premium 
              wellness products that will transform your health journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-yellow-50 transition-colors shadow-xl transform hover:scale-105">
                Shop All Deals
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-colors">
                Notify Me of New Deals
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DiscountedProducts;