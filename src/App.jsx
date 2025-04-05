import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import Navbar from './components/student/Navbar';
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
import SignUp from './pages/signup/SignUp';
import AuthForm from './pages/AuthForm/AuthForm';
import Catgories from './pages/educator/Categories';
import EditCourse from './pages/educator/EditCourse';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [userRole, setUserRole] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("accessToken"));

      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUserData(parsedUser)
          setUserRole(parsedUser.role || '');
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUserRole('');
        }
      } else {
        setUserRole('');
      }
    };

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserData(parsedUser)
        setUserRole(parsedUser.role || '');
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token]);

  const getRedirectPath = () => {
    if (!token) return "/login";
    if (userRole === "instructor") {
      return "/educator";
    } else {
      return "/";
    }
  };

  return (
    <div className="text-default min-h-screen bg-white">
      <Routes>
        <Route path="/" element={token ? (userRole === "instructor" ? <Navigate to="/educator" /> : <Home />) : <Navigate to="/login" />} />

        <Route path="/login" element={!token ? <AuthForm setToken={setToken} setUserRole={setUserRole} /> : <Navigate to={getRedirectPath()} />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Student routes */}
        <Route path="/coursedetails" element={token ? <CourseDetails /> : <Navigate to="/login" />} />
        <Route path="/course-list" element={token ? <CoursesList /> : <Navigate to="/login" />} />
        <Route path="/course-list/:input" element={token ? <CoursesList /> : <Navigate to="/login" />} />
        <Route path="/my-enrollments" element={token ? <MyEnrollments /> : <Navigate to="/login" />} />
        <Route path="/player/:courseId" element={token ? <Player /> : <Navigate to="/login" />} />
        <Route path="/loading/:path" element={<Loading />} />

        <Route path='/educator' element={token && userRole === "instructor" ? <Educator userData={userData}/> : <Navigate to={token ? "/" : "/login"} />}>
          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='edit-course/:id' element={<EditCourse />} />
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