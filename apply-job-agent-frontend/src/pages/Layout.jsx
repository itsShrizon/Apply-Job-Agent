import React from 'react';
import { Outlet } from 'react-router-dom';
import Modal from './Modal.jsx';
import Sidebar from './Sidebar.jsx';
import MobileHeader from './MobileHeader.jsx';
import { useMediaQuery } from '../hooks/useMediaQuery';

const Layout = () => {
    const isMobile = useMediaQuery('(max-width: 1023px)');

    return (
        <div className="flex h-screen bg-[#F7F3E9] overflow-hidden">
            {/* Sidebar navigation for desktop */}
            {!isMobile && <Sidebar />}
            
            {/* Mobile header shown only on smaller screens */}
            {isMobile && <MobileHeader />}
            
            {/* Main content area with decorative elements */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto relative">
                {/* Decorative background shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#F46036] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 z-0"></div>
                <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#FF6B6B] opacity-5 rounded-full blur-3xl z-0"></div>
                
                {/* Content container */}
                <div className="relative z-10 px-4 sm:px-6 py-6 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
            
            {/* Modal remains at root level */}
            <Modal />
        </div>
    );
};

export default Layout;