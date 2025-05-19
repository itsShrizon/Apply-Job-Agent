import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiUserPlus, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { useModal } from '../../Contexts/ModalContext';
import { useAuth } from '../../Contexts/AuthContext';
import Login from '../AuthComponents/Login';
import logo from '../../assets/logo.png';

// Animated Feature component that slides in whole text at once
const AnimatedFeature = ({ text, index, mobile = false }) => {
  return (
    <div 
      className={`flex items-start mb-3 feature-item-${index} ${mobile ? 'mobile-feature' : 'desktop-feature'}`}
    >
      <FiCheckCircle 
        className={`${mobile ? 'text-[#F46036]' : 'text-[#F7F3E9]'} mt-1 mr-2 flex-shrink-0`} 
        size={mobile ? 16 : 18} 
      />
      <p className={mobile ? 'text-sm' : ''}>
        {text}
      </p>
    </div>
  );
};

// Feature list component with sequential animations
const AnimatedFeatureList = ({ features, mobile = false }) => {
  return (
    <div className={`${mobile ? 'text-[#3E3E3E]/80' : 'text-left text-[#F7F3E9]'} mt-6`}>
      {features.map((feature, index) => (
        <AnimatedFeature 
          key={index}
          text={feature}
          index={index}
          mobile={mobile}
        />
      ))}
    </div>
  );
};

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const features = [
    "Automatically search for jobs that match your resume",
    "Automatically customize your resume for each job",
    "Apply for jobs with a resume that is a perfect fit!"
  ];

  const { openModal, closeModal } = useModal();
  const { register } = useAuth(); // Use the register function from AuthContext

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Terms validation
    if (!acceptTerms) {
      setError('You must accept the Terms of Service to create an account');
      return;
    }

    setLoading(true);
    
    try {
      // Use the register function from the AuthContext
      await register(email, password, firstName, lastName);
      console.log('Registration successful');
      closeModal();
      setLoading(false);
    } catch (err) {
      setError('Registration failed. Please try again.' ,err);
      setLoading(false);
    }
  };

  return (
    <div className="flex rounded-lg overflow-hidden shadow-lg my-8 max-w-5xl mx-auto">
      {/* Left side - Image and Info */}
      <div className="hidden md:block w-2/5 bg-gradient-to-br from-[#F46036] to-[#FF6B6B] p-6">
        <div className="text-center">
          <div>
            <img 
              src={logo} 
              alt="Register" 
              className="mx-auto rounded-lg shadow-lg mb-4"
            />
            <h2 className="text-white text-2xl font-bold mb-3">BetterThing</h2>
          </div>
          <AnimatedFeatureList features={features} />
        </div>
      </div>
      
      {/* Right side - Register Form */}
      <div className="w-full md:w-3/5 bg-white p-6 md:p-10 py-12 overflow-y-auto max-h-[90vh]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#3E3E3E] mb-2">Create Account</h1>
          <p className="text-[#3E3E3E]/70">Fill in the details to get started</p>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-100 p-3 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* First Name Field */}
          <div className="mb-4">
            <label className="block text-[#3E3E3E] text-sm font-medium mb-2" htmlFor="firstName">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser size={18} className="text-[#3E3E3E]/50" />
              </div>
              <input
                id="firstName"
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-[#F7F3E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50 focus:border-transparent bg-[#F7F3E9]/10"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Last Name Field */}
          <div className="mb-4">
            <label className="block text-[#3E3E3E] text-sm font-medium mb-2" htmlFor="lastName">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser size={18} className="text-[#3E3E3E]/50" />
              </div>
              <input
                id="lastName"
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-[#F7F3E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50 focus:border-transparent bg-[#F7F3E9]/10"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-[#3E3E3E] text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail size={18} className="text-[#3E3E3E]/50" />
              </div>
              <input
                id="email"
                type="email"
                className="w-full pl-10 pr-3 py-2 border border-[#F7F3E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50 focus:border-transparent bg-[#F7F3E9]/10"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Password Field with Toggle */}
          <div className="mb-4">
            <label className="block text-[#3E3E3E] text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock size={18} className="text-[#3E3E3E]/50" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2 border border-[#F7F3E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50 focus:border-transparent bg-[#F7F3E9]/10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FiEyeOff size={18} className="text-[#3E3E3E]/50" />
                ) : (
                  <FiEye size={18} className="text-[#3E3E3E]/50" />
                )}
              </button>
            </div>
          </div>
          
          {/* Confirm Password Field with Toggle */}
          <div className="mb-6">
            <label className="block text-[#3E3E3E] text-sm font-medium mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock size={18} className="text-[#3E3E3E]/50" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-2 border border-[#F7F3E9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F46036]/50 focus:border-transparent bg-[#F7F3E9]/10"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={18} className="text-[#3E3E3E]/50" />
                ) : (
                  <FiEye size={18} className="text-[#3E3E3E]/50" />
                )}
              </button>
            </div>
          </div>
          
          {/* Terms of Service Checkbox */}
          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 text-[#F46036] border-[#F7F3E9] rounded focus:ring-[#F46036]"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-[#3E3E3E]/80">
                  I agree to the{" "}
                  <a
                    target='_blank'
                    className="text-[#F46036] hover:text-[#FF6B6B] font-medium underline"
                    // onClick={openTermsModal}
                    href='https://www.betterthing.net/tos'
                    
                  >
                    Terms of Service
                  </a>
                </label>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#FF6B6B] hover:bg-[#F46036] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
            ) : (
              <FiUserPlus size={18} className="mr-2" />
            )}
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-[#3E3E3E]/70 text-sm">
            Already have an account?{" "}
            <button 
              className="text-[#F46036] hover:text-[#FF6B6B] font-medium"
              onClick={() => {
                openModal(<Login />); // Open the login modal
              }}
            >
              Sign In
            </button>
          </p>
        </div>

        {/* Mobile view feature list */}
        <div className="md:hidden mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold text-[#3E3E3E] mb-3">BetterThing.AI Features:</h3>
          <AnimatedFeatureList features={features} mobile={true} />
        </div>
      </div>

      {/* Add custom styles for text animations */}
      <style jsx>{`
        /* Desktop features animations */
        .desktop-feature {
          opacity: 0;
          transform: translateX(-20px);
        }
        
        .feature-item-0 {
          animation: slideIn 0.5s ease-out 0.3s forwards;
        }
        
        .feature-item-1 {
          animation: slideIn 0.5s ease-out 0.8s forwards;
        }
        
        .feature-item-2 {
          animation: slideIn 0.5s ease-out 1.3s forwards;
        }
        
        /* Mobile features animations */
        .mobile-feature {
          opacity: 0;
          transform: translateY(10px);
        }
        
        .mobile-feature.feature-item-0 {
          animation: slideUp 0.5s ease-out 0.3s forwards;
        }
        
        .mobile-feature.feature-item-1 {
          animation: slideUp 0.5s ease-out 0.8s forwards;
        }
        
        .mobile-feature.feature-item-2 {
          animation: slideUp 0.5s ease-out 1.3s forwards;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Register;