import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../store/ServiceOrderProvider";
import { useNavigate } from "react-router-dom";

const Header = ({ currentPage, setPage, setSuccessfulLogin }) => {
  const { dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));
  const username = user?.name || "Guest";
  const profilePic = user?.image || "https://via.placeholder.com/64";

   const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  
    const handleProfileClick = () => {
      setIsDropdownOpen(false);
      navigate("/profile");
    };
  
    const handleSignOut = () => {
      setIsDropdownOpen(false); 
      sessionStorage.clear();
      setSuccessfulLogin(false);
      navigate("/login");
    };
  
    const toggleDropdown = () => {
      setIsDropdownOpen((prev) => !prev);
    };

  useEffect(() => {
          const path = location.pathname.substring(1);
          setPage(path.charAt(0).toUpperCase() + path.slice(1));
      }, [location, setPage]);

  const handleNavigation = (page) => {
    setPage(page);
    navigate(`/${page.toLowerCase()}`);
};

  return (
    <header className="mb-5 border-bottom nav-bar">
      <div className="head-container">
          <div className="header-cont">
            <h1 className="text-white husername">{username}</h1>
            <div>
              <ul className="nav nav-pills flex-row h6 mt-3">
                          <li className="nav-item nav-hover mb-3">
                              <a
                                  onClick={() => handleNavigation("Dashboard")}
                                  className={`nav-link text-white ${currentPage === 'Dashboard' ? 'active' : ''}`}
                              >
                                  Dashboard
                              </a>
                          </li>
                          <li className="nav-item nav-hover mb-3">
                              <a
                                  onClick={() => handleNavigation("Services")}
                                  className={`nav-link text-white ${currentPage === 'Services' ? 'active' : ''}`}
                              >
                                  Services
                              </a>
                          </li>
                          <li className="nav-item nav-hover mb-3">
                              <a
                                  onClick={() => handleNavigation("Bookings")}
                                  className={`nav-link text-white ${currentPage === 'Bookings' ? 'active' : ''}`}
                              >
                                  Bookings
                              </a>
                          </li>
                          <li className="nav-item nav-hover mb-3">
                              <a
                                  onClick={() => handleNavigation("AddPage")}
                                  className={`nav-link text-white ${currentPage === 'Addpage' ? 'active' : ''}`}
                              >
                                  Add Service
                              </a>
                          </li>
                </ul>
            </div>
            <div className="header-profile">
              <div
                className="header-avatar-container"
                data-bs-toggle="dropdown"
                aria-expanded={isDropdownOpen}
                onClick={toggleDropdown} 
                >
                <img
                  src={profilePic}
                  alt={username}
                  className="header-avatar"
                />
              </div>
              <ul
                className={`header-dropdown-menu ${isDropdownOpen ? "show" : ""}`}
                >
                <li>
                  <button className="header-dropdown-item" onClick={handleProfileClick}>
                    Profile
                  </button>
                </li>
                <li>
                  <hr className="header-dropdown-divider" />
                </li>
                <li>
                  <button className="header-dropdown-item" onClick={handleSignOut}>
                    Sign out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </header>
  );
};

export default Header;
