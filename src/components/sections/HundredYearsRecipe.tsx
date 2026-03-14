import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Shield } from 'lucide-react';
import ProductCard from '../ProductCard';
import { supabase, Product } from '../../lib/supabase';

const HundredYearsRecipe = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipeProducts();
  }, []);

  const fetchRecipeProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'recipe')
        .limit(3);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching recipe products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
    <section className="py-16 bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-full mr-4">
              <BookOpen className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">
              100+ Years Old Recipes
            </h2>
          </div>
          <p className="text-gray-700 max-w-4xl mx-auto text-lg leading-relaxed">
            Treasured family recipes passed down through generations. These time-honored formulations 
            have been perfected over a century, preserving the authentic taste and healing properties 
            of traditional wellness remedies.
          </p>
        </motion.div>

        {/* Heritage Timeline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-12 shadow-xl border border-amber-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-full w-fit mx-auto mb-4">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-800 mb-2">1920s</h3>
              <p className="text-gray-700">Original recipes developed by our founder's great-grandmother</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-orange-800 mb-2">Preserved</h3>
              <p className="text-gray-700">Handwritten recipes carefully preserved in family journals</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-full w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-red-800 mb-2">Authenticated</h3>
              <p className="text-gray-700">Modern testing confirms the efficacy of ancient wisdom</p>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              {/* Vintage paper effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-200/50 to-orange-200/50 rounded-xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
              <div className="relative bg-white rounded-xl shadow-lg border border-amber-300 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                <ProductCard product={product} />
                
                {/* Heritage Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Heritage Recipe
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Experience Authentic Heritage</h3>
            <p className="mb-6 text-amber-100">
              Every recipe tells a story of wellness, tradition, and family love. 
              Discover the healing power that has been trusted for over 100 years.
            </p>
            <button className="bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors shadow-lg">
              View Heritage Collection
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HundredYearsRecipe;