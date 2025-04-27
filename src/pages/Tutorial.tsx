
import React, { useEffect, useState, Suspense, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import MainLayout from '@/components/MainLayout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ChapterNavigation from '@/components/ChapterNavigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

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

// 加载状态组件
const LoadingState = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-t-4 border-brand-orange rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-lg text-gray-600 dark:text-gray-400">加载中...</p>
    </div>
  </div>
);

// 错误状态组件
const ErrorState = ({ message, retry }: { message: string; retry: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">加载失败</h2>
    <p className="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
    <Button onClick={retry}>重试</Button>
  </div>
);

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

  // Fetch chapter content - memoized to prevent unnecessary rerenders
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
      // If no chapter selected yet, select the first one
      if (!currentChapter) {
        setCurrentChapter(chapters[0]);
      }
    }
  }, [chapters, currentChapter]);

  // Load content when current chapter changes
  useEffect(() => {
    if (currentChapter) {
      fetchChapterContent(currentChapter);
      // Close mobile nav when changing chapters
      setIsMobileNavOpen(false);
    }
  }, [currentChapter, fetchChapterContent]);

  const handleHeadingsExtracted = (headings: { id: string; text: string; level: number }[]) => {
    // Ensure each heading has a unique ID
    const uniqueHeadings = headings.map((heading, index) => ({
      ...heading,
      id: heading.id || `heading-${index}`
    }));
    setTableOfContents(uniqueHeadings);
  };

  const handleChapterChange = (chapter: Chapter) => {
    if (chapter.id !== currentChapter?.id) {
      setCurrentChapter(chapter);
      // Reset scroll position when changing chapters
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
        {/* Desktop Chapter Navigation */}
        <ChapterNavigation 
          chapters={chapters}
          currentChapter={currentChapter}
          onChapterSelect={handleChapterChange}
        />
        
        {/* Mobile Chapter Navigation */}
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
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
                          handleChapterChange(chapter);
                          setIsMobileNavOpen(false);
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
        
        {/* Main Content */}
        <div className="flex-1 px-4 py-8 max-w-full overflow-hidden">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToList}
              className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeft className="h-4 w-4" />
              返回教程列表
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{tutorial.title}</h1>
            {currentChapter && (
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                章节 {currentChapter.number}: {currentChapter.title}
              </p>
            )}
          </div>
          <Suspense fallback={<LoadingState />}>
            <div className="max-w-4xl mx-auto">
              <MarkdownRenderer 
                content={markdownContent} 
                onHeadingsExtracted={handleHeadingsExtracted}
              />
            </div>
          </Suspense>
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorialPage;
