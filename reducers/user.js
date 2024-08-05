import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    value: { token: null, username: null, isConnected: false },
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        signin: (state, action) => {
            state.value.token = action.payload.token;
            state.value.username = action.payload.username;
            state.value.isConnected = true;
        },
        logout: (state) => {
            state.value.token = null;
            state.value.username = null;
            state.value.isConnected = false;
        },
    },
});

export const { signin, logout } = userSlice.actions;
export default userSlice.reducer;
