import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'minimal' | 'featured';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'default' }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const cardVariants = {
    default: "bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group",
    minimal: "bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-all duration-300 group",
    featured: "bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cardVariants[variant]}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{product.discount_percentage}%
          </div>
        )}

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors">
          <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-white text-green-600 px-4 py-2 rounded-full font-semibold hover:bg-green-50 transition-colors flex items-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Quick Add</span>
          </motion.button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
            {product.name}
          </h3>
          <div className="ml-2">
            {product.original_price && product.original_price > product.price ? (
              <div className="text-right">
                <p className="text-sm text-gray-500 line-through">₹{product.original_price}</p>
                <p className="font-bold text-green-600">₹{product.price}</p>
              </div>
            ) : (
              <p className="font-bold text-green-600">₹{product.price}</p>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-xs mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              variant === 'featured' 
                ? 'bg-green-200 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {product.category}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-medium hover:bg-green-600 transition-colors flex items-center space-x-1"
          >
            <ShoppingCart className="h-3 w-3" />
            <span>Add</span>
          </motion.button>
        </div>

        {product.stock < 10 && product.stock > 0 && (
          <div className="mt-2 text-xs text-orange-600 font-medium">
            Only {product.stock} left in stock
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;