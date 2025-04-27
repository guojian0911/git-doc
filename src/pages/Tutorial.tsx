import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import MainLayout from '@/components/MainLayout';
import ChapterNavigation from '@/components/ChapterNavigation';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import LoadingState from '@/components/tutorial/LoadingState';
import ErrorState from '@/components/tutorial/ErrorState';
import MobileNavigation from '@/components/tutorial/MobileNavigation';
import TutorialHeader from '@/components/tutorial/TutorialHeader';
import ContentDisplay from '@/components/tutorial/ContentDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
  language: string;
}

const TutorialPage = () => {
  const { tutorialId = '' } = useParams();
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [tableOfContents, setTableOfContents] = useState<{ id: string; text: string; level: number }[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Fetch tutorial data
  const { 
    data: tutorial, 
    isLoading: isTutorialLoading,
    isError: isTutorialError,
    refetch: refetchTutorial
  } = useQuery({
    queryKey: ['tutorial', tutorialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tutorials')
        .select('*')
        .eq('id', tutorialId)
        .single();
      
      if (error) {
        toast({
          title: "加载失败",
          description: "无法加载教程信息，请稍后再试",
          variant: "destructive"
        });
        throw error;
      }

      // Increment view count
      await supabase
        .from('tutorials')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', tutorialId);
      
      return data as Tutorial;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch chapters data
  const { 
    data: chapters, 
    isLoading: isChaptersLoading,
    isError: isChaptersError,
    refetch: refetchChapters
  } = useQuery({
    queryKey: ['chapters', tutorialId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('tutorial_id', tutorialId)
        .order('number');
      
      if (error) {
        toast({
          title: "加载失败",
          description: "无法加载章节信息，请稍后再试",
          variant: "destructive"
        });
        throw error;
      }
      return data as Chapter[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch chapter content
  const fetchChapterContent = useCallback(async (chapter: Chapter) => {
    try {
      const { data, error } = await supabase.storage
        .from('tutorials')
        .download(chapter.storage_path);
      
      if (error) {
        toast({
          title: "加载失败",
          description: "无法加载章节内容，请稍后再试",
          variant: "destructive"
        });
        console.error('Error fetching chapter content:', error);
        setMarkdownContent('# 内容加载失败\n请稍后再试');
        return;
      }

      const content = await data.text();
      setMarkdownContent(content);
    } catch (error) {
      console.error('Error processing chapter content:', error);
      setMarkdownContent('# 内容加载失败\n请稍后再试');
    }
  }, [toast]);

  // Set initial chapter and load content when chapters change
  useEffect(() => {
    if (chapters && chapters.length > 0) {
      if (!currentChapter) {
        setCurrentChapter(chapters[0]);
      }
    }
  }, [chapters, currentChapter]);

  // Load content when current chapter changes
  useEffect(() => {
    if (currentChapter) {
      fetchChapterContent(currentChapter);
      setIsMobileNavOpen(false);
    }
  }, [currentChapter, fetchChapterContent]);

  const handleChapterChange = (chapter: Chapter) => {
    if (chapter.id !== currentChapter?.id) {
      setCurrentChapter(chapter);
      window.scrollTo(0, 0);
    }
  };

  const handleBackToList = () => {
    navigate('/');
  };

  const retryLoading = () => {
    refetchTutorial();
    refetchChapters();
  };

  const isLoading = isTutorialLoading || isChaptersLoading;
  const isError = isTutorialError || isChaptersError;

  if (isLoading) {
    return (
      <MainLayout>
        <LoadingState />
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <ErrorState 
          message="加载教程信息时出错，请检查您的网络连接并重试。" 
          retry={retryLoading} 
        />
      </MainLayout>
    );
  }

  if (!tutorial || !chapters || chapters.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">教程不存在或没有章节</h1>
          <Button onClick={handleBackToList} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回教程列表
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout tableOfContents={tableOfContents}>
      <div className="flex min-h-screen">
        <ChapterNavigation 
          chapters={chapters}
          currentChapter={currentChapter}
          onChapterSelect={handleChapterChange}
        />
        
        <MobileNavigation
          isOpen={isMobileNavOpen}
          onOpenChange={setIsMobileNavOpen}
          chapters={chapters}
          currentChapter={currentChapter}
          onChapterSelect={handleChapterChange}
        />
        
        <div className="flex-1 px-4 py-8 max-w-full overflow-hidden">
          <TutorialHeader
            tutorialTitle={tutorial.title}
            chapterNumber={currentChapter?.number}
            chapterTitle={currentChapter?.title}
            onBackClick={handleBackToList}
          />
          
          <ContentDisplay
            content={markdownContent}
            onHeadingsExtracted={setTableOfContents}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorialPage;
