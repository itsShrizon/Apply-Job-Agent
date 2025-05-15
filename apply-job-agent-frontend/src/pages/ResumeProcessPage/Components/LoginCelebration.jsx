import React, { useEffect, useState } from 'react';

const LoginCelebration = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide component after 2 seconds
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    // Clean up timer
    return () => clearTimeout(timer);
  }, []);

  // If not visible, render nothing
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-8 text-center max-w-md animate-bounce-once">
        <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back!</h2>
        <p className="text-gray-600">Login successful</p>
        
        {/* Confetti effect */}
        <div className="confetti-container absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: ['#FFC700', '#FF0066', '#00C2FF', '#6B49FF'][Math.floor(Math.random() * 4)],
                animationDuration: `${(Math.random() * 1) + 1}s`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes bounce-once {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        .animate-fall {
          animation: fall 2s linear forwards;
        }
        
        .animate-bounce-once {
          animation: bounce-once 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginCelebration;