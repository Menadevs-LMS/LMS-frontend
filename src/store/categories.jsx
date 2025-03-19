import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL
export const addCategory = createAsyncThunk(
    'categories/addCategory',
    async (newCategory, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${backendUrl}/new-category`, { categore: newCategory }, {
                headers: { 'Content-Type': 'application/json' }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const getAllCategories = createAsyncThunk('categirues/getCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${backendUrl}/allcatgories`);
        return response.data?.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async (categoryId, { rejectWithValue }) => {
        try {
            await axios.delete(`${backendUrl}/categories/${categoryId}`);
            return categoryId;
        } catch (error) {
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
                state.categories.push(action.payload);
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
                state.categories = state.categories.filter(category => category.id !== action.payload);
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }

});


export default categories.reducer;