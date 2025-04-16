import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, AlertTriangle, X, Upload, Video, FileText, Plus, Edit, Trash2, Search, RefreshCw } from 'lucide-react';

const CoursesController = () => {
  // State variables
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    instructorId: '',
    instructorName: '',
    title: '',
    category: '',
    level: '',
    primaryLanguage: '',
    subtitle: '',
    description: '',
    imageFile: null,
    imagePreview: '',
    welcomeMessage: '',
    objectives: '',
    isPublised: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [curriculum, setCurriculum] = useState([]);
  const [newLecture, setNewLecture] = useState({
    title: '',
    videoFile: null,
    videoPreview: '',
    freePreview: false,
    pdfFile: null,
    pdfName: ''
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [activeSectionTab, setActiveSectionTab] = useState('basic'); // 'basic', 'curriculum'
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [modalMessage, setModalMessage] = useState('');

  // Show notification function
  const showNotification = (type, message, duration = 5000) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, duration);
  };

  // Fetch all courses
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

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}/categories/allcatgories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showNotification('error', 'Failed to load categories');
    }
  };

  // Fetch course by ID
  const fetchCourseById = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${backendUrl}/instructor/course/get/details/${id}`);
      setSelectedCourse(response.data.data);
      setFormData({
        ...response.data.data,
        imageFile: null,
        imagePreview: response.data.data.image
      });
      setCurriculum(response.data.data.curriculum || []);
      setIsEditing(true);
      showNotification('info', 'Course loaded for editing');
      // Scroll to form
      document.getElementById('course-form').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error fetching course:', error);
      showNotification('error', 'Failed to load course details');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  // Handle lecture input changes
  const handleLectureChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewLecture({
      ...newLecture,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle lecture video file selection
  const handleLectureVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLecture({
        ...newLecture,
        videoFile: file,
        videoPreview: URL.createObjectURL(file)
      });
    }
  };

  // Handle lecture PDF file selection
  const handleLecturePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLecture({
        ...newLecture,
        pdfFile: file,
        pdfName: file.name
      });
    }
  };

  // Upload file to server
  const uploadFile = async (file, type) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // For Cloudinary or similar

    try {
      const response = await axios.post(`${backendUrl}/media/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });
      return response.data.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Add a new lecture to curriculum
  const addLecture = async () => {
    if (!newLecture.title) {
      showNotification('error', 'Lecture title is required');
      return;
    }

    try {
      setIsUploading(true);
      let videoUrl = newLecture.videoPreview;
      let pdfUrl = newLecture.pdfName;

      // Upload video if a new one was selected
      if (newLecture.videoFile) {
        videoUrl = await uploadFile(newLecture.videoFile, 'video');
      }

      // Upload PDF if a new one was selected
      if (newLecture.pdfFile) {
        pdfUrl = await uploadFile(newLecture.pdfFile, 'pdf');
      }

      const lectureToAdd = {
        title: newLecture.title,
        videoUrl,
        freePreview: newLecture.freePreview,
        pdfUrl,
      };

      setCurriculum([...curriculum, lectureToAdd]);
      setNewLecture({
        title: '',
        videoFile: null,
        videoPreview: '',
        freePreview: false,
        pdfFile: null,
        pdfName: ''
      });
      showNotification('success', 'Lecture added successfully');
    } catch (error) {
      console.error('Error adding lecture:', error);
      showNotification('error', 'Failed to add lecture');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Remove a lecture from curriculum
  const removeLecture = (index) => {
    const updatedCurriculum = [...curriculum];
    updatedCurriculum.splice(index, 1);
    setCurriculum(updatedCurriculum);
    showNotification('info', 'Lecture removed');
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.instructorName || !formData.description) {
      showNotification('error', 'Please fill all required fields');
      return;
    }

    try {
      setIsUploading(true);
      let imageUrl = formData.imagePreview;

      // Upload new image if one was selected
      if (formData.imageFile) {
        imageUrl = await uploadFile(formData.imageFile, 'image');
      }

      const courseData = {
        ...formData,
        image: imageUrl,
        curriculum,
        date: new Date()
      };

      // Remove file objects before sending
      delete courseData.imageFile;
      delete courseData.imagePreview;

      if (isEditing) {
        await axios.put(`${backendUrl}/instructor/course/update/${selectedCourse._id}`, courseData);
        showNotification('success', 'Course updated successfully');
      } else {
        await axios.post(`${backendUrl}/instructor/course/add`, courseData);
        showNotification('success', 'New course created successfully');
      }

      resetForm();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      showNotification('error', 'Failed to save course');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Confirm course deletion
  const confirmDeleteCourse = (id, title) => {
    setCourseToDelete(id);
    setModalMessage(`Are you sure you want to delete "${title}"?`);
    setShowConfirmModal(true);
  };

  // Delete course
  const deleteCourse = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${backendUrl}/instructor/course/delet/${id}`);
      fetchCourses();
      if (selectedCourse && selectedCourse._id === id) {
        resetForm();
      }
      showNotification('success', 'Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      showNotification('error', 'Failed to delete course');
    } finally {
      setIsLoading(false);
      setShowConfirmModal(false);
      setCourseToDelete(null);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      instructorId: '',
      instructorName: '',
      title: '',
      category: '',
      level: '',
      primaryLanguage: '',
      subtitle: '',
      description: '',
      imageFile: null,
      imagePreview: '',
      welcomeMessage: '',
      objectives: '',
      isPublised: false,
    });
    setCurriculum([]);
    setSelectedCourse(null);
    setIsEditing(false);
    setActiveSectionTab('basic');
  };

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
    fetchCategories();
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
                  onClick={() => deleteCourse(courseToDelete)}
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
        
        {/* Search and Filter Section */}
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
                            onClick={() => fetchCourseById(course._id)}
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

        {/* Course Form Section */}
        <div id="course-form" className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-green-700 flex items-center">
              {isEditing ? <Edit className="mr-2 h-5 w-5" /> : <Plus className="mr-2 h-5 w-5" />}
              {isEditing ? 'Edit Course' : 'Create New Course'}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isEditing ? 'Update your existing course information' : 'Fill in the details to create a new course'}
            </p>
          </div>
          
          <div className="p-6">
            {isUploading && (
              <div className="mb-6 bg-green-50 p-4 rounded-md">
                <p className="text-sm font-medium text-green-700 mb-2">Uploading files...</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-600 mt-1 text-right">{uploadProgress}%</p>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveSectionTab('basic')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${activeSectionTab === 'basic' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Basic Information
                </button>
                <button
                  onClick={() => setActiveSectionTab('curriculum')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${activeSectionTab === 'curriculum' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Curriculum
                </button>
              </nav>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {activeSectionTab === 'basic' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">   
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Name*</label>
                      <input
                        type="text"
                        name="instructorName"
                        value={formData.instructorName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Course Title*</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category.categoreName}>
                            {category.categoreName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                      <select
                        name="level"
                        value={formData.level}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select a level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Language</label>
                      <input
                        type="text"
                        name="primaryLanguage"
                        value={formData.primaryLanguage}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g. English, Spanish, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                      <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="A brief description of your course"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Course Image*</label>
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {formData.imagePreview ? (
                            <img 
                              src={formData.imagePreview} 
                              alt="Course preview" 
                              className="h-32 w-32 object-cover rounded-md border-2 border-gray-200"
                            />
                          ) : (
                            <div className="h-32 w-32 bg-gray-100 flex items-center justify-center rounded-md border-2 border-dashed border-gray-300">
                              <p className="text-gray-500 text-xs text-center">No image<br/>selected</p>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <label className="cursor-pointer">
                            <span className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm inline-flex items-center">
                              <Upload className="h-4 w-4 mr-2" />
                              {formData.imagePreview ? 'Change Image' : 'Choose Image'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                          {formData.imageFile && (
                            <p className="text-sm text-gray-600 mt-2">
                              Selected: {formData.imageFile.name}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Recommended resolution: 1280x720 pixels (16:9 aspect ratio)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Provide a detailed description of your course"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                    <textarea
                      name="welcomeMessage"
                      value={formData.welcomeMessage}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="A welcome message for your students"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Objectives</label>
                    <textarea
                      name="objectives"
                      value={formData.objectives}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="What will students learn in this course? (One objective per line)"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter each objective on a new line</p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center h-5">
                      <input
                        id="isPublised"
                        type="checkbox"
                        name="isPublised"
                        checked={formData.isPublised}
                        onChange={handleInputChange}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isPublised" className="font-medium text-gray-700">Publish this course</label>
                      <p className="text-gray-500">When published, your course will be visible to students</p>
                    </div>
                  </div>
                </>
              )}

              {activeSectionTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-md mb-6">
                    <h3 className="text-lg font-medium text-green-700 mb-2">Course Curriculum</h3>
                    <p className="text-sm text-green-600">
                      Add lectures, videos, and resources to your course
                    </p>
                  </div>

                  {/* Existing curriculum items */}
                  {curriculum.length > 0 ? (
                    <div className="space-y-4 mb-8">
                      <h4 className="font-medium text-gray-700">Current Lectures ({curriculum.length})</h4>
                      {curriculum.map((lecture, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-4 hover:border-green-300 transition-colors">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                #{index + 1}
                              </span>
                              <h4 className="font-medium">{lecture.title || `Untitled Lecture`}</h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLecture(index)}
                              className="text-red-500 hover:text-red-700 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" /> Remove
                            </button>
                          </div>
                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {lecture.videoUrl && (
                              <div className="flex items-center text-gray-600">
                                <Video className="h-4 w-4 mr-2 text-green-600" />
                                <span className="truncate">
                                  {lecture.videoUrl.split('/').pop()}
                                </span>
                              </div>
                            )}
                            {lecture.pdfUrl && (
                              <div className="flex items-center text-gray-600">
                                <FileText className="h-4 w-4 mr-2 text-green-600" />
                                <span className="truncate">
                                  {lecture.pdfUrl.split('/').pop()}
                                </span>
                              </div>
                            )}
                          </div>
                          {lecture.freePreview && (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md mt-2 border border-green-200">
                              Free Preview Enabled
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                      <p className="text-gray-500">No lectures added yet</p>
                      <p className="text-sm text-gray-400 mt-1">Use the form below to add your first lecture</p>
                    </div>
                  )}

                  {/* Add new lecture form */}
                  <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                    <h4 className="font-medium text-gray-700 mb-4">Add New Lecture</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lecture Title*
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newLecture.title}
                          onChange={handleLectureChange}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter lecture title"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video File
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer">
                              <span className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm inline-flex items-center">
                                <Video className="h-4 w-4 mr-2" />
                                Choose Video
                              </span>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleLectureVideoChange}
                                className="hidden"
                              />
                            </label>
                            {newLecture.videoFile && (
                              <span className="text-sm text-gray-600 ml-2 truncate">
                                {newLecture.videoFile.name}
                              </span>
                            )}
                          </div>
                          {newLecture.videoPreview && !newLecture.videoFile && (
                            <p className="text-sm text-green-600 mt-2">
                              Video already selected
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Supported formats: MP4, WebM (Max: 500MB)
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            PDF Resources
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer">
                              <span className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm inline-flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Choose PDF
                              </span>
                              <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleLecturePdfChange}
                                className="hidden"
                              />
                            </label>
                            {newLecture.pdfFile && (
                              <span className="text-sm text-gray-600 ml-2 truncate">
                                {newLecture.pdfFile.name}
                              </span>
                            )}
                          </div>
                          {newLecture.pdfName && !newLecture.pdfFile && (
                            <p className="text-sm text-green-600 mt-2">
                              PDF already selected: {newLecture.pdfName.split('/').pop()}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Add supplementary materials in PDF format
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <div className="flex items-center h-5">
                          <input
                            id="freePreview"
                            type="checkbox"
                            name="freePreview"
                            checked={newLecture.freePreview}
                            onChange={handleLectureChange}
                            className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="freePreview" className="font-medium text-gray-700">Enable Free Preview</label>
                          <p className="text-gray-500">Allow non-enrolled students to preview this lecture</p>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={addLecture}
                          disabled={isUploading || !newLecture.title}
                          className={`px-5 py-2 rounded-md transition-colors flex items-center ${
                            isUploading || !newLecture.title
                              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                              : 'bg-green-600 hover:bg-green-700 text-white'
                          }`}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {isUploading ? 'Adding...' : 'Add Lecture'}
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                          {!newLecture.title && 'Lecture title is required to add a new lecture'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
    
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel Editing
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    isUploading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                  }`}
                >
                  {isUploading 
                    ? 'Saving...' 
                    : isEditing 
                      ? 'Update Course' 
                      : 'Create Course'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
    
        {/* Quick Help Section */}
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