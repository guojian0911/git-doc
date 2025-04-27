
import React from 'react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo />
        
        <div className="hidden flex-1 items-center justify-center px-8 lg:flex lg:max-w-lg">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input 
              type="search" 
              placeholder="搜索文档..." 
              className="pl-10 w-full" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost">指南</Button>
          <Button variant="ghost">教程</Button>
          <Button variant="ghost">API</Button>
          <Button variant="outline">
            <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2">
              <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.163 6.84 9.49.5.09.68-.22.68-.48v-1.68c-2.782.6-3.369-1.34-3.369-1.34-.454-1.16-1.11-1.47-1.11-1.47-.908-.62.07-.608.07-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.53 2.341 1.09 2.91.83.09-.65.35-1.09.635-1.34-2.214-.25-4.54-1.11-4.54-4.94 0-1.09.39-1.98 1.03-2.68-.104-.25-.447-1.27.098-2.64 0 0 .84-.27 2.75 1.02A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.02 2.747-1.02.546 1.37.202 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.33 4.68-4.55 4.92.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48C19.14 20.16 22 16.42 22 12c0-5.523-4.477-10-10-10z"></path>
            </svg>
            GitHub
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
