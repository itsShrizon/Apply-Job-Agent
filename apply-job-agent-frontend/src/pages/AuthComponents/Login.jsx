import React, { useState } from 'react';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import { useModal } from '../../Contexts/ModalContext';
import Register from '../AuthComponents/Rergister';
import LoginCelebration from '../ResumeProcessPage/Components/LoginCelebration';
import loginImage from '../../assets/loginImage.jpg'; // Adjust the path to your image
import { useAuth } from '../../Contexts/AuthContext';
// Note: We'll use a background image instead of importing the logo
// Import your background image here
// import backgroundImage from '../../assets/background.jpg'; // Use your actual image path

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { openModal, setIsLoggedIn, closeModal } = useModal();
  const {signIn}=useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate auth process
      await signIn(email, password);
      openModal(<LoginCelebration/>)
      await new Promise(resolve => setTimeout(resolve, 2000));
      closeModal()
      setLoading(false);
     
      // Call your auth context login function here
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="flex rounded-lg overflow-hidden shadow-lg">
      {/* Left side - Background Image with Overlay */}
      <div className="hidden md:block md:w-1/2 relative">
        {/* Background image with CSS - using a placeholder URL, replace with your actual image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('${loginImage}')`, // Replace with your image path or URL
          }}
        ></div>
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-indigo-900/80"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-6 z-10">
          <div className="text-center">
            <h2 className="text-white text-2xl font-bold mb-3">Welcome Back</h2>
            <p className="text-blue-100 text-lg">Sign in to access your account and continue your journey.</p>
            
            {/* Optional decorative element */}
            <div className="mt-6 w-16 h-1 bg-white/50 mx-auto rounded-full"></div>
          </div>
          
          {/* Optional: Add a subtle pattern overlay for more depth */}
          <div className="absolute inset-0 bg-pattern opacity-10 mix-blend-overlay"></div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 bg-white p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h1>
          <p className="text-gray-600">Please enter your credentials</p>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-100 p-3 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <FiLogIn size={18} className="mr-2" />
            )}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <button 
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={()=>openModal(<Register/>)}
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;