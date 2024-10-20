import { useState } from "react";
import ManagerLogin from "./ManagerLogin";
import ManagerDashboard from "./ManagerDashboard"; // The dashboard we'll create later
import Navigation from "./Navigation";
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";


const ManagerHomepage = () => {
    const [isManagerLoggedIn, setIsManagerLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsManagerLoggedIn(true);
  };
  return (
    <div>
      
    <Navbar/>
  {!isManagerLoggedIn ? (
    <ManagerLogin onLogin={handleLogin} />
  ) : (
    <ManagerDashboard />
  )}
  </div>
  )
}

export default ManagerHomepage