'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, setUser } = useAppStore();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', user!.id);

      if (error) throw error;

      setUser({ ...user!, name });
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-slate-600">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-slate-50"
                  />
                </div>
                <Button onClick={updateProfile} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Account ID</Label>
                  <Input value={user?.id || ''} disabled className="bg-slate-50 font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <Input
                    value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : ''}
                    disabled
                    className="bg-slate-50"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
