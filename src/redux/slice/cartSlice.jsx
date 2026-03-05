import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // products
  shippingType: "flat",
  shippingFee: 7,
  deliveryDate: null,
  deliveryDays: null,
};

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const item = action.payload;
//       const existing = state.items.find(p => p._id === item._id);

//       if (existing) {
//         existing.qty += item.qty;
//       } else {
//         state.items.push(item);
//       }
//     },

//     removeFromCart: (state, action) => {
//       state.items = state.items.filter(p => p._id !== action.payload);
//     },

//     updateQty: (state, action) => {
//       const { id, qty } = action.payload;
//       const item = state.items.find(p => p._id === id);
//       if (item) item.qty = qty;
//     },

//     clearCart: (state) => {
//       state.items = [];
//     },
//   },
// });

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

    setShipping: (state, action) => {
      const { type, fee, deliveryDate, deliveryDays } = action.payload;
      state.shippingType = type;
      state.shippingFee = fee;
      state.deliveryDate = deliveryDate;
      state.deliveryDays = deliveryDays;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(p => p._id !== action.payload);
    },

    // updateQty: (state, action) => {
    //   const { id, qty } = action.payload;
    //   const item = state.items.find(p => p._id === id);
    //   if (item) item.qty = qty;
    // },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;

      if (qty <= 0) {
        state.items = state.items.filter(p => p._id !== id);
      } else {
        const item = state.items.find(p => p._id === id);
        if (item) item.qty = qty;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.shippingType = "flat";
      state.shippingFee = 7;
      state.deliveryDate = null;
      state.deliveryDays = null;
    },
  },
});

// export const { addToCart, setShipping, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export const { addToCart, removeFromCart, updateQty, clearCart, setShipping } = cartSlice.actions;

export default cartSlice.reducer;
