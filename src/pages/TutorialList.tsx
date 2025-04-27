
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Search, Book } from "lucide-react";
import { useState, useEffect } from "react";
import TutorialCard from "@/components/TutorialCard";
import { useToast } from "@/components/ui/use-toast";
import debounce from 'lodash/debounce';
import { Skeleton } from "@/components/ui/skeleton";

const TutorialList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const { toast } = useToast();

  // Debounce search input to prevent too frequent API calls
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    handler();
    return () => handler.cancel();
  }, [searchQuery]);

  // Fetch tutorials
  const { data: tutorials, isLoading, error } = useQuery({
    queryKey: ["tutorials", debouncedSearchQuery],
    queryFn: async () => {
      try {
        let query = supabase.from("tutorials").select("*");
        
        if (debouncedSearchQuery) {
          query = query.ilike("title", `%${debouncedSearchQuery}%`);
        }
        
        const { data, error } = await query
          .eq("is_public", true)
          .order("view_count", { ascending: false })
          .limit(30);
        
        if (error) throw error;
        return data;
      } catch (error) {
        toast({
          title: "加载失败",
          description: "无法加载教程列表，请稍后再试",
          variant: "destructive"
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Handle tutorials by language for better organization
  const tutorialsByLanguage = tutorials?.reduce((acc, tutorial) => {
    const language = tutorial.language || 'other';
    if (!acc[language]) acc[language] = [];
    acc[language].push(tutorial);
    return acc;
  }, {} as Record<string, any[]>) || {};

  // Get languages sorted by number of tutorials
  const languages = Object.keys(tutorialsByLanguage).sort((a, b) => 
    tutorialsByLanguage[b].length - tutorialsByLanguage[a].length
  );

  // Render skeleton loaders while loading
  const renderSkeletonCards = () => {
    return Array(6).fill(0).map((_, i) => (
      <div key={`skeleton-${i}`} className="h-40">
        <Skeleton className="h-full w-full" />
      </div>
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">技术教程</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          探索我们的教程集合，学习最新的开发技术和最佳实践。
        </p>
      </header>
      
      <div className="relative max-w-md mx-auto mb-12">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="搜索教程..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-12 text-lg shadow-sm"
        />
      </div>

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">加载失败，请稍后再试</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderSkeletonCards()}
        </div>
      )}
      
      {!isLoading && (!tutorials || tutorials.length === 0) && (
        <div className="text-center py-12">
          <Book className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">没有找到教程</h2>
          <p className="text-gray-500 mt-2">
            {debouncedSearchQuery 
              ? `没有与"${debouncedSearchQuery}"相关的教程` 
              : "当前没有可显示的教程"}
          </p>
        </div>
      )}
      
      {!isLoading && tutorials && tutorials.length > 0 && (
        <>
          {debouncedSearchQuery ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">搜索结果: {tutorials.length} 个教程</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tutorials.map((tutorial) => (
                  <TutorialCard
                    key={tutorial.id}
                    id={tutorial.id}
                    title={tutorial.title}
                    language={tutorial.language}
                    viewCount={tutorial.view_count}
                  />
                ))}
              </div>
            </div>
          ) : (
            languages.map(language => (
              <div key={language} className="mb-12">
                <h2 className="text-2xl font-semibold mb-6 pb-2 border-b">
                  {language.charAt(0).toUpperCase() + language.slice(1)} 
                  <span className="text-gray-500 text-base font-normal ml-2">
                    ({tutorialsByLanguage[language].length})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutorialsByLanguage[language].map((tutorial) => (
                    <TutorialCard
                      key={tutorial.id}
                      id={tutorial.id}
                      title={tutorial.title}
                      language={tutorial.language}
                      viewCount={tutorial.view_count}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default TutorialList;
