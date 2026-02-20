/*
  # Drop Unused Indexes for Performance Optimization

  1. Changes
    - Drop `idx_visitor_analytics_page_path` index
      - Not used in any queries (no WHERE or ORDER BY on page_path)
      - Removing improves write performance
    
    - Drop `idx_visitor_analytics_ip_address` index
      - Not used in database queries (ip_address is only selected, not filtered)
      - Unique visitor counting happens in application code
      - Removing improves write performance
  
  2. Retained Indexes
    - `idx_products_is_featured` - KEPT (used in ORDER BY and WHERE clauses)
    - `idx_products_created_at` - KEPT (used in ORDER BY)
    - `idx_visitor_analytics_visited_at` - KEPT (used in WHERE and ORDER BY)
  
  3. Notes
    - Unused indexes slow down INSERT/UPDATE operations without providing query benefits
    - These indexes can be recreated if filtering by page_path or ip_address is needed in the future
*/

DROP INDEX IF EXISTS idx_visitor_analytics_page_path;
DROP INDEX IF EXISTS idx_visitor_analytics_ip_address;