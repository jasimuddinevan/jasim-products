/*
  # Drop unused indexes

  1. Dropped Indexes
    - `idx_products_created_at` on `products` - unused, no queries benefit from this standalone index
    - `idx_products_is_featured` on `products` - unused, table is small enough for seq scan
    - `idx_visitor_analytics_visited_at` on `visitor_analytics` - unused

  2. Notes
    - These indexes were flagged as never used by Supabase database advisor
    - Removing them reduces storage overhead and write amplification
*/

DROP INDEX IF EXISTS idx_products_created_at;
DROP INDEX IF EXISTS idx_products_is_featured;
DROP INDEX IF EXISTS idx_visitor_analytics_visited_at;
