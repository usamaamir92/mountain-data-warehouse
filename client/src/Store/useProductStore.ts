import { create } from 'zustand';

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

const useProductStore = create<ProductState>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
  updateProduct: (updatedProduct: Product) => set((state) => ({
    products: state.products.map((product: Product) =>
      product.productId === updatedProduct.productId ? updatedProduct : product
    )
  })),
  deleteProduct: (productId: string) => set((state) => ({
    products: state.products.filter((product: Product) => product.productId !== productId)
  })),
}));

export default useProductStore;
