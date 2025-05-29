import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();
  
  const handleLogOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    
    window.dispatchEvent(new Event('localStorageChange'));
    navigate('/login');
  }
  
  return handleLogOut;
}