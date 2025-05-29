import CourseCard from '../../components/student/CourseCard';

import SearchBar from '../../components/student/SearchBar';
import { getAllCourses } from '../../store/courses';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
const CoursesList = () => {

    const dispatch = useDispatch();
    const allCoures = useSelector((state) => state.courses.courses);

    useEffect(() => {
        dispatch(getAllCourses());
    }, [dispatch]);


    return (
        <>
            <div className="relative md:px-36 px-8 pt-20 text-left">
                <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
                    <div>
                        <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
                        <p className='text-gray-500'><span className='text-blue-600 cursor-pointer'>Home</span> / <span>Course List</span></p>
                    </div>
                    <SearchBar />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
                    {allCoures?.map((course, index) => {
                        return <CourseCard id={course._id} title={course.title} category={course.category} image={course.image} key={index} description={course.description} />
                    })}
                </div>
            </div>
        </>
    )
}

export default CoursesList 