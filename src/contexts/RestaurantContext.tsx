import React, { createContext, useContext, useState } from 'react';
import { Restaurant, Category, Product, Table, Order, OrderItem } from '@/types';

interface RestaurantContextType {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
  tables: Table[];
  orders: Order[];
  updateRestaurant: (data: Partial<Restaurant>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, data: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateTableStatus: (tableId: string, status: Table['status'], orderId?: string) => void;
  createOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  updateOrder: (orderId: string, data: Partial<Order>) => void;
  addItemToOrder: (orderId: string, item: Omit<OrderItem, 'id'>) => void;
  updateOrderItem: (orderId: string, itemId: string, data: Partial<OrderItem>) => void;
  removeOrderItem: (orderId: string, itemId: string) => void;
  getOrderByTableId: (tableId: string) => Order | undefined;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

// Initial mock data
const initialRestaurant: Restaurant = {
  id: '1',
  name: 'Lanchonete do Zé',
  pixKey: 'pix@lanchonete.com',
};

const initialCategories: Category[] = [
  { id: '1', name: 'Lanches', icon: '🍔', order: 1, active: true },
  { id: '2', name: 'Pizzas', icon: '🍕', order: 2, active: true },
  { id: '3', name: 'Bebidas', icon: '🥤', order: 3, active: true },
  { id: '4', name: 'Espetos', icon: '🍢', order: 4, active: true },
  { id: '5', name: 'Porções', icon: '🍟', order: 5, active: true },
  { id: '6', name: 'Sobremesas', icon: '🍰', order: 6, active: true },
];

const initialProducts: Product[] = [
  { id: '1', name: 'X-Burger', code: '001', price: 18.90, categoryId: '1', active: true, variations: [{ id: '1', name: 'Ponto da Carne', options: ['Mal Passado', 'Ao Ponto', 'Bem Passado'], required: true }], additionals: [{ id: '1', name: 'Bacon Extra', price: 4.00 }, { id: '2', name: 'Ovo', price: 2.50 }] },
  { id: '2', name: 'X-Salada', code: '002', price: 20.90, categoryId: '1', active: true, variations: [{ id: '1', name: 'Ponto da Carne', options: ['Mal Passado', 'Ao Ponto', 'Bem Passado'], required: true }] },
  { id: '3', name: 'X-Bacon', code: '003', price: 24.90, categoryId: '1', active: true },
  { id: '4', name: 'X-Tudo', code: '004', price: 28.90, categoryId: '1', active: true },
  { id: '5', name: 'Pizza Margherita', code: '010', price: 45.90, categoryId: '2', active: true },
  { id: '6', name: 'Pizza Calabresa', code: '011', price: 48.90, categoryId: '2', active: true },
  { id: '7', name: 'Pizza 4 Queijos', code: '012', price: 52.90, categoryId: '2', active: true },
  { id: '8', name: 'Coca-Cola 350ml', code: '020', price: 6.00, categoryId: '3', active: true },
  { id: '9', name: 'Guaraná 350ml', code: '021', price: 5.50, categoryId: '3', active: true },
  { id: '10', name: 'Suco Natural', code: '022', price: 8.00, categoryId: '3', active: true },
  { id: '11', name: 'Água Mineral', code: '023', price: 4.00, categoryId: '3', active: true },
  { id: '12', name: 'Espeto de Carne', code: '030', price: 8.00, categoryId: '4', active: true },
  { id: '13', name: 'Espeto de Frango', code: '031', price: 7.00, categoryId: '4', active: true },
  { id: '14', name: 'Espeto Misto', code: '032', price: 9.00, categoryId: '4', active: true },
  { id: '15', name: 'Batata Frita', code: '040', price: 18.00, categoryId: '5', active: true },
  { id: '16', name: 'Onion Rings', code: '041', price: 22.00, categoryId: '5', active: true },
  { id: '17', name: 'Pudim', code: '050', price: 12.00, categoryId: '6', active: true },
  { id: '18', name: 'Petit Gateau', code: '051', price: 18.00, categoryId: '6', active: true },
];

const initialTables: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: String(i + 1),
  number: i + 1,
  status: i === 2 || i === 5 ? 'active' : i === 7 ? 'pending' : 'free',
  currentOrderId: i === 2 ? 'order-1' : i === 5 ? 'order-2' : i === 7 ? 'order-3' : undefined,
}));

const initialOrders: Order[] = [
  {
    id: 'order-1',
    tableId: '3',
    tableNumber: 3,
    customerName: 'Pedro Silva',
    waiterId: '2',
    waiterName: 'João Garçom',
    items: [
      { id: '1', productId: '1', productName: 'X-Burger', quantity: 2, unitPrice: 18.90, totalPrice: 37.80 },
      { id: '2', productId: '8', productName: 'Coca-Cola 350ml', quantity: 2, unitPrice: 6.00, totalPrice: 12.00 },
    ],
    status: 'open',
    total: 49.80,
    createdAt: new Date(),
  },
  {
    id: 'order-2',
    tableId: '6',
    tableNumber: 6,
    customerName: 'Ana Costa',
    waiterId: '3',
    waiterName: 'Maria Garçom',
    items: [
      { id: '1', productId: '5', productName: 'Pizza Margherita', quantity: 1, unitPrice: 45.90, totalPrice: 45.90 },
    ],
    status: 'open',
    total: 45.90,
    createdAt: new Date(),
  },
  {
    id: 'order-3',
    tableId: '8',
    tableNumber: 8,
    customerName: 'Lucas Mendes',
    waiterId: '2',
    waiterName: 'João Garçom',
    items: [
      { id: '1', productId: '3', productName: 'X-Bacon', quantity: 1, unitPrice: 24.90, totalPrice: 24.90 },
      { id: '2', productId: '15', productName: 'Batata Frita', quantity: 1, unitPrice: 18.00, totalPrice: 18.00 },
      { id: '3', productId: '8', productName: 'Coca-Cola 350ml', quantity: 1, unitPrice: 6.00, totalPrice: 6.00 },
    ],
    status: 'pending_payment',
    total: 48.90,
    createdAt: new Date(),
  },
];

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant>(initialRestaurant);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [tables, setTables] = useState<Table[]>(initialTables);
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const updateRestaurant = (data: Partial<Restaurant>) => {
    setRestaurant(prev => ({ ...prev, ...data }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = { ...category, id: crypto.randomUUID() };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, data: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: crypto.randomUUID() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateTableStatus = (tableId: string, status: Table['status'], orderId?: string) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status, currentOrderId: orderId } : t
    ));
  };

  const createOrder = (order: Omit<Order, 'id' | 'createdAt'>): Order => {
    const newOrder: Order = {
      ...order,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
    updateTableStatus(order.tableId, 'active', newOrder.id);
    return newOrder;
  };

  const updateOrder = (orderId: string, data: Partial<Order>) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...data } : o));
  };

  const addItemToOrder = (orderId: string, item: Omit<OrderItem, 'id'>) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newItems = [...o.items, newItem];
        const newTotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
        return { ...o, items: newItems, total: newTotal };
      }
      return o;
    }));
  };

  const updateOrderItem = (orderId: string, itemId: string, data: Partial<OrderItem>) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newItems = o.items.map(i => {
          if (i.id === itemId) {
            const updated = { ...i, ...data };
            if (data.quantity !== undefined) {
              updated.totalPrice = updated.unitPrice * updated.quantity;
            }
            return updated;
          }
          return i;
        });
        const newTotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
        return { ...o, items: newItems, total: newTotal };
      }
      return o;
    }));
  };

  const removeOrderItem = (orderId: string, itemId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newItems = o.items.filter(i => i.id !== itemId);
        const newTotal = newItems.reduce((sum, i) => sum + i.totalPrice, 0);
        return { ...o, items: newItems, total: newTotal };
      }
      return o;
    }));
  };

  const getOrderByTableId = (tableId: string): Order | undefined => {
    const table = tables.find(t => t.id === tableId);
    if (table?.currentOrderId) {
      return orders.find(o => o.id === table.currentOrderId);
    }
    return undefined;
  };

  return (
    <RestaurantContext.Provider value={{
      restaurant,
      categories,
      products,
      tables,
      orders,
      updateRestaurant,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      updateTableStatus,
      createOrder,
      updateOrder,
      addItemToOrder,
      updateOrderItem,
      removeOrderItem,
      getOrderByTableId,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
}
