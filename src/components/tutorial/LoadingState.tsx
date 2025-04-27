
import React from 'react';

const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-t-4 border-brand-orange rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg text-gray-600 dark:text-gray-400">加载中...</p>
    </div>
  </div>
);

export default LoadingState;

