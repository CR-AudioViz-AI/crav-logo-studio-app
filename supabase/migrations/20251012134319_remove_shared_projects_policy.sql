/*
  # Remove Shared Projects Policy to Fix Infinite Recursion

  1. Changes
    - Drop "Users can view shared projects" policy that causes circular dependency
    - Keep only "Users can view own projects" policy
    - This eliminates the recursion between projects and shares tables
    
  2. Security
    - Users can still view their own projects
    - Shared project access can be implemented later with a different approach
    - For now, prioritizing stability over shared project feature
*/

-- Drop the policy causing infinite recursion
DROP POLICY IF EXISTS "Users can view shared projects" ON projects;
