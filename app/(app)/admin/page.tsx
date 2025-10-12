'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Wallet, FolderKanban, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalCredits: 0,
    totalRevenue: 0,
  });
  const [userId, setUserId] = useState('');
  const [creditAmount, setCreditAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [usersRes, projectsRes, walletsRes, ordersRes] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('wallets').select('balance'),
        supabase.from('orders').select('amount').eq('status', 'COMPLETED'),
      ]);

      const totalCredits = (walletsRes.data || []).reduce((sum, w) => sum + w.balance, 0);
      const totalRevenue = (ordersRes.data || []).reduce((sum, o) => sum + o.amount, 0);

      setStats({
        totalUsers: usersRes.count || 0,
        totalProjects: projectsRes.count || 0,
        totalCredits,
        totalRevenue: totalRevenue / 100,
      });
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  const grantCredits = async () => {
    if (!userId || !creditAmount) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const amount = parseInt(creditAmount);

      const { data: wallet } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', userId)
        .single();

      if (!wallet) {
        toast.error('User wallet not found');
        return;
      }

      await supabase
        .from('wallets')
        .update({ balance: wallet.balance + amount })
        .eq('id', wallet.id);

      await supabase.from('ledger_entries').insert({
        wallet_id: wallet.id,
        delta: amount,
        description: 'Admin credit grant',
        meta: { source: 'admin_panel' },
      });

      toast.success(`Granted ${amount} credits to user`);
      setUserId('');
      setCreditAmount('');
      loadStats();
    } catch (error: any) {
      toast.error('Failed to grant credits');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">System overview and management tools</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
              <FolderKanban className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
              <Wallet className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCredits.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="credits" className="space-y-6">
          <TabsList>
            <TabsTrigger value="credits">Credit Management</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="credits">
            <Card>
              <CardHeader>
                <CardTitle>Grant Credits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    placeholder="Enter user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditAmount">Credit Amount</Label>
                  <Input
                    id="creditAmount"
                    type="number"
                    placeholder="Enter credit amount"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(e.target.value)}
                  />
                </div>
                <Button onClick={grantCredits} disabled={loading}>
                  {loading ? 'Granting...' : 'Grant Credits'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">User management tools coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Order history coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
