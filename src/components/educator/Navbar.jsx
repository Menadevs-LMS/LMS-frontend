import { useState, useRef, useEffect } from 'react';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';


const Navbar = ({ userData, bgColor }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate()
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogOut = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('user');
  
  window.dispatchEvent(new Event('localStorageChange'));
    navigate('/login');
  }



  return (
    <div className={`flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3 ${bgColor}`}>
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative" ref={menuRef}>
        <div className="cursor-pointer" onClick={toggleMenu}>
          <p className="flex items-center gap-2">
            Hi! {userData?.userName}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </p>
        </div>

        {showMenu && (
          <div className="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-2 px-4 border-b border-gray-200 bg-gray-50">
              <p className="text-sm font-medium text-gray-700">Role: {userData?.role || 'Student'}</p>
            </div>
            <div className="py-1">
              <button
                onClick={() => handleLogOut()}
                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}

        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;