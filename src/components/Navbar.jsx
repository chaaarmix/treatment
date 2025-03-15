import React from "react";
import { useLocation, Link } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const navItems = [
        { path: "/firstAidKit", icon: "first-aid-kit-icon.png", activeIcon: "first-aid-kit-icon(white).png", alt: "First Aid Kit" },
        { path: "/calendar", icon: "calendar-icon.png", activeIcon: "calendar-icon(white).png", alt: "Calendar" },
        { path: "/notifications", icon: "notification-icon.png", activeIcon: "notification-icon(white).png", alt: "Notifications" },
        { path: "/userAccount", icon: "user-icon.png", activeIcon: "user-icon(white).png", alt: "User Account" },
    ];

    return (
        <div className="navbar-container">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                    <div key={item.path} className={`navbar-container__block ${isActive ? "active" : ""}`}>
                        <Link to={item.path} className="navbar-link">
                            <img src={`/assets/images/${isActive ? item.activeIcon : item.icon}`} alt={item.alt} />
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};

export default Navbar;
