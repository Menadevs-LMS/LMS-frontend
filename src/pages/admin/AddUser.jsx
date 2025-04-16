import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddUser = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    password: '',
    role: 'student', // Default role
  });
  
  // State for tracking if we're editing a user
  const [editingUserId, setEditingUserId] = useState(null);
  
  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success'); // success, error, warning
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Function to fetch all users
  const fetchUsers = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${backendUrl}/auth/allusers`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError('Failed to load users');
        showNotification('Failed to load users', 'error');
      }
    } catch (err) {
      setError('Error connecting to server');
      showNotification('Error connecting to server', 'error');
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission for adding or updating user
  const handleSubmit = async (e) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('accessToken');
      let response;
      
      if (editingUserId) {
        // Update existing user
        const { password, ...updateData } = formData;
        // Only include password if it was changed
        if (password) {
          updateData.password = password;
        }
        
        response = await axios.post(`${backendUrl}/auth/updateuser/${editingUserId}`, updateData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Add new user
        response = await axios.post(`${backendUrl}/auth/register`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      if (response.data.success) {
        showNotification(editingUserId 
          ? 'User updated successfully!' 
          : 'User added successfully!', 'success');
        
        // Reset form
        setFormData({
          userName: '',
          userEmail: '',
          password: '',
          role: 'student',
        });
        setEditingUserId(null);
        
        // Refresh user list
        fetchUsers();
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'An error occurred', 'error');
      console.error('Error saving user:', err);
    }
  };
  
  // Handle edit user button click
  const handleEdit = (user) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setFormData({
      userName: user.userName,
      userEmail: user.userEmail,
      password: '', // Don't populate password for security
      role: user.role,
    });
    setEditingUserId(user._id);
    showNotification('Editing user ' + user.userName, 'info');
  };
  
  // Handle delete confirmation
  const confirmDelete = (userId, userName) => {
    setUserToDelete(userId);
    setModalMessage(`Are you sure you want to delete user "${userName}"?`);
    setShowConfirmModal(true);
  };
  
  // Handle delete user
  const handleDelete = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    setShowConfirmModal(false);
    
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.delete(`${backendUrl}/auth/delete-user/${userToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        showNotification('User deleted successfully!', 'success');
        fetchUsers();
      }
    } catch (err) {
      showNotification('Failed to delete user', 'error');
      console.error('Error deleting user:', err);
    }
  };
  
  // Reset form
  const handleCancel = () => {
    setFormData({
      userName: '',
      userEmail: '',
      password: '',
      role: 'student',
    });
    setEditingUserId(null);
    showNotification('Edit cancelled', 'info');
  };
  
  // Show notification modal
  const showNotification = (message, type) => {
    setModalMessage(message);
    setModalType(type);
    setShowModal(true);
    
    // Auto hide the notification after 3 seconds
    setTimeout(() => {
      setShowModal(false);
    }, 3000);
  };
  
  // Role badge color classes
  const getRoleBadgeClasses = (role) => {
    switch(role) {
      case 'student':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'teacher':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'admin':
        return 'bg-pink-100 text-pink-800 border border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  // Get modal styles based on type
  const getModalStyles = () => {
    switch(modalType) {
      case 'success':
        return 'bg-green-50 border-green-500 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-500 text-red-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-500 text-yellow-700';
      case 'info':
        return 'bg-blue-50 border-blue-500 text-blue-700';
      default:
        return 'bg-white border-gray-300 text-gray-700';
    }
  };
  
  return (
    <div className="admin-dashboard-container min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-600 text-white py-6 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="mt-2 text-green-100">Add and manage system users</p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="lg:flex lg:gap-8 space-y-6 lg:space-y-0">
          {/* Form Section */}
          <div className="form-section bg-white rounded-xl p-6 shadow-md lg:w-1/3">
            <h2 className="text-xl font-semibold text-green-700 mb-6 pb-2 border-b border-gray-200">
              {editingUserId ? '✏️ Edit User' : '➕ Add New User'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="form-group">
                  <label htmlFor="userName" className="block mb-2 font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    id="userName"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Enter username"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="userEmail" className="block mb-2 font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="userEmail"
                    name="userEmail"
                    value={formData.userEmail}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Enter email"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                    Password {editingUserId && <span className="text-gray-500 text-sm">(leave blank to keep unchanged)</span>}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingUserId}
                    className="w-full p-3 border border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="Enter password"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="role" className="block mb-2 font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all appearance-none bg-white"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              
              <div className="form-buttons flex gap-4 mt-8">
                <button 
                  type="submit" 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg cursor-pointer font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {editingUserId ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                      </svg>
                      Update User
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add User
                    </>
                  )}
                </button>
                {editingUserId && (
                  <button 
                    type="button" 
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-6 rounded-lg cursor-pointer font-medium transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    onClick={handleCancel}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          {/* Users Table Section */}
          <div className="users-section bg-white rounded-xl shadow-md lg:w-2/3 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-green-700">👥 Users List</h2>
              <button 
                onClick={fetchUsers}
                className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 py-2 px-4 rounded-lg cursor-pointer text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                  <p className="text-lg font-medium text-red-700">{error}</p>
                </div>
                <button 
                  onClick={fetchUsers}
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2 mx-auto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="p-4 font-semibold text-green-700 border-b border-gray-200">Username</th>
                      <th className="p-4 font-semibold text-green-700 border-b border-gray-200">Email</th>
                      <th className="p-4 font-semibold text-green-700 border-b border-gray-200">Role</th>
                      <th className="p-4 font-semibold text-green-700 border-b border-gray-200 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors even:bg-gray-50">
                          <td className="p-4 border-b border-gray-200 font-medium text-gray-800">{user.userName}</td>
                          <td className="p-4 border-b border-gray-200 text-gray-600">{user.userEmail}</td>
                          <td className="p-4 border-b border-gray-200">
                            <span className={`inline-block py-1 px-3 rounded-full text-xs font-semibold capitalize ${getRoleBadgeClasses(user.role)}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 border-b border-gray-200 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                className="bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 hover:border-green-300 py-1 px-3 rounded-lg cursor-pointer text-xs font-medium transition-all flex items-center gap-1"
                                onClick={() => handleEdit(user)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                Edit
                              </button>
                              <button 
                                className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 py-1 px-3 rounded-lg cursor-pointer text-xs font-medium transition-all flex items-center gap-1"
                                onClick={() => confirmDelete(user._id, user.userName)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-12">
                          <div className="flex flex-col items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <p className="text-lg font-medium text-gray-600">No users found</p>
                            <p className="text-sm text-gray-500 mt-2">Add a new user to get started</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Notification Toast */}
      {showModal && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className={`rounded-lg shadow-xl px-6 py-4 border-l-4 ${getModalStyles()} flex items-start gap-3 max-w-sm`}>
            {modalType === 'success' && (
              <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {modalType === 'error' && (
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {modalType === 'info' && (
              <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <div>
              <p className="font-medium">{modalMessage}</p>
            </div>
          </div>
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
              <p className="text-sm text-gray-500 mt-2">This action cannot be undone and will permanently remove the user.</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button 
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 py-2 px-5 rounded-lg cursor-pointer font-medium transition-colors shadow-sm"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white border border-red-700 py-2 px-5 rounded-lg cursor-pointer font-medium transition-colors shadow-sm flex items-center gap-2"
                onClick={handleDelete}
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
    </div>
  );
};

export default AddUser;