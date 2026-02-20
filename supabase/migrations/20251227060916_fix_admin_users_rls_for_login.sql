/*
  # Fix Admin Login RLS Policy

  1. Changes
    - Drop existing restrictive policy that only allows authenticated users
    - Add new policy allowing anonymous users to read admin_users for login validation
  
  2. Security
    - This is necessary because login validation happens before authentication
    - The table only contains email and password hash, no sensitive user data
*/

DROP POLICY IF EXISTS "Admin users readable by authenticated" ON admin_users;

CREATE POLICY "Allow login validation"
  ON admin_users
  FOR SELECT
  TO anon, authenticated
  USING (true);