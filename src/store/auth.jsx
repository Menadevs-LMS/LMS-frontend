import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: { isLogin: false, loading: false },
    reducers: {
        setLogin: (state, action) => {
            state.isLogin = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
});

export const { setLogin, setLoading } = authSlice.actions;

export default authSlice.reducer;