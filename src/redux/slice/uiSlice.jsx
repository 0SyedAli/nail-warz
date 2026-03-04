import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoginModalOpen: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        openLoginModal: (state) => {
            state.isLoginModalOpen = true;
        },
        closeLoginModal: (state) => {
            state.isLoginModalOpen = false;
        },
    },
});

export const { openLoginModal, closeLoginModal } = uiSlice.actions;
export default uiSlice.reducer;
