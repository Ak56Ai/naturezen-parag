import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Medal, Crown } from 'lucide-react';
import ProductCard from '../ProductCard';
import { supabase, Product } from '../../lib/supabase';

const BestInClass = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBestProducts();
  }, []);

  const fetchBestProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching best products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
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

  const awards = [
    { icon: Trophy, title: "Best Quality", color: "from-yellow-400 to-orange-500" },
    { icon: Star, title: "Top Rated", color: "from-blue-400 to-purple-500" },
    { icon: Medal, title: "Premium Choice", color: "from-green-400 to-teal-500" },
    { icon: Crown, title: "Luxury Select", color: "from-pink-400 to-red-500" }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-4 rounded-full mr-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              Best in Class
            </h2>
          </div>
          <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
            Award-winning products that set the standard for excellence in natural wellness. 
            These premium selections represent the pinnacle of quality, purity, and effectiveness.
          </p>
        </motion.div>

        {/* Awards Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {awards.map((award, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-purple-200"
            >
              <div className={`bg-gradient-to-r ${award.color} p-3 rounded-full w-fit mx-auto mb-3`}>
                <award.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{award.title}</h3>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Products */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              className="relative group"
            >
              {/* Premium glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              
              <div className="relative bg-white rounded-xl overflow-hidden shadow-xl border-2 border-purple-200">
                {/* Premium badge */}
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-bl-xl">
                    <div className="flex items-center space-x-1">
                      <Crown className="h-3 w-3" />
                      <span className="text-xs font-bold">PREMIUM</span>
                    </div>
                  </div>
                </div>
                
                <ProductCard product={product} variant="featured" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quality Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 lg:p-12 text-white text-center">
            <Trophy className="h-16 w-16 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">Quality Guarantee</h3>
            <p className="text-lg text-purple-100 mb-6 max-w-3xl mx-auto">
              Every "Best in Class" product comes with our premium quality guarantee. 
              If you're not completely satisfied, we offer a full refund within 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-50 transition-colors shadow-lg">
                Shop Premium Collection
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Learn About Quality
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BestInClass;