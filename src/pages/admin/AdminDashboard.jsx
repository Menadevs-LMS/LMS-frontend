import { NavLink, Outlet , useNavigate} from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminLayout = () => {
  const menuItems = [
    {
      name: 'Dashboard',
      path: "/admin",
      icon: assets.home_icon
    },
    {
      name: 'Users Controller',
      path: '/admin/users-controller',
      icon: assets.user_icon
    },
    {
      name: 'All Courses',
      path: '/admin/courses-controller',
      icon: assets.lesson_icon
    },
    {
      name: 'Add Course',
      path: '/admin/add-course',
      icon: assets.add_icon
    },
    {
      name: 'Student Enrooled',
      path: '/admin/student-enrolled',
      icon: assets.person_tick_icon
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: assets.add_icon
    }


  ];
  const navigate = useNavigate()

  const handleLogOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');

    window.dispatchEvent(new Event('localStorageChange'));
    navigate('/login');
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <div className='md:w-80 w-20 bg-white shadow-lg border-r border-gray-200 min-h-screen flex flex-col transition-all'>
        <div className='px-4 py-6 border-b border-gray-200'>
          <h1 className='text-2xl font-bold text-green-700 md:block hidden'>Admin Panel</h1>
          <h1 className='text-xl font-bold text-green-700 md:hidden block text-center'>Admin</h1>
        </div>
        <div className='flex flex-col gap-1 mt-4'>
          {menuItems.map((item) => (
            <NavLink
              to={item.path}
              key={item.name}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center md:flex-row flex-col md:justify-start justify-center py-4 md:px-6 gap-3 rounded-md mx-2 transition-all duration-200 ${isActive
                  ? 'bg-green-50 text-green-700 font-medium border-l-4 border-green-600'
                  : 'hover:bg-gray-100 text-gray-700 border-l-4 border-transparent'
                }`
              }
            >
              <img src={item.icon} alt="" className="w-6 h-6" />
              <p className='md:block hidden'>{item.name}</p>
            </NavLink>
          ))}
       
            <button
              onClick={() => handleLogOut()}
              className="flex items-center md:flex-row flex-col md:justify-start justify-center py-4 md:px-6 gap-3 rounded-md mx-2 transition-all duration-200 text-red-600 hover:bg-red-50 ml-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
        </div>
      </div>

      <div className='flex-1 overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;