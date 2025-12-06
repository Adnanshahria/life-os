import React from 'react';
import { NavLink } from 'react-router-dom';

const BottomNav: React.FC = () => {
    return (
        <nav className="bottom-nav">
            <div className="bottom-nav-items">
                <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`} end>
                    <i className="fa-solid fa-house"></i>
                    <span>হোম</span>
                </NavLink>
                {/* Books link points to home#books section by default, or could be a dedicated /books page */}
                <a href="/#books" className="bottom-nav-item">
                    <i className="fa-solid fa-book"></i>
                    <span>বইসমূহ</span>
                </a>
                <NavLink to="/guides/unified-study-guide.html" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <i className="fa-solid fa-graduation-cap"></i>
                    <span>গাইড</span>
                </NavLink>
                <NavLink to="/protocols/life-protocol.html" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
                    <i className="fa-solid fa-compass"></i>
                    <span>প্রোটোকল</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNav;
