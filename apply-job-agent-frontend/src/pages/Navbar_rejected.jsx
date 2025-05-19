import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useModal } from "../Contexts/ModalContext";
import Login from "./AuthComponents/Login";
import Register from "./AuthComponents/Rergister"; 
import logo from "../assets/orange_logo.png";
import { useAuth } from "../Contexts/AuthContext";

const Navbar = () => {
    const { openModal } = useModal(); 
    const { logout, currentUser } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [hoveredButton, setHoveredButton] = useState(null);
    const [navbarHeight, setNavbarHeight] = useState(0);
    const dropdownRef = useRef(null);
    const navbarRef = useRef(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Calculate navbar height for spacing
    useEffect(() => {
        if (navbarRef.current) {
            const updateNavbarHeight = () => {
                const height = navbarRef.current.offsetHeight-25;
                setNavbarHeight(height);
                document.documentElement.style.setProperty('--navbar-height', `${height}px`);
                document.body.style.paddingTop = `${height}px`;
            };
            
            // Update on mount
            updateNavbarHeight();
            
            // Update on window resize
            window.addEventListener('resize', updateNavbarHeight);
            
            // Update after mobile menu changes (with delay to account for animation)
            const timer = setTimeout(updateNavbarHeight, 510);
            
            return () => {
                window.removeEventListener('resize', updateNavbarHeight);
                clearTimeout(timer);
            };
        }
    }, [isMobileMenuOpen]);

    // Handle clicks outside the dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Close mobile menu on larger screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobileMenuOpen]);

    // Get first letter of name for avatar
    const getNameInitial = () => {
        if (!currentUser || !currentUser.first_name) {
            return currentUser && currentUser.email ? currentUser.email[0].toUpperCase() : "U";
        }
        return currentUser.first_name[0].toUpperCase();
    };

    // Get display name
    const getDisplayName = () => {
        if (!currentUser) return "User";
        if (currentUser.first_name) return currentUser.first_name;
        if (currentUser.email) {
            return currentUser.email.split('@')[0];
        }
        return "User";
    };

    return (
        <>
            <nav 
                ref={navbarRef}
                className={`fixed w-full top-0 z-50 transition-all duration-500 py-2.5 ${
                    scrolled 
                        ? "bg-[#F7F3E9] shadow-md" 
                        : "bg-[#F7F3E9]"
                }`}
            >
                <div className="w-full mx-auto px-8 sm:px-4 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo with responsive sizing */}
                        <Link to="/" className="flex items-center">
                            <img 
                                src={logo} 
                                className="absolute left-4 h-20 sm:h-24 md:h-28 transition-all duration-500 hover:scale-105" 
                                alt="Logo" 
                            />
                        </Link>
                        
                        {/* Mobile menu button with animation */}
                        <div className="flex md:hidden">
                            <button 
                                onClick={toggleMobileMenu} 
                                className="relative text-[#3E3E3E] p-4 rounded-full focus:outline-none bg-[#F7F3E9]/60 hover:bg-[#F7F3E9] transition-all duration-300 overflow-hidden"
                                aria-label="Toggle mobile menu"
                            >
                                <div className="relative z-10">
                                    <span className={`block w-5 h-0.5 bg-[#3E3E3E] rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                                    <span className={`block w-5 h-0.5 bg-[#3E3E3E] rounded-full my-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                                    <span className={`block w-5 h-0.5 bg-[#3E3E3E] rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                                </div>
                            </button>
                        </div>
                        
                        {/* Desktop navigation */}
                        <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                            {!currentUser ? (
                                <div className="flex relative">
                                    <button 
                                        onClick={() => openModal(<Login />)} 
                                        onMouseEnter={() => setHoveredButton('login')}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        className="relative overflow-hidden bg-[#F46036] text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-l-lg text-xs sm:text-sm font-medium transition-all duration-300"
                                    >
                                        <span className="relative z-10 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Sign In
                                        </span>
                                        <span className={`absolute inset-0 bg-[#FF6B6B] transition-opacity duration-500 ${hoveredButton === 'login' ? 'opacity-100' : 'opacity-0'}`}></span>
                                    </button>
                                    
                                    <button 
                                        onClick={() => openModal(<Register />)} 
                                        onMouseEnter={() => setHoveredButton('register')}
                                        onMouseLeave={() => setHoveredButton(null)}
                                        className="relative overflow-hidden bg-[#FF6B6B] text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-r-lg text-xs sm:text-sm font-medium shadow-sm transition-all duration-300"
                                    >
                                        <span className="relative z-10 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                            </svg>
                                            Register
                                        </span>
                                        <span className={`absolute inset-0 bg-[#F46036] transition-opacity duration-500 ${hoveredButton === 'register' ? 'opacity-100' : 'opacity-0'}`}></span>
                                    </button>
                                </div>
                            ) : (
                                <div className="relative" ref={dropdownRef}>
                                    <button 
                                        onClick={toggleDropdown} 
                                        className="flex items-center focus:outline-none group"
                                        aria-expanded={isDropdownOpen}
                                        aria-haspopup="true"
                                    >
                                        <div className="flex items-center py-1 sm:py-1.5 px-2 sm:px-3 rounded-full bg-[#F7F3E9] border border-[#F46036]/20 shadow-md group-hover:bg-[#F7F3E9]/80 group-hover:border-[#F46036]/40 transition-all duration-300">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#F46036] text-white flex items-center justify-center font-medium text-xs sm:text-sm shadow-inner overflow-hidden border border-white/30">
                                                {getNameInitial()}
                                            </div>
                                            <span className="ml-2 text-[#3E3E3E] font-medium hidden sm:inline-block pr-1 text-xs md:text-sm">
                                                {getDisplayName()}
                                            </span>
                                            <svg className={`h-3 w-3 sm:h-4 sm:w-4 text-[#3E3E3E] transition-transform duration-300 ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </button>
                                    
                                    {/* User Dropdown - Animated and Enhanced */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-3 w-56 sm:w-64 md:w-72 rounded-xl overflow-hidden shadow-lg bg-white z-10 ring-1 ring-[#F46036]/20 transform origin-top-right animate-fadeIn">
                                            {/* Header with pattern */}
                                            <div className="relative border-b border-[#F7F3E9] py-3 px-3 sm:py-4 sm:px-4 bg-[#F7F3E9]/50">
                                                <div className="absolute inset-0 opacity-10 overflow-hidden">
                                                    <div className="absolute -inset-2 bg-repeat opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F46036' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")" }}></div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F46036] text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg border-2 border-white/20">
                                                        {getNameInitial()}
                                                    </div>
                                                    <div className="ml-3">
                                                        <h3 className="text-base sm:text-lg font-semibold text-[#3E3E3E]">Welcome Back!</h3>
                                                        <p className="text-xs text-[#F46036]">Your Personal Dashboard</p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* User info with icons */}
                                            <div className="px-3 sm:px-4 py-3 sm:py-4 bg-[#F7F3E9]/10">
                                                <div className="mb-3 sm:mb-4 flex items-start">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#F46036] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wider text-[#F46036] font-semibold">Full Name</p>
                                                        <p className="text-xs sm:text-sm font-medium text-[#3E3E3E]">
                                                            {currentUser?.first_name || "User"}
                                                            {currentUser?.last_name ? ` ${currentUser?.last_name}` : ""}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-[#F46036] mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    <div>
                                                        <p className="text-xs uppercase tracking-wider text-[#F46036] font-semibold">Email Address</p>
                                                        <p className="text-xs sm:text-sm font-medium text-[#3E3E3E] truncate max-w-xs">
                                                            {currentUser?.email || "user@example.com"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Actions with hover effects */}
                                            <div className="p-2 bg-[#F7F3E9]/5">
                                                <div className="p-1 mb-1 rounded-lg bg-[#F7F3E9]/20">
                                                    <Link to="/profile" className="w-full text-left px-3 py-2 text-xs sm:text-sm font-medium text-[#3E3E3E] hover:bg-[#F7F3E9]/50 rounded-md transition-colors duration-200 flex items-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-[#F46036]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        Settings
                                                    </Link>
                                                </div>
                                                
                                                <button 
                                                    onClick={logout} 
                                                    className="relative overflow-hidden w-full text-left px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-[#3E3E3E] bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 rounded-lg transition-all duration-200 flex items-center"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Logout
                                                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-[#FF6B6B] transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></div>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Mobile menu with improved animation */}
                <div 
                    className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden ${
                        isMobileMenuOpen ? 'max-h-96 opacity-100 mt-1 sm:mt-2' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="mx-3 sm:mx-4 my-2 p-2 rounded-xl bg-white shadow-lg border border-[#F7F3E9]">
                        {!currentUser ? (
                            <div className="flex flex-col space-y-2 p-2">
                                <button 
                                    onClick={() => {openModal(<Login />);setIsMobileMenuOpen(false);}} 
                                    className="w-full relative overflow-hidden bg-[#F46036] text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span className="relative z-10">Sign In</span>
                                    <span className="absolute inset-0 bg-[#FF6B6B] opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                                </button>
                                
                                <button 
                                    onClick={() => {openModal(<Register />);setIsMobileMenuOpen(false);}} 
                                    className="w-full relative overflow-hidden bg-[#FF6B6B] text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium shadow-sm transition-all duration-300 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                    <span className="relative z-10">Register</span>
                                    <span className="absolute inset-0 bg-[#F46036] opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                                </button>
                            </div>
                        ) : (
                            <div className="p-2">
                                <div className="mb-3 flex items-center justify-between p-2 sm:p-3 rounded-lg bg-[#F7F3E9] border border-[#F46036]/10 shadow-md">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#F46036] text-white flex items-center justify-center font-medium text-base sm:text-lg shadow-inner border border-white/30">
                                            {getNameInitial()}
                                        </div>
                                        <div className="ml-2 sm:ml-3">
                                            <span className="text-xs sm:text-sm text-[#3E3E3E] font-medium">
                                                {getDisplayName()}
                                            </span>
                                            <p className="text-xs text-[#F46036] truncate max-w-[150px] sm:max-w-[200px]">
                                                {currentUser?.email}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <a href="/profile" className="w-full text-left px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-[#3E3E3E] bg-[#F7F3E9]/30 hover:bg-[#F7F3E9]/60 rounded-lg transition-colors duration-200 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-[#F46036]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </a>
                                    
                                    <button 
                                        onClick={() => {logout();setIsMobileMenuOpen(false);}} 
                                        className="w-full text-left px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-[#3E3E3E] bg-[#FF6B6B]/10 hover:bg-[#FF6B6B]/20 rounded-lg transition-colors duration-200 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-[#FF6B6B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            
            {/* Spacer div to prevent content overlap - responsive to navbar height */}
            <div className="navbar-spacer" style={{ height: `${navbarHeight}px` }}></div>
        </>
    );
};

export default Navbar;