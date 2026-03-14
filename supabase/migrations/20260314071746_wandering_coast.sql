/*
  # Complete Database Schema for Nature Yoga & Meditation eCommerce

  1. New Tables
    - `users` - User profiles and authentication data
    - `products` - Product catalog with categories and pricing
    - `orders` - Order management with payment tracking
    - `order_items` - Individual items within orders
    - `cart_items` - Persistent cart storage
    - `payment_logs` - Payment transaction logging

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure payment data handling

  3. Sample Data
    - 10 sample products across different categories
    - Proper categorization and pricing
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for storing user profiles
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  address text,
  city text,
  state text,
  pincode text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'PENDING',
  payment_method text NOT NULL,
  payment_id text,
  razorpay_order_id text,
  razorpay_signature text,
  order_items jsonb NOT NULL,
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table for better tracking
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL,
  price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Cart items table for persistent cart
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Payment logs table for tracking all payment attempts
CREATE TABLE IF NOT EXISTS payment_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid REFERENCES orders(id),
  payment_method text NOT NULL,
  payment_status text NOT NULL,
  razorpay_payment_id text,
  razorpay_order_id text,
  amount numeric(10,2) NOT NULL,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for products table
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT TO public
  USING (true);

-- RLS Policies for orders table
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders" ON orders
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for order_items table
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

-- RLS Policies for cart_items table
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payment_logs table
CREATE POLICY "Users can view own payment logs" ON payment_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_logs.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample products
INSERT INTO products (name, description, price, original_price, image_url, category, stock, featured, discount_percentage) VALUES
('Premium Yoga Mat - Natural Rubber', 'Eco-friendly yoga mat made from natural rubber with excellent grip and alignment markings. Perfect for all yoga styles.', 2499.00, 3499.00, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 'ayurveda', 50, true, 29),
('Meditation Cushion Set', 'Handcrafted meditation cushion with buckwheat hull filling. Includes zafu and zabuton for complete comfort.', 1899.00, 2499.00, 'https://images.pexels.com/photos/3823186/pexels-photo-3823186.jpeg', 'meditation', 30, true, 24),
('Ayurvedic Herbal Tea Blend', '100-year-old family recipe herbal tea blend with turmeric, ginger, and holy basil for daily wellness.', 599.00, 799.00, 'https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg', 'recipe', 100, false, 25),
('Organic Ashwagandha Powder', 'Pure organic ashwagandha powder sourced from certified farms. Helps reduce stress and boost immunity.', 899.00, 1199.00, 'https://images.pexels.com/photos/3823186/pexels-photo-3823186.jpeg', 'ayurveda', 75, true, 25),
('Bamboo Yoga Blocks Set', 'Sustainable bamboo yoga blocks for better alignment and support. Set of 2 blocks with carrying strap.', 1299.00, 1699.00, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 'props', 40, false, 24),
('Traditional Singing Bowl', 'Handcrafted Tibetan singing bowl for meditation and sound healing. Includes wooden striker and cushion.', 3499.00, 4999.00, 'https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg', 'meditation', 20, true, 30),
('Ayurvedic Face Oil - Kumkumadi', 'Luxurious face oil with saffron and 16 precious herbs. Ancient recipe for glowing, youthful skin.', 1599.00, 2199.00, 'https://images.pexels.com/photos/3823186/pexels-photo-3823186.jpeg', 'recipe', 60, false, 27),
('Copper Water Bottle', 'Pure copper water bottle for Ayurvedic water therapy. Naturally antimicrobial and health-boosting.', 1199.00, 1599.00, 'https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg', 'ayurveda', 80, false, 25),
('Meditation Mala Beads', 'Authentic 108-bead mala made from sandalwood. Perfect for meditation and mindfulness practice.', 799.00, 1099.00, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 'meditation', 45, false, 27),
('Organic Turmeric Latte Mix', 'Golden milk powder blend with turmeric, cardamom, and coconut. Traditional recipe for wellness.', 699.00, 899.00, 'https://images.pexels.com/photos/3823186/pexels-photo-3823186.jpeg', 'recipe', 90, false, 22);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_order_id ON payment_logs(order_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();