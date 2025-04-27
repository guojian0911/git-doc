
import React from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import MainLayout from '@/components/MainLayout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ChapterNavigation from '@/components/ChapterNavigation';
import { useQuery } from '@tanstack/react-query';

interface Chapter {
  id: string;
  number: number;
  title: string;
  storage_path: string;
  tutorial_id: string;
}

interface Tutorial {
  id: string;
  title: string;
  user_id: string;
  is_public: boolean;
  config: any;
}

const TutorialPage = () => {
  const { tutorialId = 'b594a1c8-5912-405f-aa85-9493372eb79a' } = useParams();
  const [currentChapter, setCurrentChapter] = React.useState<Chapter | null>(null);
  const [markdownContent, setMarkdownContent] = React.useState('');
  const [tableOfContents, setTableOfContents] = React.useState<{ id: string; text: string; level: number }[]>([]);

  // Fetch tutorial data
  const { data: tutorial } = useQuery({
    queryKey: ['tutorial', tutorialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('id', tutorialId)
        .single();
      
      if (error) throw error;
      return data as Tutorial;
    }
  });

  // Fetch chapters data
  const { data: chapters } = useQuery({
    queryKey: ['chapters', tutorialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('tutorial_id', tutorialId)
        .order('number');
      
      if (error) throw error;
      return data as Chapter[];
    }
  });

  // Fetch chapter content when currentChapter changes
  React.useEffect(() => {
    const fetchChapterContent = async () => {
      if (!currentChapter) return;
      
      const { data, error } = await supabase.storage
        .from('tutorials')
        .download(currentChapter.storage_path);
      
      if (error) {
        console.error('Error fetching chapter content:', error);
        return;
      }

      const content = await data.text();
      setMarkdownContent(content);
    };

    fetchChapterContent();
  }, [currentChapter]);

  // Set initial chapter
  React.useEffect(() => {
    if (chapters && chapters.length > 0 && !currentChapter) {
      setCurrentChapter(chapters[0]);
    }
  }, [chapters, currentChapter]);

  const handleHeadingsExtracted = (headings: { id: string; text: string; level: number }[]) => {
    setTableOfContents(headings);
  };

  const handleChapterChange = (chapter: Chapter) => {
    setCurrentChapter(chapter);
  };

  if (!tutorial || !chapters) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout tableOfContents={tableOfContents}>
      <div className="flex min-h-screen">
        <ChapterNavigation 
          chapters={chapters}
          currentChapter={currentChapter}
          onChapterSelect={handleChapterChange}
        />
        <div className="flex-1 px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">{tutorial.title}</h1>
          <MarkdownRenderer 
            content={markdownContent} 
            onHeadingsExtracted={handleHeadingsExtracted}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorialPage;
