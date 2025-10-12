import { supabase } from './supabase/client';
import { User } from './types';

export async function signUp(email: string, password: string, name?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) throw error;

  if (data.user) {
    await supabase.from('users').insert({
      id: data.user.id,
      email: data.user.email!,
      name: name || null,
    });

    await supabase.from('wallets').insert({
      user_id: data.user.id,
      balance: 50,
    });

    await supabase.from('ledger_entries').insert({
      wallet_id: (await supabase.from('wallets').select('id').eq('user_id', data.user.id).single()).data!.id,
      delta: 50,
      description: 'Welcome bonus credits',
      meta: { type: 'signup_bonus' },
    });
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  return userData;
}

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()
        .then(({ data }) => {
          callback(data);
        });
    } else {
      callback(null);
    }
  });
}
