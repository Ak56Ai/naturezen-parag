/*
  # Complete eCommerce Database Schema

  1. New Tables
    - `users` - User profiles and authentication data
    - `products` - Product catalog with all details
    - `orders` - Order management with payment tracking
    - `order_items` - Individual items in each order

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure data access patterns

  3. Sample Data
    - 10 sample products across different categories
    - Proper pricing and discount structures
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for additional profile data
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  original_price numeric(10,2),
  image_url text NOT NULL,
  category text NOT NULL,
  stock integer DEFAULT 0,
  featured boolean DEFAULT false,
  discount_percentage integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'PENDING',
  payment_method text NOT NULL,
  payment_id text,
  razorpay_order_id text,
  razorpay_signature text,
  order_items jsonb NOT NULL,
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Order items table for better structure
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL,
  price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Products policies
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT TO public
  USING (true);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items" ON order_items
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample products
INSERT INTO products (name, description, price, original_price, image_url, category, stock, featured, discount_percentage) VALUES
('Organic Ashwagandha Powder', 'Pure organic ashwagandha powder for stress relief and vitality. Sourced from the finest roots.', 899.00, 1299.00, 'https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg', 'ayurveda', 50, true, 30),
('Meditation Cushion Set', 'Premium meditation cushion with organic cotton cover. Perfect for daily practice.', 2499.00, 3499.00, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 'meditation', 25, true, 25),
('Turmeric Golden Milk Mix', '100-year-old family recipe for golden milk with organic turmeric and spices.', 649.00, 899.00, 'https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg', 'recipe', 75, false, 20),
('Yoga Mat Premium', 'Eco-friendly yoga mat made from natural rubber. Non-slip surface for perfect grip.', 3999.00, 5999.00, 'https://images.pexels.com/photos/3823186/pexels-photo-3823186.jpeg', 'yoga', 30, true, 35),
('Brahmi Memory Booster', 'Traditional brahmi formulation for enhanced memory and cognitive function.', 1299.00, 1799.00, 'https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg', 'ayurveda', 40, false, 25),
('Singing Bowl Meditation', 'Handcrafted Tibetan singing bowl for meditation and sound healing.', 4999.00, 6999.00, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 'meditation', 15, true, 30),
('Herbal Sleep Tea', 'Grandmother\'s recipe for peaceful sleep with chamomile, lavender, and herbs.', 799.00, 999.00, 'https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg', 'recipe', 60, false, 15),
('Yoga Block Set', 'Premium cork yoga blocks for better alignment and support during practice.', 1899.00, 2499.00, 'https://images.pexels.com/photos/3823186/pexels-photo-3823186.jpeg', 'yoga', 45, false, 20),
('Triphala Digestive Powder', 'Ancient ayurvedic formula for digestive health and detoxification.', 1099.00, 1499.00, 'https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg', 'ayurveda', 55, true, 25),
('Essential Oil Diffuser', 'Ultrasonic aromatherapy diffuser for meditation and relaxation.', 2999.00, 3999.00, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 'meditation', 20, false, 25);