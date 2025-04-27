
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

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
    <div className="w-72 border-r border-gray-200 bg-white hidden md:block">
      <ScrollArea className="h-full py-4">
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">章节目录</h2>
          <nav className="space-y-1">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => onChapterSelect(chapter)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-md hover:bg-gray-100 transition-colors",
                  currentChapter?.id === chapter.id 
                    ? "bg-brand-orange/10 border-l-4 border-brand-orange font-medium text-brand-orange"
                    : "border-l-4 border-transparent"
                )}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs mr-3">
                    {chapter.number}
                  </span>
                  <span className={cn(
                    "text-sm",
                    currentChapter?.id === chapter.id ? "text-brand-orange font-medium" : "text-gray-700"
                  )}>
                    {chapter.title}
                  </span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChapterNavigation;
