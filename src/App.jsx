import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/student/Navbar';
import Home from './pages/student/Home';
import CourseDetails from './pages/student/CourseDetails';
import CoursesList from './pages/student/CoursesList';
import Dashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import MyCourses from './pages/educator/MyCourses';
import StudentsEnrolled from './pages/educator/StudentsEnrolled';
import Educator from './pages/educator/Educator';
import 'quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import Player from './pages/student/Player';
import MyEnrollments from './pages/student/MyEnrollments';
import Loading from './components/student/Loading';
import Footer from './components/student/Footer';
import AdminDashboard from './pages/admin/AdminDashboard'
import UsersController from './pages/admin/UsersController'
import CoursesController from './pages/admin/CoursesController';
import AuthForm from './pages/AuthForm/AuthForm';
import Catgories from './pages/educator/Categories';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="text-default min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={!token ? <AuthForm setToken={setToken} /> : <Navigate to="/" />} />
        <Route path="/signup" element={<AuthForm />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="users-controller" element={<UsersController />} />
          <Route path="courses-controller" element={<CoursesController />} />
        </Route>
        
        {/* <Route path="/courses-controller" element={<CoursesController />} /> */}
        <Route path="/coursedetails" element={<CourseDetails />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path='/educator' element={<Educator />}>
          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentsEnrolled />} />
          <Route path='categories' element={<Catgories />} />

        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
