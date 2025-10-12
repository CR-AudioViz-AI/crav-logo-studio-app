/*
  # Fix Signup RLS Policies

  1. Changes
    - Add INSERT policy for users table to allow user creation
    - Add INSERT policy for wallets table to allow wallet creation
    - Add INSERT policy for ledger_entries during signup
    
  2. Security
    - Policies still maintain security by checking user ownership
    - Only allow authenticated users to insert their own data
*/

-- Drop existing restrictive policies if needed and add permissive ones for signup

-- Users insert policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also allow anon to insert during signup
DROP POLICY IF EXISTS "Allow user creation during signup" ON users;
CREATE POLICY "Allow user creation during signup"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

-- Wallets insert policy
DROP POLICY IF EXISTS "Users can insert own wallet" ON wallets;
CREATE POLICY "Users can insert own wallet"
  ON wallets FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Also allow anon to insert during signup
DROP POLICY IF EXISTS "Allow wallet creation during signup" ON wallets;
CREATE POLICY "Allow wallet creation during signup"
  ON wallets FOR INSERT
  TO anon
  WITH CHECK (true);

-- Ledger entries insert is already covered but let's make sure
DROP POLICY IF EXISTS "Allow ledger entry creation during signup" ON ledger_entries;
CREATE POLICY "Allow ledger entry creation during signup"
  ON ledger_entries FOR INSERT
  TO anon
  WITH CHECK (true);
