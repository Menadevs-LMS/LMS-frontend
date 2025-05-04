import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setLoading } from "./auth";
import { delayLoading } from "./loading";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const deleteCourse = createAsyncThunk("/course/delete", async (id, { dispatch, rejectWithValue }) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.post(`${backendUrl}/instructor/course/delete/${id}`);
        dispatch(setLoading(false))
        return { id, ...response.data };
    } catch (error) {
        dispatch(setLoading(false))
        console.error("Delete course error:", error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const editCourse = createAsyncThunk("/course/edit", async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.put(`${backendUrl}/instructor/course/update/${id}`, data);
        dispatch(setLoading(false))
        return response.data;
    } catch (error) {
        dispatch(setLoading(false))
        console.error("Edit course error:", error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const getAllCourses = createAsyncThunk("/courses/getAll", async (_, { dispatch, rejectWithValue }) => {
    try {
        console.log()
        dispatch(setLoading(true))
        const response = await axios.get(`${backendUrl}/instructor/course/get`);
        await delayLoading(new Date())
        dispatch(setLoading(false))
        return response.data.data;
    } catch (error) {
        dispatch(setLoading(false))
        console.error("Edit course error:", error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
export const getLastEnroll = createAsyncThunk("/courses/getlast", async (_, { dispatch, rejectWithValue }) => {
    try {
        console.log()
        dispatch(setLoading(true))
        const response = await axios.get(`${backendUrl}/instructor/course/getlast`);
        await delayLoading(new Date())
        dispatch(setLoading(false))
        return response.data.data;
    } catch (error) {
        dispatch(setLoading(false))
        console.error("Edit course error:", error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
export const getEnrollCountCoures = createAsyncThunk("/courses/getenrolled", async (_, { dispatch, rejectWithValue }) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${backendUrl}/instructor/course/getenrolled`);
        await delayLoading(new Date())
        dispatch(setLoading(false))
        return response.data.enrolledCoursesCount;
    } catch (error) {
        dispatch(setLoading(false))
        console.error("Edit course error:", error);
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});
export const getNumberOfStudents = createAsyncThunk("/courses/numberofstudent", async (_, { dispatch, rejectWithValue }) => {
    try {
        dispatch(setLoading(true))
        const response = await axios.get(`${backendUrl}/auth/numberofstudent`);
        await delayLoading(new Date())
        dispatch(setLoading(false))
        return response.data.count;
    } catch (error) {
        dispatch(setLoading(false))
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
        lastCourses: [],
        enrollCount: 0,
        numberOfStudent: 0
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
        builder
            .addCase(getAllCourses.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getAllCourses.fulfilled, (state, action) => {
                state.status = "succeeded";
                console.log("Corussssssssssssssss>>", action.payload)
                state.courses = action.payload
            })
            .addCase(getAllCourses.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
        builder
            .addCase(getLastEnroll.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getLastEnroll.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.lastCourses = action.payload
            })
            .addCase(getLastEnroll.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
        builder
            .addCase(getEnrollCountCoures.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getEnrollCountCoures.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.enrollCount = action.payload
            })
            .addCase(getEnrollCountCoures.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
        builder
            .addCase(getNumberOfStudents.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getNumberOfStudents.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.numberOfStudent = action.payload
            })
            .addCase(getNumberOfStudents.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    }
});

export default courses.reducer;
