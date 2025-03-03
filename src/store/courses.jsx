import { createSlice } from "@reduxjs/toolkit";

const courses = createSlice({
    name: 'courses',
    initialState: [],
    reducers: {
        setCourses: (state, action) => {
            state = action.payload
        },

    }
});

export const { setCourses } = courses.actions;

export default courses.reducer;