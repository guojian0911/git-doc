
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BookOpen } from 'lucide-react';

interface Chapter {
  id: string;
  number: number;
  title: string;
  storage_path: string;
  tutorial_id: string;
}

interface MobileNavigationProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  chapters: Chapter[];
  currentChapter: Chapter | null;
  onChapterSelect: (chapter: Chapter) => void;
}

const MobileNavigation = ({
  isOpen,
  onOpenChange,
  chapters,
  currentChapter,
  onChapterSelect,
}: MobileNavigationProps) => (
  <Sheet open={isOpen} onOpenChange={onOpenChange}>
    <SheetTrigger asChild className="md:hidden fixed bottom-20 left-4 z-40">
      <Button variant="outline" size="icon" className="rounded-full bg-white dark:bg-gray-800 shadow-lg border">
        <BookOpen className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-72 p-0 max-w-full">
      <div className="h-full">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">章节目录</h2>
        </div>
        <div className="overflow-y-auto h-full py-4">
          <nav className="space-y-1 px-3">
            {chapters.map((chapter) => {
              const isActive = currentChapter?.id === chapter.id;
              return (
                <button
                  key={chapter.id}
                  onClick={() => {
                    onChapterSelect(chapter);
                    onOpenChange(false);
                  }}
                  className={`w-full text-left px-3 py-3 rounded-md flex items-center ${
                    isActive 
                      ? "bg-orange-50 text-brand-orange dark:bg-orange-900/20 dark:text-orange-300" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3 ${
                    isActive 
                      ? "bg-brand-orange text-white" 
                      : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}>
                    {chapter.number}
                  </span>
                  <span className="text-sm flex-1">{chapter.title}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

export default MobileNavigation;

