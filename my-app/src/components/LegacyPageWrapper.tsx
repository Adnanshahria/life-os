import React, { useEffect } from 'react';

interface LegacyPageWrapperProps {
    children: React.ReactNode;
}

const LegacyPageWrapper: React.FC<LegacyPageWrapperProps> = ({ children }) => {
    useEffect(() => {
        // Load legacy CSS dynamically if not already present
        // Note: The main migration script might have already replaced paths to point to _archive_assets
        // but we might want to enforce certain global legacy styles here if needed.

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/_archive_assets/css/main.css';
        document.head.appendChild(link);

        const linkMobile = document.createElement('link');
        linkMobile.rel = 'stylesheet';
        linkMobile.href = '/_archive_assets/css/mobile.css';
        document.head.appendChild(linkMobile);

        return () => {
            // Cleanup might cause flicker if navigating between legacy pages, 
            // but is good practice if mixing with new React pages.
            document.head.removeChild(link);
            document.head.removeChild(linkMobile);
        }
    }, []);

    return (
        <div className="legacy-page-root">
            {children}
        </div>
    );
};

export default LegacyPageWrapper;
