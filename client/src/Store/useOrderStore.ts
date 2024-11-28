import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type OrderProduct = {
  productId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type Order = {
  orderId: string;
  orderDate: Date;
  products: OrderProduct[];
  totalAmount: number;
};

type OrderState = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
};

const useOrderStore = create(
    persist<OrderState>(
        (set) => ({
            orders: [],
            setOrders: (orders) => set({ orders }),
            addOrder: (order) => set((state) => ({ orders: [...state.orders, order] }))
        }),
        {
            name: 'orders-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useOrderStore;
