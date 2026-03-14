/*
  # eCommerce Database Schema

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `original_price` (decimal)
      - `image_url` (text)
      - `category` (text)
      - `stock` (integer)
      - `featured` (boolean)
      - `discount_percentage` (integer)
      - `created_at` (timestamp)
    
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `total_amount` (decimal)
      - `status` (text)
      - `payment_method` (text)
      - `payment_id` (text)
      - `order_items` (jsonb)
      - `shipping_address` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  original_price decimal(10,2),
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
  total_amount decimal(10,2) NOT NULL,
  status text DEFAULT 'PENDING',
  payment_method text NOT NULL,
  payment_id text,
  order_items jsonb NOT NULL,
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Products policies (public read access)
CREATE POLICY "Anyone can view products" ON products FOR SELECT USING (true);

-- Orders policies (users can only access their own orders)
CREATE POLICY "Users can view their own orders" 
  ON orders FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" 
  ON orders FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" 
  ON orders FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Insert sample products
INSERT INTO products (name, description, price, original_price, image_url, category, stock, featured, discount_percentage) VALUES
  ('Organic Ashwagandha Capsules', '100% pure Ashwagandha for stress relief and vitality. Ancient Ayurvedic formula.', 599.00, 799.00, 'https://images.pexels.com/photos/4198933/pexels-photo-4198933.jpeg', 'ayurveda', 50, true, 25),
  ('Premium Yoga Mat', 'Eco-friendly cork yoga mat with natural rubber base. Perfect for meditation and yoga practice.', 2499.00, 2999.00, 'https://images.pexels.com/photos/3823186/pexels-photo-3823186.jpeg', 'yoga', 30, true, 17),
  ('Himalayan Meditation Cushion', 'Hand-woven meditation cushion filled with buckwheat hulls. Traditional design.', 1299.00, 1599.00, 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg', 'meditation', 25, true, 19),
  ('Turmeric Golden Milk Mix', '100-year-old family recipe with organic turmeric, ginger, and warming spices.', 399.00, 499.00, 'https://images.pexels.com/photos/4198935/pexels-photo-4198935.jpeg', 'recipe', 100, false, 20),
  ('Essential Oil Diffuser', 'Ultrasonic aromatherapy diffuser with 7 LED colors. Perfect for meditation spaces.', 1799.00, 2199.00, 'https://images.pexels.com/photos/4041285/pexels-photo-4041285.jpeg', 'accessories', 40, true, 18),
  ('Brahmi Memory Booster', 'Pure Brahmi extract for enhanced memory and cognitive function. Traditional Ayurvedic herb.', 699.00, 899.00, 'https://images.pexels.com/photos/4198934/pexels-photo-4198934.jpeg', 'ayurveda', 60, false, 22),
  ('Copper Water Bottle', 'Handcrafted pure copper bottle for Ayurvedic water therapy. Antimicrobial properties.', 899.00, 1199.00, 'https://images.pexels.com/photos/4041289/pexels-photo-4041289.jpeg', 'accessories', 35, false, 25),
  ('Meditation Timer Bell', 'Tibetan singing bowl with mallet. Creates pure, resonant tones for meditation.', 1499.00, 1799.00, 'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg', 'meditation', 20, true, 17),
  ('Organic Herbal Tea Blend', 'Calming blend of chamomile, lavender, and tulsi. Perfect for evening meditation.', 299.00, 399.00, 'https://images.pexels.com/photos/4198936/pexels-photo-4198936.jpeg', 'recipe', 80, false, 25),
  ('Bamboo Meditation Bench', 'Sustainable bamboo seiza bench for comfortable meditation posture. Foldable design.', 1999.00, 2499.00, 'https://images.pexels.com/photos/3823208/pexels-photo-3823208.jpeg', 'meditation', 15, true, 20);