/*
  # Create Visitor Analytics Table

  1. New Tables
    - `visitor_analytics`
      - `id` (uuid, primary key) - Unique identifier for each visit
      - `visited_at` (timestamptz) - Timestamp of the visit
      - `page_path` (text) - Path of the page visited (e.g., '/', '/admin')
      - `user_agent` (text, optional) - Browser user agent string
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `visitor_analytics` table
    - Add policy for public insert (to track visitors)
    - Add policy for authenticated admin users to read all analytics data

  3. Indexes
    - Add index on `visited_at` for efficient date-range queries
    - Add index on `page_path` for filtering by page
*/

CREATE TABLE IF NOT EXISTS visitor_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at timestamptz DEFAULT now() NOT NULL,
  page_path text DEFAULT '/' NOT NULL,
  user_agent text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visitor analytics"
  ON visitor_analytics
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all analytics"
  ON visitor_analytics
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_visitor_analytics_visited_at ON visitor_analytics(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_page_path ON visitor_analytics(page_path);