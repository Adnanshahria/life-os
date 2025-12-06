import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="app-container">
            <Header />
            <div className="layout-grid">
                <Sidebar />
                <main className="main-content">
                    {children}
                    <footer style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '0.9rem' }}>
                        <p>Life-OS | জ্ঞান সংশ্লেষণ প্ল্যাটফর্ম</p>
                    </footer>
                </main>
            </div>
            <BottomNav />
        </div>
    );
};

export default Layout;
