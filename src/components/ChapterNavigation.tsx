
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface Chapter {
  id: string;
  number: number;
  title: string;
  storage_path: string;
  tutorial_id: string;
}

interface ChapterNavigationProps {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  onChapterSelect: (chapter: Chapter) => void;
}

const ChapterNavigation = ({ chapters, currentChapter, onChapterSelect }: ChapterNavigationProps) => {
  return (
    <div className="w-72 border-r border-gray-200 bg-white dark:bg-gray-800 hidden md:block">
      <div className="h-full flex flex-col">
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">章节目录</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="py-2">
            <nav className="space-y-1 px-2">
              {chapters.map((chapter) => {
                const isActive = currentChapter?.id === chapter.id;
                
                return (
                  <button
                    key={chapter.id}
                    onClick={() => onChapterSelect(chapter)}
                    className={cn(
                      "w-full text-left px-3 py-3 rounded-md transition-colors flex items-center",
                      isActive 
                        ? "bg-orange-50 text-brand-orange dark:bg-orange-900/20 dark:text-orange-300"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700/40 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <div className="flex items-center w-full">
                      <span className={cn(
                        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-3",
                        isActive 
                          ? "bg-brand-orange text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      )}>
                        {chapter.number}
                      </span>
                      <span className="text-sm flex-1 line-clamp-2">
                        {chapter.title}
                      </span>
                      {isActive && (
                        <ChevronRight className="h-4 w-4 text-brand-orange flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default ChapterNavigation;
