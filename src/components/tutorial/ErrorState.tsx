
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message: string;
  retry: () => void;
}

const ErrorState = ({ message, retry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">加载失败</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
    <Button onClick={retry}>重试</Button>
  </div>
);

export default ErrorState;

