import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./auth";
import { delayLoading } from './loading'
const backendUrl = import.meta.env.VITE_BACKEND_URL
const token = localStorage.getItem("accessToken")
export const updateCourseEnrolled = createAsyncThunk("/course/courseProgress", async (id, { dispatch, rejeectWithValues }) => {
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

export const checkEnrolled = createAsyncThunk("/course/checkEnrolled", async (id, { dispatch, rejeectWithValues }) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${backendUrl}/student/courses-update/checkEnrolled/${id}`, {
            headers: { "Content-Type": 'application/json', "Authorization": `Bear ${token}` }
        });
        dispatch(setLoading(false))
        console.log("courseProgress>>>", response.data)
        return response.data
    } catch (error) {
        dispatch(setLoading(false))
        return rejeectWithValues(error.response?.data?.message || error.message)
    }
});
export const getCourseDetailsWithProgress = createAsyncThunk("/course/deteailsWithProgress", async (id, { dispatch, rejeectWithValues }) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${backendUrl}/student/course-progress/get-course-deatiles/${id}`, {
            headers: { "Content-Type": 'application/json', "Authorization": `Bear ${token}` }
        });
        dispatch(setLoading(false))
        return response.data
    } catch (error) {
        dispatch(setLoading(false))
        return rejeectWithValues(error.response?.data?.message || error.message)
    }
});
export const updateLectuerProgress = createAsyncThunk(
    "/update-lectuer-progress",
    async ({ courseId, lectureId, payload }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true));

            // Make sure to send lectureId in the payload
            const requestPayload = {
                lectureId: lectureId,
                ...payload
            };

            const response = await axios.put(
                `${backendUrl}/student/course-progress/update-lectuer-progress/${courseId}`,
                requestPayload,
                {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            dispatch(setLoading(false));
            return response.data;
        } catch (error) {
            dispatch(setLoading(false));
            console.error('Error updating lecture progress:', error);
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateCourseProgress = createAsyncThunk(
    "/update-course-progress",
    async ({ id, payload }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(setLoading(true));

            const response = await axios.put(
                `${backendUrl}/student/course-progress/update-course-progress/${id}`,
                payload,
                {
                    headers: {
                        "Content-Type": 'application/json',
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            dispatch(setLoading(false));
            return response.data;
        } catch (error) {
            dispatch(setLoading(false));
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
export const enrolledCourse = createAsyncThunk("/course/enrolledCourse", async ({ id, payload }, { dispatch, rejeectWithValues }) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.post(`${backendUrl}/student/courses-update/enrolled-course/${id}`, payload, {
            headers: { "Content-Type": 'application/json', "Authorization": `Bear ${token}` }
        });
        dispatch(setLoading(false))
        console.log("payload>>>>>>>>>>>", response.data)

        return response.data
    } catch (error) {
        dispatch(setLoading(false));
        console.log("payload>>>>>>>>>>>", error)

        return rejeectWithValues(error.response?.data?.message || error.message)
    }
})


const courseProgress = createSlice({
    name: 'courseProgress',
    initialState: {
        courseEnrolled: null,
        courseDeatilesProgress: [],
        status: '',
        error: null
    },
    extraReducers: (builder) => {
        builder.addCase(checkEnrolled.pending, (state) => {
            state.status = "loading"
        })
            .addCase(checkEnrolled.fulfilled, (state, action) => {
                console.log("action.payload>", action.payload)
                state.courseEnrolled = action.payload
            })
            .addCase(checkEnrolled.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload
            }).addCase(getCourseDetailsWithProgress.pending, (state) => {
                state.status = "loading"
            })
            .addCase(getCourseDetailsWithProgress.fulfilled, (state, action) => {
                console.log("action.payload>", action.payload)
                state.courseDeatilesProgress = action.payload
            })
            .addCase(getCourseDetailsWithProgress.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload
            })

    }
});


export default courseProgress.reducer;