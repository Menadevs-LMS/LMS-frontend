import { createSlice } from "@reduxjs/toolkit";

const courseList = createSlice({
    name: 'courseList',
    initialState: {},
    reducers: {
        setCourseList: (state, action) => {

        },

    }
});

export const { setCourseList } = courseList.actions;

export default courseList.reducer;