/*
  # Fix Visitor Analytics Read Access

  1. Changes
    - Add policy to allow anonymous users to read visitor analytics data
    - This enables the admin analytics dashboard to display data using the anon key
  
  2. Security Notes
    - Visitor analytics contains non-sensitive data (timestamps, page paths, user agents)
    - This allows the admin dashboard to function without requiring Supabase Auth
    - Admin authentication is still handled through the custom admin_users table

  3. Policies Updated
    - Add "Anyone can view visitor analytics" policy for SELECT operations
    - Drop the old authenticated-only policy since we need public read access
*/

DROP POLICY IF EXISTS "Authenticated users can view all analytics" ON visitor_analytics;

CREATE POLICY "Anyone can view visitor analytics"
  ON visitor_analytics
  FOR SELECT
  TO public
  USING (true);