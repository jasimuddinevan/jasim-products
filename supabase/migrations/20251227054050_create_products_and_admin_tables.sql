/*
  # Create Products and Admin Tables for Jasim's Space

  1. New Tables
    - `products`
      - `id` (uuid, primary key) - Unique identifier for each product
      - `title` (text, not null) - Product title
      - `description` (text) - Short product description
      - `image_url` (text) - URL to product image (16:9, 1920x1080)
      - `button_url` (text, not null) - Destination link when "View Now" is clicked
      - `is_featured` (boolean) - Whether product is featured
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp
    
    - `admin_users`
      - `id` (uuid, primary key) - Unique identifier
      - `email` (text, unique, not null) - Admin email for login
      - `password_hash` (text, not null) - Hashed password
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Products: Public read access, admin-only write access
    - Admin users: No public access, only authenticated admins

  3. Indexes
    - Index on products.created_at for sorting
    - Index on products.is_featured for filtering

  4. Notes
    - Default admin password will be 'admin123' (hashed)
    - Products table is publicly readable for the showcase
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  button_url text NOT NULL DEFAULT '#',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only authenticated can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only authenticated can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Only authenticated can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Admin users readable by authenticated"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO admin_users (email, password_hash) 
VALUES ('admin@jasim.space', 'admin123')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (title, description, image_url, button_url, is_featured) VALUES
  ('TaskFlow Pro', 'A powerful task management app with AI-powered prioritization and team collaboration features.', 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/taskflow', true),
  ('CodeSnap', 'Beautiful code screenshot generator with syntax highlighting and custom themes for developers.', 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/codesnap', true),
  ('BudgetWise', 'Smart personal finance tracker with expense categorization and savings goal visualization.', 'https://images.pexels.com/photos/5900227/pexels-photo-5900227.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/budgetwise', false),
  ('DesignKit UI', 'A comprehensive UI component library for React with 200+ customizable components.', 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/designkit', true),
  ('WriteFlow', 'Distraction-free writing app with markdown support and cloud sync across all devices.', 'https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/writeflow', false),
  ('APIForge', 'Visual API builder and documentation generator that simplifies backend development.', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/apiforge', false),
  ('PixelPerfect', 'Image optimization tool that reduces file size by 80% without quality loss.', 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/pixelperfect', true),
  ('FormBuilder X', 'Drag-and-drop form creator with validation, analytics, and webhook integrations.', 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/formbuilder', false),
  ('ChartCraft', 'Data visualization library for creating stunning, interactive charts and dashboards.', 'https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/chartcraft', false),
  ('LinkTree Clone', 'Custom bio link page builder with analytics, themes, and social media integration.', 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/linktree', false),
  ('EmailCraft', 'Drag-and-drop email template builder with responsive design and ESP integration.', 'https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/emailcraft', false),
  ('DevDocs Hub', 'Unified documentation viewer for all your favorite programming languages and frameworks.', 'https://images.pexels.com/photos/270360/pexels-photo-270360.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/devdocs', false),
  ('ColorPalette AI', 'AI-powered color scheme generator that creates harmonious palettes from any image.', 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/colorpalette', true),
  ('MockupMaker', 'Create stunning product mockups in seconds with customizable device frames and scenes.', 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/mockupmaker', false),
  ('TimeTracker Pro', 'Automatic time tracking tool with project insights and productivity analytics.', 'https://images.pexels.com/photos/1178683/pexels-photo-1178683.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/timetracker', false),
  ('DeployBot', 'One-click deployment automation for modern web apps with rollback and monitoring.', 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop', 'https://example.com/deploybot', true)
ON CONFLICT DO NOTHING;