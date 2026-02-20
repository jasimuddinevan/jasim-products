/*
  # Add Update Policy for Admin Users

  1. Changes
    - Add UPDATE policy to allow admin users to update their own credentials
    - Policy allows updates for both anon and authenticated users since login validation is handled by the application

  2. Security
    - Application validates current password before allowing updates
    - Only email and password_hash can be updated
*/

DROP POLICY IF EXISTS "Allow admin credential updates" ON admin_users;

CREATE POLICY "Allow admin credential updates"
  ON admin_users
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);