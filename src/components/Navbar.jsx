import React from "react";
import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();

    return (
        <div className="navbar-container">
            <div className={`navbar-container__block ${location.pathname === "/firstAidKit" ? "active" : ""}`}>
                <Link to="/firstAidKit" className="navbar-link">
                    <img src="/assets/images/first-aid-kit-icon.png" alt="first-aid-kit"/>
                </Link>
            </div>
            <div className={`navbar-container__block ${location.pathname === "/calendar" ? "active" : ""}`}>
                <Link to="/calendar" className="navbar-link">
                    <img src="/assets/images/calendar-icon.png" alt="calendar"/>
                </Link>
            </div>
            <div className={`navbar-container__block ${location.pathname === "/notifications" ? "active" : ""}`}>
                <Link to="/notifications" className="navbar-link">
                    <img src="/assets/images/notification-icon.png" alt="notification"/>
                </Link>
            </div>
            <div className={`navbar-container__block ${location.pathname === "/userAccount" ? "active" : ""}`}>
                <Link to="/userAccount" className="navbar-link">
                    <img src="/assets/images/user-icon.png" alt="user"/>
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
