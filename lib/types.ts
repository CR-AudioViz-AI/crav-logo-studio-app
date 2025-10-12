export type Provider = 'STRIPE' | 'PAYPAL';
export type AssetKind = 'UPLOAD' | 'MOCKUP' | 'EXPORT' | 'FONT';
export type Visibility = 'PRIVATE' | 'LINK' | 'PUBLIC';
export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type SubStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED';
export type Role = 'VIEW' | 'COMMENT' | 'EDIT' | 'ADMIN';
export type Plan = 'FREE' | 'STARTER' | 'PRO' | 'STUDIO';
export type OrderStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface LedgerEntry {
  id: string;
  wallet_id: string;
  delta: number;
  description: string;
  meta?: any;
  created_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  title: string;
  visibility: Visibility;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

export interface Revision {
  id: string;
  project_id: string;
  svg: string;
  editor_state: any;
  preview_url?: string;
  notes?: string;
  created_at: string;
}

export interface Asset {
  id: string;
  project_id: string;
  kind: AssetKind;
  url: string;
  meta?: any;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  provider: Provider;
  amount: number;
  currency: string;
  status: OrderStatus;
  external_id?: string;
  meta?: any;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  provider: Provider;
  external_id: string;
  status: SubStatus;
  plan: Plan;
  current_period_start?: string;
  current_period_end?: string;
  meta?: any;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  tags: string[];
  svg: string;
  thumb: string;
  is_featured: boolean;
  created_at: string;
}

export interface Share {
  id: string;
  project_id: string;
  email?: string;
  role: Role;
  token: string;
  expires_at?: string;
  created_at: string;
}
