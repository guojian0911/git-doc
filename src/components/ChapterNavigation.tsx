
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
    <div className="w-64 border-r border-gray-200 bg-white">
      <ScrollArea className="h-full py-4">
        <div className="px-4">
          <h2 className="text-lg font-semibold mb-4">章节目录</h2>
          <nav>
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => onChapterSelect(chapter)}
                className={cn(
                  "w-full text-left px-4 py-2 rounded-md mb-1 hover:bg-gray-100 transition-colors",
                  currentChapter?.id === chapter.id && "bg-gray-100 font-medium"
                )}
              >
                <span className="text-sm">
                  {chapter.number}. {chapter.title}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChapterNavigation;
