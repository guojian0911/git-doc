
import React from 'react';

const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 rounded-md bg-brand-orange flex items-center justify-center">
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 text-white"
        >
          <path 
            d="M3 7L9 4L15 7L21 4V17L15 20L9 17L3 20V7Z"
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M9 4V17" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M15 7V20" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="font-semibold text-lg">MdDocs</span>
    </div>
  );
};

export default Logo;
