import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL

export const getCourseDetails = createAsyncThunk("/course/deatils", async (id, { rejeectWithValues }) => {
    try {
        const response = await axios.get(`${backendUrl}/instructor/course/get/details/${id}`, {
            headers: { "Content-Type": 'application/json' }
        });
        return response.data.data;
    } catch (error) {
        return rejeectWithValues(error.response?.data?.message || error.message)
    }
})


const courseDetails = createSlice({
    name: 'coursedetails',
    initialState: {
        courseDetails: [],
        status: '',
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(getCourseDetails.pending, (state) => {
            state.status = "loading"
        })
            .addCase(getCourseDetails.fulfilled, (state, action) => {
                state.courseDetails = action.payload
            })
            .addCase(getCourseDetails.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload
            })
    }
});


export default courseDetails.reducer;