import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Siren as Fire, ChartBar as BarChart3 } from 'lucide-react';
import ProductCard from '../ProductCard';
import { supabase, Product } from '../../lib/supabase';

const TopSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopSellers();
  }, []);

  const fetchTopSellers = async () => {
    try {
      // For demo, we'll get products with highest discount as "top sellers"
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('discount_percentage', { ascending: false })
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching top sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-red-50 via-pink-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-300 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-red-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-full mr-4">
              <TrendingUp className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
              Top Sellers
            </h2>
          </div>
          <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
            Discover what thousands of customers love! These bestselling products have won hearts 
            with their exceptional quality and remarkable results.
          </p>
        </motion.div>

        {/* Trending Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-xl p-6 text-center border border-red-200">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full w-fit mx-auto mb-4">
              <Fire className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">Hot Picks</h3>
            <p className="text-red-600">Most purchased this month</p>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl p-6 text-center border border-orange-200">
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-full w-fit mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-orange-800 mb-2">Trending</h3>
            <p className="text-orange-600">Rising in popularity</p>
          </div>

          <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl p-6 text-center border border-pink-200">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-3 rounded-full w-fit mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-pink-800 mb-2">Top Rated</h3>
            <p className="text-pink-600">Highest customer reviews</p>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                type: "spring",
                stiffness: 80
              }}
              className="relative group"
            >
              {/* Popularity indicator */}
              <div className="absolute -top-2 -right-2 z-10">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                  <Fire className="h-3 w-3" />
                  <span>#{index + 1}</span>
                </div>
              </div>

              {/* Trending glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              
              <div className="relative">
                <ProductCard product={product} />
              </div>

              {/* Customer love indicator */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg"
              >
                <div className="flex items-center space-x-1 text-xs">
                  <span className="text-red-500">💖</span>
                  <span className="font-semibold text-gray-700">{Math.floor(Math.random() * 500) + 100}+</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl p-8 lg:p-12 text-white">
            <TrendingUp className="h-16 w-16 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-4">Join the Trend</h3>
            <p className="text-lg text-red-100 mb-6 max-w-3xl mx-auto">
              Don't miss out on what everyone's talking about. These trending products are 
              flying off our shelves - grab yours before they're gone!
            </p>
            <button className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-red-50 transition-colors shadow-xl transform hover:scale-105">
              Shop All Bestsellers
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TopSellers;