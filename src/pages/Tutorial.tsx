
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import MainLayout from '@/components/MainLayout';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ChapterNavigation from '@/components/ChapterNavigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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

  // Fetch tutorial data
  const { data: tutorial, isLoading: isTutorialLoading } = useQuery({
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
  const { data: chapters, isLoading: isChaptersLoading } = useQuery({
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

  // Fetch chapter content when currentChapter changes
  useEffect(() => {
    const fetchChapterContent = async () => {
      if (!currentChapter) return;
      
      try {
        const { data, error } = await supabase.storage
          .from('tutorials')
          .download(currentChapter.storage_path);
        
        if (error) {
          toast({
            title: "加载失败",
            description: "无法加载章节内容，请稍后再试",
            variant: "destructive"
          });
          console.error('Error fetching chapter content:', error);
          return;
        }

        const content = await data.text();
        setMarkdownContent(content);
      } catch (error) {
        console.error('Error processing chapter content:', error);
        setMarkdownContent('# 内容加载失败\n请稍后再试');
      }
    };

    fetchChapterContent();
  }, [currentChapter]);

  // Set initial chapter
  useEffect(() => {
    if (chapters && chapters.length > 0 && !currentChapter) {
      setCurrentChapter(chapters[0]);
    }
  }, [chapters, currentChapter]);

  const handleHeadingsExtracted = (headings: { id: string; text: string; level: number }[]) => {
    // Ensure each heading has a unique ID
    const uniqueHeadings = headings.map((heading, index) => ({
      ...heading,
      id: heading.id || `heading-${index}`
    }));
    setTableOfContents(uniqueHeadings);
  };

  const handleChapterChange = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    // Reset scroll position when changing chapters
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    navigate('/');
  };

  if (isTutorialLoading || isChaptersLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-4 border-brand-orange rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">加载中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!tutorial || !chapters || chapters.length === 0) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
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
        <div className="flex-1 px-4 py-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={handleBackToList}
              className="flex items-center gap-2 mb-4 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              返回教程列表
            </Button>
            <h1 className="text-2xl font-bold">{tutorial.title}</h1>
            {currentChapter && (
              <p className="text-gray-500 mt-2">
                章节 {currentChapter.number}: {currentChapter.title}
              </p>
            )}
          </div>
          <div className="max-w-4xl mx-auto">
            <MarkdownRenderer 
              content={markdownContent} 
              onHeadingsExtracted={handleHeadingsExtracted}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorialPage;
