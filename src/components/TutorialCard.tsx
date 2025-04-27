
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Book, Eye } from "lucide-react";

interface TutorialCardProps {
  id: string;
  title: string;
  language: string;
  viewCount: number;
}

const TutorialCard = ({ id, title, language, viewCount }: TutorialCardProps) => {
  return (
    <Link to={`/tutorial/${id}`}>
      <Card className="h-full hover:shadow-md transition-all duration-200 border-gray-200 hover:border-brand-orange/50">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center h-6">
              <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-800">
                {language}
              </span>
            </div>
          </div>
          <CardTitle className="text-lg mt-2">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-gray-500">
            <Book className="h-4 w-4 mr-1" />
            <span className="mr-3">教程</span>
            <Eye className="h-4 w-4 mr-1" />
            <span>{viewCount} 次查看</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TutorialCard;
