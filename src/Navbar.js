import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file for styling

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="https://a.storyblok.com/f/140760/x/f4c6cf86d5/logo.svg " alt="Huddle House Logo" />
        </Link>
      </div>
      <nav className="navbar-menu">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/server">Server Dashboard</Link></li>
          <li><Link to="/cooks">Cooks Dashboard</Link></li>
          <li><Link to="/Manager-Homepage">Manager Dashboard</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
