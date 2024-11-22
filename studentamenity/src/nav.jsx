import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className='navi'>
    <div className="navbar">
      <div className="navbar-logo">
        <h1>Amenity Center</h1>
      </div>
      <ul className="navbar-links">
        <li><Link to="/signup"><a>Signup</a></Link></li>

      </ul>
    </div>
    </div>
  );
};

export default Navbar;
