import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    return (
        <header className="mobile-header">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <img src="/assets/logo-icon.png" alt="Life-OS" className="brand-logo" />
                <span className="brand-text" style={{ color: '#fff', fontWeight: 700 }}>Life-OS</span>
            </Link>
            {/* Menu button hidden for now as sidebar is desktop-only in this design */}
            <button className="menu-btn" style={{ background: 'none', border: 'none', color: '#9AA5B1', fontSize: '1.5rem', display: 'none' }}>
                <i className="fa-solid fa-bars"></i>
            </button>
        </header>
    );
};

export default Header;
