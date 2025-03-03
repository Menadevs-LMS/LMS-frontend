import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth';
import courseList from './courselist';
import courseDetails from './coursdetails'
import courses from './courses';

const store = configureStore({
    reducer: {
        auth: authSlice,
        courses: courses,
        courselist: courseList,
        coursedetails: courseDetails
    }
});

export default store;