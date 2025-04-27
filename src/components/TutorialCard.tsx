
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface TutorialCardProps {
  id: string;
  title: string;
  language: string;
  viewCount: number;
}

const TutorialCard = ({ id, title, language, viewCount }: TutorialCardProps) => {
  return (
    <Link to={`/tutorial/${id}`}>
      <Card className="hover:bg-gray-50 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{language}</span>
            <span>{viewCount} views</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TutorialCard;
