
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface TutorialHeaderProps {
  tutorialTitle: string;
  chapterNumber?: number;
  chapterTitle?: string;
  onBackClick: () => void;
}

const TutorialHeader = ({
  tutorialTitle,
  chapterNumber,
  chapterTitle,
  onBackClick,
}: TutorialHeaderProps) => (
  <div className="mb-6">
    <Button 
      variant="ghost" 
      onClick={onBackClick}
      className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
    >
      <ArrowLeft className="h-4 w-4" />
      返回教程列表
    </Button>
    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tutorialTitle}</h1>
    {chapterNumber && chapterTitle && (
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        章节 {chapterNumber}: {chapterTitle}
      </p>
    )}
  </div>
);

export default TutorialHeader;

