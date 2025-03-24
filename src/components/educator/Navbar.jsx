import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

const Navbar = ({ bgColor, userData }) => {


  return   (
    <div className={`flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3 ${bgColor}`}>
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 lg:w-32" />
      </Link>
      <div className="flex items-center gap-5 text-gray-500 relative">
        <p>Hi! {userData?.userName} </p>
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;