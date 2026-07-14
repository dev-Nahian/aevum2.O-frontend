import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistAPI } from "@/lib/apiClient";

export const fetchWishlistAsync = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.get();
      return response.wishlist.products.map((p) => ({
        id: p.id || p._id,
        _id: p._id,
        title: p.title,
        category: p.category,
        price: p.price,
        image: p.image,
      }));
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  "wishlist/addToWishlist",
  async (product, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("aevum_token");
    if (!token) {
      // Guest: return payload to add locally
      return {
        id: product.id || product._id,
        _id: product._id,
        title: product.title,
        category: product.category,
        price: product.price,
        image: product.image,
      };
    }
    try {
      const productId = product._id || product.id;
      await wishlistAPI.add(productId);
      dispatch(fetchWishlistAsync());
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to wishlist"
      );
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("aevum_token");
    if (!token) {
      return productId;
    }
    try {
      await wishlistAPI.remove(productId);
      dispatch(fetchWishlistAsync());
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from wishlist"
      );
    }
  }
);

export const clearWishlistAsync = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { rejectWithValue, dispatch }) => {
    const token = localStorage.getItem("aevum_token");
    if (!token) {
      return null;
    }
    try {
      await wishlistAPI.clear();
      dispatch(fetchWishlistAsync());
      return null;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear wishlist"
      );
    }
  }
);

const initialState = {
  wishlistItems: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const id = product.id || product._id;
      const exists = state.wishlistItems.find((item) => item.id === id);
      if (!exists) {
        state.wishlistItems.push({
          id,
          _id: product._id,
          title: product.title,
          category: product.category,
          price: product.price,
          image: product.image,
        });
      }
    },
    removeFromWishlist: (state, action) => {
      const id = action.payload;
      state.wishlistItems = state.wishlistItems.filter(
        (item) => item.id !== id && item._id !== id
      );
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlistAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlistAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlistAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const product = action.payload;
          const id = product.id || product._id;
          const exists = state.wishlistItems.find((item) => item.id === id);
          if (!exists) {
            state.wishlistItems.push(product);
          }
        }
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const id = action.payload;
          state.wishlistItems = state.wishlistItems.filter(
            (item) => item.id !== id && item._id !== id
          );
        }
      })
      .addCase(clearWishlistAsync.fulfilled, (state) => {
        state.wishlistItems = [];
      });
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
