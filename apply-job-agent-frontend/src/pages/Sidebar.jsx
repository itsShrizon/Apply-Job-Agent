import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { useModal } from '../Contexts/ModalContext';
import Login from './AuthComponents/Login';
import Register from './AuthComponents/Rergister';
import logo from '../assets/orange_logo.png';

const Sidebar = () => {
    const { pathname } = useLocation();
    const { openModal } = useModal();
    const { logout, currentUser } = useAuth();
    const [isExpanded, setIsExpanded] = useState(true);
    const [, setActiveItem] = useState('/');
    const [, setHoverIndex] = useState(null);

    // Set active item based on current pathname
    useEffect(() => {
        setActiveItem(pathname);
    }, [pathname]);

    // Navigation items - common for all users
    const commonNavItems = [
        { 
            name: 'Home', 
            path: '/', 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
            )
        }
    ];

    // Navigation items for authenticated users only
    const authNavItems = [
        { 
            name: 'Profile', 
            path: '/profile', 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
            ) 
        },
        { 
            name: 'My Resumes', 
            path: '/my-resumes', 
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
            )
        },
        // { 
        //     name: 'Saved Jobs', 
        //     path: '/saved-jobs', 
        //     icon: (
        //         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        //             <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        //         </svg>
        //     )
        // }
    ];

    // Get appropriate nav items based on authentication status
    const navItems = [...commonNavItems, ...(currentUser ? authNavItems : [])];

    // Toggle sidebar expansion
    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!currentUser) return 'G';
        if (currentUser.first_name) return currentUser.first_name[0].toUpperCase();
        if (currentUser.email) return currentUser.email[0].toUpperCase();
        return 'U';
    };

    // Get username display
    const getUserDisplayName = () => {
        if (!currentUser) return 'Guest';
        if (currentUser.first_name) return `${currentUser.first_name}`;
        return currentUser.email.split('@')[0];
    };

    // Sidebar decoration - subtle gradient for background visual interest
    const SidebarDecoration = () => (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#F46036]/5 to-transparent rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#F46036]/5 to-transparent rounded-full blur-xl"></div>
        </div>
    );

    return (
        <aside 
            className={`bg-white h-full flex flex-col border-r border-[#F46036]/10 shadow-lg transition-all duration-500 ease-in-out relative ${
                isExpanded ? 'w-72' : 'w-20'
            }`}
        >
            <SidebarDecoration />
            
            {/* Sidebar header with enhanced logo area */}
            <div className="py-6 px-4 flex items-center border-b border-[#F46036]/10 relative z-10">
                <div className="flex items-center flex-1 overflow-hidden">
                    <div className={`transition-all duration-300 ${isExpanded ? 'h-14 w-14' : 'h-12 w-12'} rounded-xl bg-gradient-to-br from-[#F46036] to-[#FF6B6B] flex items-center justify-center shadow-md `}>
                        <img src={logo} alt="Logo" className="h-18 w-18 flex-shrink-0 transform transition-transform hover:scale-110 duration-300 " />
                    </div>
                    {isExpanded && (
                        <div className="ml-3 transition-opacity duration-300">
                            <h1 className="font-bold text-lg text-[#3E3E3E] whitespace-nowrap">
                                GiveJob<span className="text-[#F46036]">.ai</span>
                            </h1>
                            <p className="text-xs text-[#3E3E3E]/70">AI Resume Assistant</p>
                        </div>
                    )}
                </div>
                <button 
                    onClick={toggleSidebar} 
                    className="p-1.5 rounded-lg text-[#3E3E3E] hover:bg-[#F7F3E9] hover:text-[#F46036] transition-all duration-300 hover:shadow-md"
                    aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                >
                    {isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    )}
                </button>
            </div>

            {/* Navigation links with enhanced visuals */}
            <nav className="flex-1 py-6 px-3 overflow-y-auto relative z-10">
                {isExpanded && (
                    <div className="text-xs uppercase tracking-wider text-[#3E3E3E]/70 px-3 mb-4 font-semibold">
                        Navigation
                    </div>
                )}
                <ul className="space-y-2">
                    {navItems.map((item, index) => (
                        <li key={item.name}>
                            <Link
                                to={item.path}
                                className={`flex items-center p-3 rounded-xl transition-all duration-300 relative group
                                    ${pathname === item.path 
                                        ? 'bg-gradient-to-r from-[#F7F3E9] to-[#F7F3E9]/70 text-[#F46036] font-medium shadow-sm' 
                                        : 'text-[#3E3E3E] hover:bg-[#F7F3E9]/50 hover:text-[#F46036]'
                                    }
                                `}
                                onMouseEnter={() => setHoverIndex(index)}
                                onMouseLeave={() => setHoverIndex(null)}
                            >
                                <div className={`flex-shrink-0 transition-transform duration-300 ${pathname === item.path ? 'scale-110' : 'group-hover:scale-110'}`}>
                                    {item.icon}
                                </div>
                                
                                {/* Active indicator */}
                                {pathname === item.path && (
                                    <div className="absolute left-0 top-1/2 w-1 h-1/2 bg-[#F46036] rounded-r-full transform -translate-y-1/2"></div>
                                )}
                                
                                {isExpanded && (
                                    <span className="ml-3 font-medium transition-all duration-300 whitespace-nowrap">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
                
                {/* Divider with enhanced styling */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#F46036]/20 to-transparent my-6"></div>
                
                {/* Settings section */}
                {isExpanded && (
                    <div className="text-xs uppercase tracking-wider text-[#3E3E3E]/70 px-3 mb-4 font-semibold">
                        Settings
                    </div>
                )}
                <ul className="space-y-2">
                    <li>
                        <Link
                            to="/settings"
                            className={`flex items-center p-3 rounded-xl transition-all duration-300 relative group
                                ${pathname === '/settings' 
                                    ? 'bg-gradient-to-r from-[#F7F3E9] to-[#F7F3E9]/70 text-[#F46036] font-medium shadow-sm' 
                                    : 'text-[#3E3E3E] hover:bg-[#F7F3E9]/50 hover:text-[#F46036]'
                                }
                            `}
                        >
                            <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                </svg>
                            </div>
                            
                            {/* Active indicator */}
                            {pathname === '/settings' && (
                                <div className="absolute left-0 top-1/2 w-1 h-1/2 bg-[#F46036] rounded-r-full transform -translate-y-1/2"></div>
                            )}
                            
                            {isExpanded && (
                                <span className="ml-3 font-medium transition-all duration-300">
                                    Settings
                                </span>
                            )}
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/help"
                            className={`flex items-center p-3 rounded-xl transition-all duration-300 relative group
                                ${pathname === '/help' 
                                    ? 'bg-gradient-to-r from-[#F7F3E9] to-[#F7F3E9]/70 text-[#F46036] font-medium shadow-sm' 
                                    : 'text-[#3E3E3E] hover:bg-[#F7F3E9]/50 hover:text-[#F46036]'
                                }
                            `}
                        >
                            <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            
                            {/* Active indicator */}
                            {pathname === '/help' && (
                                <div className="absolute left-0 top-1/2 w-1 h-1/2 bg-[#F46036] rounded-r-full transform -translate-y-1/2"></div>
                            )}
                            
                            {isExpanded && (
                                <span className="ml-3 font-medium transition-all duration-300">
                                    Help & Support
                                </span>
                            )}
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Premium banner - visible only when expanded and user is logged in */}
            {isExpanded && currentUser && (
                <div className="px-4 mb-4">
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#F46036] to-[#FF6B6B] p-4 text-white shadow-lg">
                        {/* Decorative circles */}
                        <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-white opacity-10"></div>
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white opacity-10"></div>
                        
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Upgrade to Premium</h3>
                                <p className="text-xs opacity-90 mt-1">Unlock all features and get unlimited job matches</p>
                                <button className="mt-3 py-1.5 px-3 bg-white text-[#F46036] rounded-lg text-xs font-medium hover:bg-opacity-90 transition-all duration-200 shadow-md">
                                    Upgrade Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* User section with enhanced styling */}
            <div className="mt-auto p-4 border-t border-[#F46036]/10 relative z-[999999]">
                {currentUser ? (
                    <div className={`flex items-center ${isExpanded ? 'justify-between' : 'justify-center'}`}>
                        <div className="flex items-center overflow-hidden">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F46036] to-[#FF6B6B] text-white flex items-center justify-center font-semibold flex-shrink-0 shadow-md">
                                    {getUserInitials()}
                                </div>
                                {/* Online status indicator */}
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                            </div>
                            {isExpanded && (
                                <div className="ml-3 truncate transition-opacity duration-300">
                                    <div className="font-medium text-sm text-[#3E3E3E] truncate">
                                        {getUserDisplayName()}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button 
                                            onClick={logout}
                                            className="text-xs text-[#F46036] hover:text-[#FF6B6B] transition-colors duration-200 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm6.293 11.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 00-1.414 1.414L11.586 10l-2.293 2.293z" clipRule="evenodd" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        {!isExpanded && (
                            <button 
                                onClick={logout}
                                className="p-1.5 rounded-lg text-[#F46036] hover:bg-[#F7F3E9] transition-colors duration-300 hover:shadow-sm"
                                title="Sign Out"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm6.293 11.293a1 1 0 001.414 1.414l4-4a1 1 0 000-1.414l-4-4a1 1 0 00-1.414 1.414L11.586 10l-2.293 2.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className={`${isExpanded ? '' : 'flex justify-center'}`}>
                        {isExpanded ? (
                            <div className="space-y-2">
                                <button 
                                    onClick={() => openModal(<Login />)}
                                    className="w-full py-2.5 px-4 bg-gradient-to-r from-[#F46036] to-[#FF6B6B] hover:from-[#FF6B6B] hover:to-[#F46036] text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-md flex items-center justify-center group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                    </svg>
                                    Sign In
                                </button>
                                <button 
                                    onClick={() => openModal(<Register />)}
                                    className="w-full py-2.5 px-4 bg-white border border-[#F46036] text-[#F46036] hover:bg-[#F7F3E9] rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                    </svg>
                                    Register
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => openModal(<Login />)}
                                className="p-2.5 bg-gradient-to-r from-[#F46036] to-[#FF6B6B] text-white rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                                title="Sign In"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;