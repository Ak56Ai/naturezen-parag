import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Award, Star } from 'lucide-react';
import ProductCard from '../ProductCard';
import { supabase, Product } from '../../lib/supabase';

const BestInAyurveda = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAyurvedaProducts();
  }, []);

  const fetchAyurvedaProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'ayurveda')
        .limit(6);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching Ayurveda products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-50 via-green-50 to-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-300 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 via-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-green-500 to-amber-500 p-3 rounded-full mr-3">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-amber-600 bg-clip-text text-transparent">
              Best in Ayurveda
            </h2>
          </div>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
            Experience the wisdom of ancient India with our premium Ayurvedic collection. 
            Each product is crafted using time-tested formulations and the finest natural ingredients.
          </p>
        </motion.div>

        {/* Featured Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: Award, title: "Certified Pure", desc: "100% authentic herbs" },
            { icon: Star, title: "5000+ Years", desc: "Ancient wisdom" },
            { icon: Leaf, title: "Chemical Free", desc: "No harmful additives" }
          ].map((feature, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-sm rounded-xl p-6 text-center border border-green-200">
              <div className="bg-gradient-to-r from-green-500 to-amber-500 p-3 rounded-full w-fit mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-amber-400 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative">
                <ProductCard product={product} variant="featured" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-green-600 to-amber-600 text-white px-8 py-4 rounded-full font-semibold hover:from-green-700 hover:to-amber-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
            Explore Ayurveda Collection
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default BestInAyurveda;