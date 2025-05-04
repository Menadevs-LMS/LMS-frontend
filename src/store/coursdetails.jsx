import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./auth";
import { delayLoading } from './loading'
const backendUrl = import.meta.env.VITE_BACKEND_URL

export const getCourseDetails = createAsyncThunk("/course/deatils", async (id, { dispatch, rejeectWithValues }) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${backendUrl}/instructor/course/get/details/${id}`, {
            headers: { "Content-Type": 'application/json' }
        });
        await delayLoading(Date.now())
        dispatch(setLoading(false))
        return response.data.data;
    } catch (error) {
        dispatch(setLoading(false))
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