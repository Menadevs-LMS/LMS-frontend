import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCourse } from "../../store/courses";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/auth";
import { delayLoading } from "../../store/loading";
import { getAllCourses } from "../../store/courses";
const MyCourses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);
  const deleteCourseById = async (id) => {
    try {
      dispatch(setLoading(true))

      await dispatch(deleteCourse(id)).unwrap(); // wait for it to complete
      dispatch(getAllCourses());
      await delayLoading(Date.now());
      dispatch(setLoading(false))
    } catch (error) {
      dispatch(setLoading(false))
      console.error("Error deleting course:", error);
    }
  };

  useEffect(() => {
    dispatch(getAllCourses());
  }, []);
  const handleEdit = (id) => {
    navigate(`/educator/edit-course/${id}`);
  }

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
                <th className="px-4 py-3 font-semibold truncate">Edit</th>
                <th className="px-4 py-3 font-semibold truncate">Delete</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course._id.$oid} className="border-b border-gray-300/30">
                    <td className="px-4 py-3">{course.welcomeMessage || "Untitled Course"}</td>
                    <td className="px-4 py-3">{new Date(course.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{course.students?.length || 0}</td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleEdit(course._id)}
                        className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition"
                      >
                        Edit
                      </button>
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => deleteCourseById(course._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
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
