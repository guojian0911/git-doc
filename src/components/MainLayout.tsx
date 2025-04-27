
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ContentTable from './ContentTable';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden fixed bottom-4 left-4 z-40">
            <button className="rounded-full bg-brand-orange p-3 text-white shadow-lg">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="h-full overflow-y-auto py-4">
              <Sidebar />
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Main Content */}
        <main className="flex-1 bg-white">
          <div className="mx-auto flex max-w-7xl">
            <div className="min-w-0 flex-1 px-4 py-8 sm:px-6 xl:px-8">
              {children}
            </div>
            
            {/* Table of Contents - Desktop */}
            {tableOfContents.length > 0 && (
              <div className="hidden xl:block w-64 flex-shrink-0 py-8 pr-6">
                <div className="sticky top-16">
                  <ContentTable items={tableOfContents} />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
