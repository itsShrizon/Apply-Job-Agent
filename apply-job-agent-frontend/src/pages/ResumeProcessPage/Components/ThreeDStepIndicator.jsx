import { useState, useEffect, useRef } from 'react';

const ThreeDStepIndicator = ({ steps = [], currentStepIndex = 0 }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const prevStepIndexRef = useRef(currentStepIndex);
  const animationRef = useRef(null);

  // Effect to handle step transitions with rotation animation
  useEffect(() => {
    // Only animate if the step has actually changed
    if (prevStepIndexRef.current !== currentStepIndex) {
      // Cancel any ongoing animation
      cancelAnimationFrame(animationRef.current);
      
      // Set initial rotation for animation
      const startRotation = { ...rotation };
      const targetRotation = { 
        x: rotation.x, 
        y: rotation.y + 360, // Full rotation on step change
        z: rotation.z 
      };
      
      const startTime = performance.now();
      const duration = 1200; // Animation duration in ms
      
      const animateStepChange = (timestamp) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation (ease-out)
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);
        
        setRotation({
          x: startRotation.x,
          y: startRotation.y + (targetRotation.y - startRotation.y) * easedProgress,
          z: startRotation.z
        });
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animateStepChange);
        }
      };
      
      animationRef.current = requestAnimationFrame(animateStepChange);
      
      // Update previous step reference
      prevStepIndexRef.current = currentStepIndex;
    }
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [currentStepIndex]);

  // Enhanced mouse interaction effects
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleMouseMove = (e) => {
      if (!isHovering) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Smooth mouse movement with lerp (linear interpolation)
      lastMousePos.current = {
        x: lastMousePos.current.x + (x - lastMousePos.current.x) * 0.1,
        y: lastMousePos.current.y + (y - lastMousePos.current.y) * 0.1
      };
      
      setRotation(prev => ({
        x: -lastMousePos.current.y * 15, // Invert for natural tilt
        y: prev.y + lastMousePos.current.x * 0, // Keep Y rotation from step changes
        z: 0
      }));
    };
    
    const handleMouseEnter = () => {
      setIsHovering(true);
      
      // Reset last mouse position to avoid jumps
      lastMousePos.current = { x: 0, y: 0 };
      
      // Apply a subtle pop-out effect
      if (containerRef.current) {
        containerRef.current.style.transform = `perspective(1000px) translateZ(10px)`;
      }
    };
    
    const handleMouseLeave = () => {
      setIsHovering(false);
      
      // Smooth reset animation for X and Z rotations only
      const resetAnimation = () => {
        lastMousePos.current = {
          x: lastMousePos.current.x * 0.9,
          y: lastMousePos.current.y * 0.9
        };
        
        setRotation(prev => ({
          x: prev.x * 0.9,
          y: prev.y, // Preserve Y rotation from step changes
          z: 0
        }));
        
        if (Math.abs(lastMousePos.current.x) > 0.01 || Math.abs(lastMousePos.current.y) > 0.01) {
          requestAnimationFrame(resetAnimation);
        }
      };
      
      requestAnimationFrame(resetAnimation);
    };
    
    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovering]);
  
  // Get the current step
  const currentStep = steps[currentStepIndex];
  
  // Calculate transformation based on rotation state
  const getTransform = () => {
    return `
      perspective(1200px) 
      rotateX(${rotation.x}deg) 
      rotateY(${rotation.y}deg) 
      rotateZ(${rotation.z}deg)
    `;
  };

  return (
    <div className="w-full mb-8 relative">
      {/* Enhanced gradient background with animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F46036]/5 via-[#F46036]/10 to-[#F46036]/5 rounded-lg -z-10 transform scale-y-75 blur-sm animate-pulse"></div>
      
      <div className="relative py-10 px-4 backdrop-blur-sm rounded-lg border border-[#F7F3E9] overflow-hidden">
        {/* 3D Element Container */}
        <div className="flex justify-center items-center h-36">
          <div ref={containerRef} className="relative w-48 h-48" style={{
              transformStyle: 'preserve-3d',
              transform: getTransform(),
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Card face */}
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center p-4 rounded-xl border-2 backface-visibility-hidden" style={{
                transform: `translateZ(5px)`,
                transformStyle: 'preserve-3d',
                background: 'linear-gradient(135deg, rgba(244, 96, 54, 0.2), rgba(255, 255, 255, 0.9))',
                borderColor: '#F46036',
                boxShadow: '0 8px 20px rgba(244, 96, 54, 0.2)',
              }}
            >
              {/* Step Circle with enhanced animations */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center relative z-10 transition-all duration-500 border-2 mb-3 bg-[#F46036] text-white border-[#F46036] shadow-lg shadow-[#F46036]/30" style={{
                  transform: isHovering ? 'scale(1.05) translateZ(15px)' : 'scale(1) translateZ(5px)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div className="transition-all duration-500 scale-110">
                  {currentStep?.icon || <span className="font-bold text-lg">{currentStepIndex + 1}</span>}
                </div>
                
                {/* Enhanced pulse animations */}
                <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#F46036] z-0"></div>
                <div className="absolute inset-0 rounded-full animate-pulse opacity-20 bg-[#F46036] z-0"></div>
              </div>
              
              {/* Step Label with float effect */}
              <div className="text-center" style={{
                  transform: isHovering ? 'translateZ(10px)' : 'translateZ(0)',
                  transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <div className="font-bold text-base text-[#F46036]">
                  {currentStep?.label || 'Step'}
                </div>
                <div className="text-xs text-[#3E3E3E]/70 mt-1 max-w-[150px] mx-auto">
                  {currentStep?.description || 'Description'}
                </div>
              </div>
            </div>
            
            {/* Enhanced glowing effects in the center */}
            <div className="absolute top-1/2 left-1/2 w-12 h-12 rounded-full bg-[#F46036]/20" style={{
                transform: 'translate3d(-50%, -50%, 0)',
                transformStyle: 'preserve-3d',
              }}>
              <div className="absolute inset-0 rounded-full bg-[#F46036]/30 animate-pulse"></div>
              <div className="absolute inset-2 rounded-full bg-[#F46036]/40 animate-ping"></div>
              
              {/* Adding particle effects */}
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-1 h-1 rounded-full bg-[#F46036]" style={{
                    top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 30}%`,
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 30}%`,
                    opacity: 0.6,
                    animation: `float ${2 + i * 0.5}s infinite alternate ease-in-out`
                  }}></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Adding keyframe animations */}
        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0px) translateZ(5px); }
            100% { transform: translateY(-10px) translateZ(15px); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ThreeDStepIndicator;