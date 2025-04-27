
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useState } from "react";
import TutorialCard from "@/components/TutorialCard";

const TutorialList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tutorials, isLoading } = useQuery({
    queryKey: ["tutorials", searchQuery],
    queryFn: async () => {
      let query = supabase.from("tutorials").select("*");
      
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">教程列表</h1>
      
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="搜索教程..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading && <div>Loading...</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials?.map((tutorial) => (
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
  );
};

export default TutorialList;
