
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentTable from './ContentTable';
import { Menu, ChevronRight, BookOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  tableOfContents?: {
    id: string;
    text: string;
    level: number;
  }[];
}

const MainLayout = ({ children, tableOfContents = [] }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild className="lg:hidden fixed bottom-4 left-4 z-40">
            <button className="rounded-full bg-brand-orange p-3 text-white shadow-lg">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 max-w-full">
            <div className="h-full overflow-y-auto py-4">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Main Content */}
        <main className="flex-1 bg-white dark:bg-gray-900">
          <div className="flex max-w-7xl mx-auto h-full">
            <div className="min-w-0 flex-1 px-4 md:px-6 py-8">
              {children}
            </div>
            
            {/* Table of Contents - Desktop */}
            {tableOfContents.length > 0 && (
              <>
                <div className={cn(
                  "hidden xl:flex w-64 flex-shrink-0 py-8 pr-6 transition-all duration-300 ease-in-out",
                  tocOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8 w-0"
                )}>
                  <div className="sticky top-16 overflow-hidden w-full">
                    <ContentTable items={tableOfContents} />
                  </div>
                </div>
              
                {/* TOC Toggle Button */}
                <button 
                  onClick={() => setTocOpen(!tocOpen)}
                  className="hidden xl:flex fixed right-4 top-20 z-10 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md items-center justify-center border border-gray-200 dark:border-gray-700"
                >
                  {tocOpen ? (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </>
            )}
            
            {/* Mobile TOC Button */}
            {tableOfContents.length > 0 && (
              <Sheet>
                <SheetTrigger asChild className="xl:hidden fixed bottom-4 right-4 z-40">
                  <button className="rounded-full bg-gray-800 dark:bg-gray-700 p-3 text-white shadow-lg">
                    <BookOpen className="h-5 w-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 max-w-full">
                  <div className="h-full py-6">
                    <h3 className="text-lg font-medium mb-4">在此页面</h3>
                    <ContentTable items={tableOfContents} />
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
