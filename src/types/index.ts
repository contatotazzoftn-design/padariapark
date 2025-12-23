export type UserRole = 'admin' | 'waiter';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  theme: 'light' | 'dark';
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logo?: string;
  pixKey?: string;
}

export interface Table {
  id: string;
  number: number;
  status: 'free' | 'active' | 'pending';
  currentOrderId?: string;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  order: number;
  active: boolean;
}

export interface ProductVariation {
  id: string;
  name: string;
  options: string[];
  required: boolean;
}

export interface ProductAdditional {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  code?: string;
  price: number;
  categoryId: string;
  image?: string;
  active: boolean;
  variations?: ProductVariation[];
  additionals?: ProductAdditional[];
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  variations?: Record<string, string>;
  additionals?: { name: string; price: number }[];
  notes?: string;
}

export type OrderStatus = 'open' | 'pending_payment' | 'paid';
export type PaymentMethod = 'pix' | 'credit' | 'debit';

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  customerName: string;
  waiterId: string;
  waiterName: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  paymentMethod?: PaymentMethod;
  createdAt: Date;
  paidAt?: Date;
}
