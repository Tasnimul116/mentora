import { BookOpen, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MyCoursesHeaderProps {
  totalCourses: number;
  onFilterClick?: () => void;
}

export function MyCoursesHeader({ totalCourses, onFilterClick }: MyCoursesHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Title Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-supperagent text-white rounded-lg flex items-center justify-center">
            <BookOpen className="h-5 w-5 " />
          </div>
          <div>
            <h1 className="text-3xl font-bold ">My Courses</h1>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onFilterClick}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

    </div>
  );
}
