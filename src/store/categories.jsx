import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from './auth'
import { delayLoading } from "./loading";
const backendUrl = import.meta.env.VITE_BACKEND_URL
export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async (newCategory, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true));
            const response = await axios.post(`${backendUrl}/new-category`, { categore: newCategory }, {
                headers: { 'Content-Type': 'application/json' }
            });
            await delayLoading(Date.now())
            dispatch(setLoading(false));
            return response.data;
        } catch (error) {
            dispatch(setLoading(false));
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const getAllCategories = createAsyncThunk('categirues/getCategories', async (_, { dispatch, rejectWithValue }) => {
    try {
        dispatch(setLoading(true));
        const response = await axios.get(`${backendUrl}/allcatgories`);
        await delayLoading(Date.now())
        dispatch(setLoading(false));
        return response.data?.data;
    } catch (error) {
        dispatch(setLoading(false));
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (categoryId, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true));
            await axios.delete(`${backendUrl}/categories/${categoryId}`);
            await delayLoading(Date.now())
            dispatch(setLoading(false));
            return categoryId;
        } catch (error) {
            dispatch(setLoading(false));
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const categories = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        status: '',
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(addCategory.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories.push(action.payload?.categoryName);
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getAllCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
            })
            .addCase(getAllCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(deleteCategory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = state.categories.filter(category => category._id !== action.payload);
            })

            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }

});


export default categories.reducer;