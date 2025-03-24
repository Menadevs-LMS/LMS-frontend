import axios from "axios";
import { useEffect, useState } from "react";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);

  const getCourses = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/instructor/course/get`);
      setCourses(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <div className='w-full'>
        <h2 className="pb-4 text-lg font-medium">My Courses</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Course Title</th>
                <th className="px-4 py-3 font-semibold truncate">Published On</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id.$oid} className="border-b border-gray-300/30">
                    <td className="px-4 py-3">{course.welcomeMessage || "Untitled Course"}</td>
                    <td className="px-4 py-3">{new Date(course.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{course.students?.length || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-400">
                    No courses available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
