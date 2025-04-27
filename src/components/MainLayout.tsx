
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentTable from './ContentTable';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronRight } from 'lucide-react';

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
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto">
            <div className="flex">
              {/* Content Area */}
              <div className="flex-1 min-w-0 px-4 py-8 xl:px-8">
                {children}
              </div>
              
              {/* Right Sidebar - Table of Contents */}
              {tableOfContents.length > 0 && (
                <div className="hidden xl:block w-64 pl-8 py-8 overflow-y-auto">
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
