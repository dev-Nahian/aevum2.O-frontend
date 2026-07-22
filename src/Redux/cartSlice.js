import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartAPI } from "@/lib/apiClient";

export const fetchCartAsync = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.get();
      const items = response.cart?.items || [];
      return items
        .filter((item) => item.product !== null && item.product !== undefined)
        .map((item) => ({
          id: item.product.id || item.product._id,
          _id: item.product._id,
          title: item.product.title,
          category: item.product.category,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
          size: item.size,
        }));
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ id, title, category, price, quantity, image, size, _id }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("aevum_token");
    if (!token) {
      // Guest: return payload to add locally
      return { id, title, category, price, quantity: quantity || 1, image, size, _id };
    }
    try {
      const productId = _id || id;
      await cartAPI.add(productId, quantity || 1, size);
      dispatch(fetchCartAsync());
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async ({ id, size, _id }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("aevum_token");
    if (!token) {
      return { id, size };
    }
    try {
      const productId = _id || id;
      await cartAPI.remove(productId, size);
      dispatch(fetchCartAsync());
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove from cart");
    }
  }
);

export const incrementQuantityAsync = createAsyncThunk(
  "cart/incrementQuantity",
  async ({ id, size, quantity, _id }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("aevum_token");
    if (!token) {
      return { id, size };
    }
    try {
      const productId = _id || id;
      await cartAPI.update(productId, quantity + 1, size);
      dispatch(fetchCartAsync());
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update quantity");
    }
  }
);

export const decrementQuantityAsync = createAsyncThunk(
  "cart/decrementQuantity",
  async ({ id, size, quantity, _id }, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("aevum_token");
    if (!token) {
      return { id, size };
    }
    try {
      if (quantity <= 1) return null;
      const productId = _id || id;
      await cartAPI.update(productId, quantity - 1, size);
      dispatch(fetchCartAsync());
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update quantity");
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("aevum_token");
    if (!token) {
      return null;
    }
    try {
      await cartAPI.clear();
      dispatch(fetchCartAsync());
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
  }
);

const initialState = {
  cartItems: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id, size, quantity } = action.payload;
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
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, size, quantity } = action.payload;
          const existingItem = state.cartItems.find(
            (item) => item.id === id && item.size === size
          );
          if (existingItem) {
            existingItem.quantity += quantity || 1;
          } else {
            state.cartItems.push(action.payload);
          }
        }
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, size } = action.payload;
          state.cartItems = state.cartItems.filter(
            (item) => !(item.id === id && item.size === size)
          );
        }
      })
      .addCase(incrementQuantityAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, size } = action.payload;
          const item = state.cartItems.find(
            (item) => item.id === id && item.size === size
          );
          if (item) item.quantity += 1;
        }
      })
      .addCase(decrementQuantityAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const { id, size } = action.payload;
          const item = state.cartItems.find(
            (item) => item.id === id && item.size === size
          );
          if (item && item.quantity > 1) item.quantity -= 1;
        }
      })
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.cartItems = [];
      });
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
