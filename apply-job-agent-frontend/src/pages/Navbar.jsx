import React, { useState, useRef, useEffect } from "react";
import { useModal } from "../Contexts/ModalContext";
import Login from "./AuthComponents/Login";
import Register from "./AuthComponents/Rergister"; 
import logo from "../assets/logo.png";
import { useAuth } from "../Contexts/AuthContext";

const Navbar = () => {
    const { openModal } = useModal(); 
    const { logout, currentUser } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    // Get first letter of name for avatar
    const getNameInitial = () => {
        if (!currentUser || !currentUser.first_name) {
            // If no name, use first letter of email or "U"
            return currentUser && currentUser.email ? currentUser.email[0].toUpperCase() : "U";
        }
        
        // Return first letter of name
        return currentUser.first_name[0].toUpperCase();
    };

    // Get display name
    const getDisplayName = () => {
        if (!currentUser) return "User";
        if (currentUser.first_name) return currentUser.first_name;
        if (currentUser.email) {
            // Return part before @ in email
            return currentUser.email.split('@')[0];
        }
        return "User";
    };

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0 flex items-center">
                        <span className="text-white text-xl font-semibold">
                            <img src={logo} className="w-[10svw] md:w-[3svw]" alt="Logo" />
                        </span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {!currentUser ? (
                            <div className="flex space-x-2">
                                <button 
                                    onClick={() => openModal(<Login />)}
                                    className="group relative overflow-hidden text-indigo-100 px-5 py-2.5 rounded-l-lg text-sm font-medium transition-colors"
                                >
                                    <span className="relative z-10">Sign In</span>
                                    <span className="absolute inset-0 bg-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </button>
                                
                                <div className="h-full w-px bg-indigo-400/30"></div>
                                
                                <button 
                                    onClick={() => openModal(<Register />)}
                                    className="group relative overflow-hidden bg-white text-indigo-600 px-5 py-2.5 rounded-r-lg text-sm font-medium shadow-sm"
                                >
                                    <span className="relative z-10">Register</span>
                                    <span className="absolute inset-0 bg-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                </button>
                            </div>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button 
                                    onClick={toggleDropdown}
                                    className="flex items-center focus:outline-none"
                                >
                                    <div className="flex items-center py-1 px-3 rounded-md bg-white/20 backdrop-blur-[2px] border border-white/30 shadow-md hover:bg-white/25 transition-colors duration-200">
                                        <div className="w-7 h-7 rounded-full border-[1px] bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-medium text-sm shadow-inner">
                                            {getNameInitial()}
                                        </div>
                                        <span className="ml-2 text-white font-medium hidden sm:inline-block pr-1">
                                            {getDisplayName()}
                                        </span>
                                        <svg 
                                            className={`h-4 w-4 text-white transition-transform duration-200 ml-1 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            viewBox="0 0 20 20" 
                                            fill="currentColor"
                                        >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </button>
                                
                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black/5">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm text-gray-600">Signed in as</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {currentUser.email || "User"}
                                            </p>
                                        </div>
                                        {/* Profile and Settings options are commented out as requested */}
                                        {/*
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Settings
                                        </a>
                                        */}
                                        <button
                                            onClick={logout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;