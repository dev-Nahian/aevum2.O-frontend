import { createSlice } from "@reduxjs/toolkit";
import perfumeImage from "@/assets/Images/perfume.png";
import perfume1 from "@/assets/Images/Perfume1.avif";

const initialState = {
  cartItems: [
    {
      id: 1,
      title: "Imagination",
      category: "Fragrance",
      price: "$320",
      quantity: 1,
      image: perfumeImage,
      size: "100ml"
    },
    {
      id: 2,
      title: "Midnight Oud Essence",
      category: "Fragrance",
      price: "$120",
      quantity: 2,
      image: perfume1,
      size: "125ml"
    }
  ]
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, size, quantity } = action.payload;
      // Check if item with same ID and size is already in cart
      const existingItem = state.cartItems.find(
        (item) => item.id === id && item.size === size
      );

      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: quantity || 1
        });
      }
    },
    removeFromCart: (state, action) => {
      const { id, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        (item) => !(item.id === id && item.size === size)
      );
    },
    incrementQuantity: (state, action) => {
      const { id, size } = action.payload;
      const item = state.cartItems.find(
        (item) => item.id === id && item.size === size
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decrementQuantity: (state, action) => {
      const { id, size } = action.payload;
      const item = state.cartItems.find(
        (item) => item.id === id && item.size === size
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        }
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
