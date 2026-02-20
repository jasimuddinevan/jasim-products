/*
  # Tighten RLS policies across all tables

  1. Changes to `products` table
    - Keep: "Anyone can read products" (public catalog - SELECT only)
    - Drop: "Anyone can insert products" (was INSERT with always-true WITH CHECK)
    - Drop: "Anyone can update products" (was UPDATE with always-true USING/WITH CHECK)
    - Drop: "Anyone can delete products" (was DELETE with always-true USING)
    - Admin product management now exclusively goes through edge functions using service_role key (which bypasses RLS)

  2. Changes to `admin_users` table
    - Keep: "Allow login validation" (SELECT for credential checking)
    - Drop: "Allow admin credential updates" (was UPDATE with always-true USING/WITH CHECK)
    - Admin credential updates now exclusively go through edge functions using service_role key

  3. Changes to `visitor_analytics` table
    - Keep: "Anyone can view visitor analytics" (for admin dashboard reads)
    - Drop: "Anyone can insert visitor analytics" (was INSERT with always-true WITH CHECK)
    - Visitor tracking inserts now exclusively go through edge function using service_role key

  4. Security improvements
    - No table allows unrestricted writes from anonymous/public users anymore
    - All write operations are routed through server-side edge functions with service_role key
    - Read-only access is preserved where needed for public-facing features
*/

DROP POLICY IF EXISTS "Anyone can insert products" ON products;
DROP POLICY IF EXISTS "Anyone can update products" ON products;
DROP POLICY IF EXISTS "Anyone can delete products" ON products;

DROP POLICY IF EXISTS "Allow admin credential updates" ON admin_users;

DROP POLICY IF EXISTS "Anyone can insert visitor analytics" ON visitor_analytics;
