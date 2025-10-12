/*
  # Fix Projects RLS Infinite Recursion

  1. Changes
    - Drop the problematic "Users can view shared projects" policy
    - Create a simplified version that doesn't cause infinite recursion
    - Use auth.jwt() to get email directly instead of querying users table
    
  2. Security
    - Maintains security by checking share access
    - Eliminates circular dependency between projects and users tables
*/

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can view shared projects" ON projects;

-- Create a fixed version that uses auth.jwt() instead of querying users table
CREATE POLICY "Users can view shared projects"
  ON projects FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM shares
      WHERE shares.project_id = projects.id
      AND shares.email = auth.jwt()->>'email'
    )
  );
