import { NavLink, useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const SideBar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/educator', icon: assets.home_icon },
    { name: 'Add Course', path: '/educator/add-course', icon: assets.add_icon },
    { name: 'My Courses', path: '/educator/my-courses', icon: assets.my_course_icon },
    { name: 'Student Enrolled', path: '/educator/student-enrolled', icon: assets.person_tick_icon },
    { name: "Categories", path:'/educator/categories', icon:assets.add_icon }
  ];

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className='md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col'>
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.name}
          end={item.path === '/educator'} 
          className={({ isActive }) =>
            `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${isActive
              ? 'bg-indigo-50 border-r-[6px] border-indigo-500/90'
              : 'hover:bg-gray-100/90 border-r-[6px] border-white hover:border-gray-100/90'
            }`
          }
        >
          <img src={item.icon} alt="" className="w-6 h-6" />
          <p className='md:block hidden text-center'>{item.name}</p>
        </NavLink>
      ))}
      
      <div className="flex-grow"></div>
      
      <button
        onClick={handleLogout}
        className="flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 mt-auto hover:bg-red-50 border-r-[6px] border-white hover:border-red-200 text-red-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <p className='md:block hidden text-center'>Logout</p>
      </button>
    </div>
  );
};

export default SideBar;