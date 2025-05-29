import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth';
import courseList from './courselist';
import courseDetails from './coursdetails'
import courses from './courses';
import categories from './categories'
import courseProgress from './courseProgress'
const store = configureStore({
    reducer: {
        auth: authSlice,
        courses: courses,
        courselist: courseList,
        coursedetails: courseDetails,
        categories: categories,
        courseProgress: courseProgress
    }
});

export default store;