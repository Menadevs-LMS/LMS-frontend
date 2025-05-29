import { assets } from '../../assets/assets';
import { Link, } from 'react-router-dom';
import Menu from '../Menu/Menu';
import { useState } from 'react';
import { useLogout } from '../../helper/helper';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false);
  const logout = useLogout();
  const name = JSON.parse(localStorage.getItem("user"));
  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 'bg-cyan-100/70'}`}>
      <img src={assets.logo} alt="Logo" className="w-28 lg:w-32 cursor-pointer" onClick={() => navigate("/")} />
      <div className="md:flex hidden items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          <Link to='/my-enrollments' >My Enrollments</Link>
        </div>
        <button onClick={() => setShowMenu(!showMenu)}>
          <img src={assets.user_icon} alt="" />
        </button>
        {showMenu && <Menu logout={logout} role={`Name : ${name.userName}`} />}


      </div>
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">

          <Link to='/my-enrollments' >My Enrollments</Link>

        </div>

        <button onClick={() => setShowMenu(!showMenu)}>
          <img src={assets.user_icon} alt="" />
        </button>
        {showMenu && <Menu logout={logout} role={`Name : ${name.userName}`} />}

      </div>
    </div>
  );
};

export default Navbar;