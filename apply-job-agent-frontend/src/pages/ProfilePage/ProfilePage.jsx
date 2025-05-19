import React, { useState, useEffect } from 'react';
import { useAuth } from '../../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../ResumeProcessPage/Components/Footer.jsx'

const ProfilePage = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        bio: '',
        phone: '',
        location: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    // Redirect if not logged in
    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        } else {
            // Initialize form with current user data
            setFormData({
                first_name: currentUser.first_name || '',
                last_name: currentUser.last_name || '',
                email: currentUser.email || '',
                bio: currentUser.bio || '',
                phone: currentUser.phone || '',
                location: currentUser.location || '',
            });
        }
    }, [currentUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        // Simulate API call to update profile
        try {
            // Replace with actual API call when backend is ready
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setNotification({
                show: true,
                message: 'Profile updated successfully!',
                type: 'success'
            });
            setIsEditing(false);
            
            // Hide notification after 3 seconds
            setTimeout(() => {
                setNotification({ show: false, message: '', type: '' });
            }, 3000);
        } catch (error) {
            setNotification({
                show: true,
                message: 'Failed to update profile. Please try again.' + error,
                type: 'error'
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="mb-12 mt-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#F7F3E9] rounded-xl shadow-md overflow-hidden">
                        {/* Profile Header */}
                        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#F46036]/80 to-[#F46036]/60">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="w-24 h-24 rounded-full bg-[#F7F3E9] text-[#F46036] flex items-center justify-center text-4xl font-bold shadow-md border-4 border-white/30">
                                    {currentUser?.first_name?.[0]?.toUpperCase() || currentUser?.email?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                                        {currentUser?.first_name 
                                            ? `${currentUser.first_name} ${currentUser.last_name || ''}`
                                            : currentUser?.email?.split('@')[0] || 'User'}
                                    </h1>
                                    <p className="text-white/80 mt-1">{currentUser?.email}</p>
                                </div>
                                <div className="sm:ml-auto mt-4 sm:mt-0">
                                    <button 
                                        onClick={() => setIsEditing(!isEditing)} 
                                        className="px-4 py-2 bg-white text-[#F46036] rounded-lg shadow-sm hover:bg-white/90 transition-colors duration-200 font-medium text-sm"
                                    >
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Notification */}
                        {notification.show && (
                            <div className={`px-6 py-3 ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {notification.message}
                            </div>
                        )}

                        {/* Profile Content */}
                        <div className="p-6 sm:p-8">
                            {isEditing ? (
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[#3E3E3E] text-sm font-medium mb-2">
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                name="first_name"
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-[#F46036]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[#3E3E3E] text-sm font-medium mb-2">
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                name="last_name"
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-[#F46036]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[#3E3E3E] text-sm font-medium mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                disabled
                                                className="w-full px-3 py-2 border border-[#F46036]/20 rounded-lg bg-gray-100"
                                            />
                                            <p className="text-xs text-[#3E3E3E]/70 mt-1">Email cannot be changed</p>
                                        </div>
                                        <div>
                                            <label className="block text-[#3E3E3E] text-sm font-medium mb-2">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-[#F46036]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[#3E3E3E] text-sm font-medium mb-2">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                placeholder="City, Country"
                                                className="w-full px-3 py-2 border border-[#F46036]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[#3E3E3E] text-sm font-medium mb-2">
                                                Bio
                                            </label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                rows="4"
                                                className="w-full px-3 py-2 border border-[#F46036]/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50"
                                                placeholder="Tell us about yourself..."
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="px-6 py-2 bg-[#F46036] text-white rounded-lg shadow-sm hover:bg-[#F46036]/90 transition-colors duration-200 font-medium text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-[#3E3E3E]/70">First Name</h3>
                                            <p className="mt-1 text-[#3E3E3E]">{formData.first_name || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-[#3E3E3E]/70">Last Name</h3>
                                            <p className="mt-1 text-[#3E3E3E]">{formData.last_name || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-[#3E3E3E]/70">Email</h3>
                                            <p className="mt-1 text-[#3E3E3E]">{formData.email}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-[#3E3E3E]/70">Phone</h3>
                                            <p className="mt-1 text-[#3E3E3E]">{formData.phone || 'Not specified'}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <h3 className="text-sm font-medium text-[#3E3E3E]/70">Location</h3>
                                            <p className="mt-1 text-[#3E3E3E]">{formData.location || 'Not specified'}</p>
                                        </div>
                                        {formData.bio && (
                                            <div className="md:col-span-2">
                                                <h3 className="text-sm font-medium text-[#3E3E3E]/70">Bio</h3>
                                                <p className="mt-1 text-[#3E3E3E] whitespace-pre-line">{formData.bio}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Account Actions */}
                        <div className="p-6 sm:p-8 bg-[#F7F3E9]/50 border-t border-[#F46036]/10">
                            <h2 className="text-lg font-medium text-[#3E3E3E]">Account Actions</h2>
                            <div className="mt-4 space-y-3 sm:space-y-0 sm:flex sm:space-x-4">
                                <button 
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to log out?')) {
                                            logout();
                                            navigate('/');
                                        }
                                    }}
                                    className="w-full sm:w-auto px-4 py-2 bg-[#FF6B6B]/10 text-[#FF6B6B] rounded-lg hover:bg-[#FF6B6B]/20 transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Logout
                                </button>
                                <button 
                                    className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Job Application Stats Card */}
                    {/* <div className="mt-8 bg-[#F7F3E9] rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl font-semibold text-[#3E3E3E]">Application Statistics</h2>
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-[#F46036]/10">
                                    <p className="text-sm text-[#3E3E3E]/70">Total Applications</p>
                                    <p className="text-2xl font-bold text-[#F46036]">12</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-[#F46036]/10">
                                    <p className="text-sm text-[#3E3E3E]/70">In Progress</p>
                                    <p className="text-2xl font-bold text-[#F46036]">5</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-[#F46036]/10">
                                    <p className="text-sm text-[#3E3E3E]/70">Interviews</p>
                                    <p className="text-2xl font-bold text-[#F46036]">3</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-[#F46036]/10">
                                    <p className="text-sm text-[#3E3E3E]/70">Success Rate</p>
                                    <p className="text-2xl font-bold text-[#F46036]">25%</p>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Recent Activity */}
                    {/* <div className="mt-8 bg-[#F7F3E9] rounded-xl shadow-md overflow-hidden mb-12">
                        <div className="p-6 sm:p-8">
                            <h2 className="text-xl font-semibold text-[#3E3E3E]">Recent Activity</h2>
                            <div className="mt-4 space-y-4">
                                <div className="bg-white p-4 rounded-lg border border-[#F46036]/10">
                                    <div className="flex items-start">
                                        <div className="h-8 w-8 rounded-full bg-[#F46036]/10 flex items-center justify-center text-[#F46036]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-[#3E3E3E]">Application Submitted</p>
                                            <p className="text-xs text-[#3E3E3E]/70">Senior Frontend Developer at TechCorp</p>
                                            <p className="text-xs text-[#3E3E3E]/50 mt-1">2 days ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-[#F46036]/10">
                                    <div className="flex items-start">
                                        <div className="h-8 w-8 rounded-full bg-[#F46036]/10 flex items-center justify-center text-[#F46036]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-[#3E3E3E]">Interview Scheduled</p>
                                            <p className="text-xs text-[#3E3E3E]/70">Product Manager at InnovateCo</p>
                                            <p className="text-xs text-[#3E3E3E]/50 mt-1">1 week ago</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-[#F46036]/10">
                                    <div className="flex items-start">
                                        <div className="h-8 w-8 rounded-full bg-[#F46036]/10 flex items-center justify-center text-[#F46036]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-[#3E3E3E]">Resume Updated</p>
                                            <p className="text-xs text-[#3E3E3E]/70">Added new skills and experience</p>
                                            <p className="text-xs text-[#3E3E3E]/50 mt-1">2 weeks ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default ProfilePage;
