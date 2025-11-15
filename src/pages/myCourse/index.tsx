

import { useState } from 'react';
import { EnrolledCourse, enrolledCourses } from '@/lib/courses';
import { MyCoursesHeader } from './components/my-course-header';
import { CourseCard } from './components/course-card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { SortAsc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type SortOption = 'recent' | 'progress' | 'title' | 'oldest';

export function MyCourses() {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [courses, setCourses] = useState<EnrolledCourse[]>(enrolledCourses);
    const navigate = useNavigate()
  const handleSort = (option: SortOption) => {
    setSortBy(option);
    let sorted = [...enrolledCourses];

    switch (option) {
      case 'recent':
        sorted.sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());
        break;
      case 'progress':
        sorted.sort((a, b) => b.progress - a.progress);
        break;
      case 'title':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.lastAccessed).getTime() - new Date(b.lastAccessed).getTime());
        break;
    }

    setCourses(sorted);
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/student/courses/${courseId}`)
  };

  return (
    <div className="">
      {/* Container without padding */}
      <div className="w-full">
        {/* Header section with internal padding */}
        <div className="px-4  py-8 ">
          <div className="container mx-auto">
            <MyCoursesHeader 
              totalCourses={courses.length}
              onFilterClick={() => {
                // Handle filter click
              }}
            />
          </div>
        </div>

        {/* Main content section with internal padding */}
        <div className=" py-8">
          <div className="container mx-auto">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <span className="text-sm ">Sort by:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <SortAsc className="h-4 w-4" />
                      {sortBy === 'recent' && 'Most Recent'}
                      {sortBy === 'progress' && 'Progress'}
                      {sortBy === 'title' && 'Title A-Z'}
                      {sortBy === 'oldest' && 'Oldest'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => handleSort('recent')}>
                      Most Recent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('progress')}>
                      Progress (High to Low)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSort('title')}>
                      Title (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleSort('oldest')}>
                      Oldest
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Stats */}
              <div className="text-sm ">
                Showing {courses.length} course{courses.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Courses Grid */}
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() => handleCourseClick(course.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="">No courses found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
