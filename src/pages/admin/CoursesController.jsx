import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, AlertTriangle, X, Video, Edit, Trash2, Search, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../../store/auth';
import { delayLoading } from "../../store/loading";
import { getAllCourses, deleteCourse } from "../../store/courses";
import { getAllCategories } from '../../store/categories'

const CoursesController = ({ userRole }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigate();
  const categoriesState = useSelector((state) => state.categories.categories);




  const showNotification = (type, message, duration = 5000) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, duration);
  };

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendUrl}/instructor/course/get`);
      setCourses(response.data.data);
      showNotification('success', 'Courses loaded successfully');
    } catch (error) {
      console.error('Error fetching courses:', error);
      showNotification('error', 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };



  const confirmDeleteCourse = (id, title) => {
    setCourseToDelete(id);
    setModalMessage(`Are you sure you want to delete "${title}"?`);
    setShowConfirmModal(true);
  };

  const deleteCourseById = async (id) => {
    try {
      dispatch(setLoading(true))

      await dispatch(deleteCourse(id)).unwrap();
      showNotification('success', 'Course deleted successfully');
      setShowConfirmModal(false);
      await fetchCourses()
      await delayLoading(Date.now());
      dispatch(setLoading(false))

    } catch (error) {
      setShowConfirmModal(false);
      dispatch(setLoading(false))
      console.error('Error deleting course:', error);
      showNotification('error', 'Failed to delete course');

    }
  };







  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch])
  // Reset form


  // Search and filter courses
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${backendUrl}/instructor/course/search-courses`, {
        title: searchTerm,
        categories: selectedCategory
      });
      setCourses(response.data.courses);
      showNotification('info', `Found ${response.data.courses.length} courses`);
    } catch (error) {
      console.error('Error searching courses:', error);
      showNotification('error', 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset search
  const resetSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
    fetchCourses();
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchCourses();
    dispatch(getAllCourses());

  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-green-600 text-white py-6 shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Course Management Dashboard</h1>
          <p className="mt-1 text-green-100">Create and manage your educational content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-6 right-6 z-50 p-4 rounded-md shadow-lg max-w-md flex items-center justify-between 
            ${notification.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-600' :
              notification.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-600' :
                'bg-blue-100 text-blue-800 border-l-4 border-blue-600'}`}>
            <div className="flex items-center">
              {notification.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> :
                notification.type === 'error' ? <AlertTriangle className="h-5 w-5 mr-2" /> :
                  <Bell className="h-5 w-5 mr-2" />}
              <p>{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification({ show: false, type: '', message: '' })}
              className="ml-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100">
                <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Confirm Deletion
                </h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-700">{modalMessage}</p>
                <p className="text-sm text-gray-500 mt-2">This action cannot be undone and will permanently remove the course.</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                <button
                  className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2 px-5 rounded-lg cursor-pointer font-medium transition-colors shadow-sm"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setCourseToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white border border-red-700 py-2 px-5 rounded-lg cursor-pointer font-medium transition-colors shadow-sm flex items-center gap-2"
                  onClick={() => deleteCourseById(courseToDelete)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-700 mb-6 flex items-center">
            <Search className="mr-2 h-5 w-5" /> Search & Filter Courses
          </h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search by Title</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Enter course title"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.categoreName}>
                    {category.categoreName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-3">
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-sm flex items-center"
              >
                <Search className="h-4 w-4 mr-2" />
                {isLoading ? 'Searching...' : 'Search'}
              </button>
              <button
                onClick={resetSearch}
                disabled={isLoading}
                className="px-5 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors shadow-sm flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Courses List Section */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-green-700 flex items-center">
              <Video className="mr-2 h-5 w-5" /> Your Courses
            </h2>
            <p className="mt-1 text-sm text-gray-500">Manage all your educational content from here</p>
          </div>

          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-pulse flex justify-center">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <p className="mt-4 text-gray-500">Loading courses...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {courses.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-gray-500">No courses found. Create your first course below!</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Language</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-green-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courses.map((course) => (
                      <tr key={course._id} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {course.image && (
                              <img
                                src={course.image}
                                alt={course.title}
                                className="h-10 w-10 rounded-md object-cover mr-3"
                              />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">{course.title}</div>
                              <div className="text-sm text-gray-500">{course.subtitle}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.primaryLanguage}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isPublised ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {course.isPublised ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigation(`${userRole == 'admin' ? `/admin/edit-course/${course._id}` : `/educator/edit-course/${course._id}`}`)}
                            className="text-green-600 hover:text-green-900 mr-4 flex items-center"
                          >

                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteCourse(course._id, course.title)}
                            className="text-red-600 hover:text-red-900 flex items-center mt-2"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
            <Bell className="mr-2 h-5 w-5" /> Tips for Creating Great Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Course Content</h3>
              <p className="text-sm text-green-700">
                Create comprehensive content that addresses your audience's needs.
                Consider including varied learning materials like videos, PDFs, and quizzes.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Engagement</h3>
              <p className="text-sm text-green-700">
                Keep lectures concise (5-10 minutes) and engage students with real-world examples.
                Use free preview lectures to attract potential students.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Quality</h3>
              <p className="text-sm text-green-700">
                Ensure good audio/video quality and well-organized content structure.
                Review your course from a student's perspective before publishing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CoursesController;