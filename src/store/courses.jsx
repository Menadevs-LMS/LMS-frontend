import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const deleteCourse = createAsyncThunk("/course/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${backendUrl}/instructor/course/delete/${id}`);
        return { id, ...response.data }; 
    } catch (error) {
        console.error("Delete course error:", error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const editCourse = createAsyncThunk("/course/edit", async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${backendUrl}/instructor/course/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Edit course error:", error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const courses = createSlice({
    name: 'courses',
    initialState: {
        courses: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(deleteCourse.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.courses = state.courses.filter(course => course._id !== action.payload.id);
                state.error = null;
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });

        builder
            .addCase(editCourse.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(editCourse.fulfilled, (state, action) => {
                state.status = "succeeded";
                const index = state.courses.findIndex(course => course._id === action.payload._id);
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(editCourse.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    }
});

export default courses.reducer;
