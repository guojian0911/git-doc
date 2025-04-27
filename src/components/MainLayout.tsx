
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentTable from './ContentTable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  tableOfContents?: {
    id: string;
    text: string;
    level: number;
  }[];
}

const MainLayout = ({ children, tableOfContents = [] }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50/50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-[1600px]">
            <div className="flex gap-8">
              {/* Content Area */}
              <div className="flex-1 min-w-0 px-4 py-8 xl:px-8">
                <div className="prose prose-gray max-w-none">
                  {children}
                </div>
              </div>
              
              {/* Right Sidebar - Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="hidden xl:block w-72 py-8">
                  <ContentTable items={tableOfContents} />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
