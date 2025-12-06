import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <aside className="sidebar">
            <div className="brand">
                <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <img src="/assets/logo-icon.png" alt="Life-OS" className="brand-logo" style={{ height: '32px' }} />
                    <span className="brand-text" style={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem' }}>Life-OS</span>
                </NavLink>
            </div>

            <nav style={{ marginTop: '2rem' }}>
                <div className="nav-section" style={{ marginBottom: '1.5rem' }}>
                    <div className="nav-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>মূল</div>
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <i className="fa-solid fa-layer-group" style={{ width: '20px', textAlign: 'center' }}></i> সিনথেসিস
                    </NavLink>
                </div>

                <div className="nav-section" style={{ marginBottom: '1.5rem' }}>
                    <div className="nav-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>বইসমূহ</div>
                    <NavLink to="/books/atomic-habits.html" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <i className="fa-solid fa-atom" style={{ width: '20px', textAlign: 'center' }}></i> Atomic Habits
                    </NavLink>
                    <NavLink to="/books/deep-work.html" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <i className="fa-solid fa-brain" style={{ width: '20px', textAlign: 'center' }}></i> Deep Work
                    </NavLink>
                    <NavLink to="/books/daily-stoic.html" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <i className="fa-solid fa-monument" style={{ width: '20px', textAlign: 'center' }}></i> The Daily Stoic
                    </NavLink>
                    <NavLink to="/books/dopamine-detox.html" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <i className="fa-solid fa-bolt" style={{ width: '20px', textAlign: 'center' }}></i> Dopamine Detox
                    </NavLink>
                </div>

                <div className="nav-section" style={{ marginBottom: '1.5rem' }}>
                    <div className="nav-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>গাইড</div>
                    <NavLink to="/guides/unified-study-guide.html" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <i className="fa-solid fa-book-journal-whills" style={{ width: '20px', textAlign: 'center' }}></i> মাস্টার গাইড
                    </NavLink>
                </div>

                <div className="nav-section">
                    <div className="nav-label" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>প্রোটোকল</div>
                    <NavLink to="/protocols/life-protocol.html" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <i className="fa-solid fa-compass" style={{ width: '20px', textAlign: 'center' }}></i> লাইফ প্রোটোকল
                    </NavLink>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
