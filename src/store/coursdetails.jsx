import { createSlice } from "@reduxjs/toolkit";

const courseDetails = createSlice({
    name: 'coursedetails',
    initialState: {},
    reducers: {
        setCourseDetails: (state, action) => {

        },

    }
});

export const { setCourseDetails } = courseDetails.actions;

export default courseDetails.reducer;