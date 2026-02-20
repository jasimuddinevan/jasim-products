/*
  # Add IP Address Tracking to Visitor Analytics

  1. Changes
    - Add `ip_address` column to `visitor_analytics` table
      - Type: text (to store IPv4 and IPv6 addresses)
      - Nullable: allows for backward compatibility with existing records
    
  2. Indexes
    - Add index on `ip_address` for efficient unique visitor queries
  
  3. Notes
    - Existing records will have NULL ip_address
    - New visits will capture IP addresses for accurate unique visitor tracking
    - This enables proper counting of unique visitors by distinct IP addresses
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visitor_analytics' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE visitor_analytics ADD COLUMN ip_address text;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_visitor_analytics_ip_address ON visitor_analytics(ip_address);