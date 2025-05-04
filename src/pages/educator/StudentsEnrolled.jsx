import { getAllCourses } from '../../store/courses';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const StudentsEnrolled = () => {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAllCourses());
  }, [dispatch]);

  const filteredEnrollments = courses?.flatMap((course) =>
    course.students
      .filter((student) =>
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((student) => ({
        courseTitle: course.title,
        studentName: student.studentName,
        date: student.date,
        id: student._id,
      }))
  );

  return (
    <div className="min-h-screen flex flex-col items-start md:p-8 md:pb-0 p-4 pt-8 pb-0 w-full">
      <div className="w-full max-w-4xl mb-6">
        <input
          type="text"
          placeholder="Search by student name..."
          className="w-full px-4 py-3 border border-blue-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-gray-400 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
        <table className="table-fixed md:table-auto w-full overflow-hidden pb-4">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
              <th className="px-4 py-3 font-semibold">Course Title</th>
              <th className="px-4 py-3 font-semibold">Student Name</th>
              <th className="px-4 py-3 font-semibold hidden sm:table-cell">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-500">
            {filteredEnrollments?.map((entry, index) => (
              <tr key={entry.id || index} className="border-b border-gray-500/20">
                <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                <td className="md:px-4 px-2 py-3 truncate">{entry.courseTitle}</td>
                <td className="px-4 py-3 truncate">{entry.studentName}</td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filteredEnrollments?.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center text-gray-400">
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsEnrolled;
