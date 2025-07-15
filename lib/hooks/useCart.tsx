import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  item: ProductType;
  quantity: number;
  color?: string; // ? means optional
  size?: string; // ? means optional
}

interface CartStore {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (target: { id: string; color?: string; size?: string }) => void
  increaseQuantity: (target: { id: string; color?: string; size?: string }) => void;
  decreaseQuantity: (target: { id: string; color?: string; size?: string }) => void;
  clearCart: () => void;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      cartItems: [],
      addItem: (data: CartItem) => {
        const { item, quantity, color, size } = data;
        const currentItems = get().cartItems;

        const existingItemIndex = currentItems.findIndex(
          (cartItem) =>
            cartItem.item._id === item._id &&
            cartItem.color === color &&
            cartItem.size === size
        );

        if (existingItemIndex !== -1) {
          // Variant exists, increase quantity
          const updatedItems = [...currentItems];
          updatedItems[existingItemIndex].quantity += quantity;
          set({ cartItems: updatedItems });
          toast.success("Item quantity updated 🛒");
        } else {
          // Variant is new, add to cart
          set({
            cartItems: [...currentItems, { item, quantity, color, size }],
          });
          toast.success("Item added to cart 🛒", { icon: "🛒" });
        }
      },

      removeItem: ({ id, color, size }) => {
        const newCartItems = get().cartItems.filter (
          (cartItem) => !(cartItem.item._id === id &&
            cartItem.color === color &&
            cartItem.size === size)

        );
        set({ cartItems: newCartItems });
        toast.success("Item removed from cart");
      },
      increaseQuantity: ({ id, color, size }) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item._id === id &&
            cartItem.color === color &&
            cartItem.size === size
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        set({ cartItems: newCartItems });
        toast.success("Item quantity increased");
      },
      decreaseQuantity: ({ id, color, size }) => {
        const newCartItems = get().cartItems.map((cartItem) =>
          cartItem.item._id === id &&
            cartItem.color === color &&
            cartItem.size === size
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        ).filter((cartItem) => cartItem.quantity > 0); // auto-remove if 0

        set({ cartItems: newCartItems });
        toast.success("Item quantity decreased");
      },
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;

