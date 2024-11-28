import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type Product = {
  productId: string;
  name: string;
  description: string;
  price: number;
  stock: number;
};

type ProductState = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  deleteProduct: (productId: string) => void;
};

const useProductStore = create(
  persist<ProductState>(
    (set) => ({
      products: [],
      setProducts: (products) => set({ products }),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (updatedProduct: Product) => set((state) => ({
        products: state.products.map((product) =>
          product.productId === updatedProduct.productId ? updatedProduct : product
        )
      })),
      deleteProduct: (productId: string) => set((state) => ({
        products: state.products.filter((product) => product.productId !== productId)
      })),
    }),
    {
      name: 'products-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useProductStore;
