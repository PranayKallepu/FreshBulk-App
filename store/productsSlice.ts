import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { ProductState } from "@/app/types";

// Initial state
const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get("/api/products");
    return response.data;
  }
);

// Slice for products
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to fetch products";
      });
  },
});

export default productsSlice.reducer;
