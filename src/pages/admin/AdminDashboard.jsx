import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminLayout = () => {
  const menuItems = [
    {
      name: 'Users Controller',
      path: '/admin/add-user',
      icon: assets.user_icon
    },
    {
      name: 'Courses Controller',
      path: '/admin/courses-controller',
      icon: assets.lesson_icon
    }
  ];

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Sidebar */}
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
              className={({ isActive }) =>
                `flex items-center md:flex-row flex-col md:justify-start justify-center py-4 md:px-6 gap-3 rounded-md mx-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-green-50 text-green-700 font-medium border-l-4 border-green-600'
                    : 'hover:bg-gray-100 text-gray-700 border-l-4 border-transparent'
                }`
              }
            >
              <img src={item.icon} alt="" className="w-6 h-6" />
              <p className='md:block hidden'>{item.name}</p>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 overflow-auto'>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;