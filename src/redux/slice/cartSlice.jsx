import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // products
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(p => p._id === item._id);

      if (existing) {
        existing.qty += item.qty;
      } else {
        state.items.push(item);
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(p => p._id !== action.payload);
    },

    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find(p => p._id === id);
      if (item) item.qty = qty;
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
