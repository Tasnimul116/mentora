import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { courses, type Lesson } from '@/lib/courses';
import {
  Play,
  Lock,
  CheckCircle2,
  Clock,
  BookOpen,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Download,
  Share2,
  Volume2,
  Settings,
  Maximize,
} from 'lucide-react';

export function CourseDetails() {
  const { id:courseId } = useParams();
  const navigate = useNavigate();
  const course = courses.find(c => c.id === Number(courseId));
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(
    course?.sections[0]?.lessonsList[0] || null
  );

  if (!course) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <p className="text-gray-600">Course not found</p>
      </div>
    );
  }

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (!lesson.isLocked) {
      setCurrentLesson(lesson);
    }
  };

  const totalLessons = course.sections.reduce((sum, section) => sum + section.lessons, 0);
  const completedLessonsCount = course.sections.reduce(
    (sum, section) => sum + section.lessonsList.filter(l => l.isCompleted).length,
    0
  );
  const progressPercentage = Math.round((completedLessonsCount / totalLessons) * 100);

  return (
    <div className="min-h-screen ">
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900 line-clamp-1">{course.title}</h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-gray-600">by {course.instructor}</span>
                <div className="flex items-center gap-1">
                  <Progress value={progressPercentage} className="w-24 h-1.5" />
                  <span className="text-xs text-gray-600">{progressPercentage}%</span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <div className="relative bg-black aspect-video">
                {currentLesson ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="h-10 w-10 text-white ml-1" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">{currentLesson.title}</h3>
                      <p className="text-gray-400">Duration: {currentLesson.duration}</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400">Select a lesson to start learning</p>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" className="text-white hover:bg-white/20">
                      <Play className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Volume2 className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Settings className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>About This Course</CardTitle>
                  <Badge>{course.category}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{course.aboutDescription}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{course.duration}h</p>
                    <p className="text-sm text-gray-600">Duration</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{course.lessons}</p>
                    <p className="text-sm text-gray-600">Lessons</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{course.students}</p>
                    <p className="text-sm text-gray-600">Students</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900">{course.rating}</p>
                    <p className="text-sm text-gray-600">Rating</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What you'll learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.learningPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
                      {course.instructor.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{course.instructor}</h3>
                      <p className="text-sm text-gray-600 mb-2">{course.instructorTitle}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span>{course.instructorRating} rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{course.instructorStudents.toLocaleString()} students</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{course.instructorBio}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Course Content</CardTitle>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <span>{course.sections.length} sections</span>
                  <span>{totalLessons} lessons</span>
                  <span>{course.duration}h total</span>
                </div>
              </CardHeader>
              <CardContent className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                <div className="space-y-2">
                  {course.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="border rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection(sectionIndex)}
                        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                      >
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-sm text-gray-900">{section.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {section.lessons} lessons • {section.hours}h
                          </p>
                        </div>
                        {expandedSections.has(sectionIndex) ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>

                      {expandedSections.has(sectionIndex) && (
                        <div className="border-t">
                          {section.lessonsList.map(lesson => (
                            <button
                              key={lesson.id}
                              onClick={() => handleLessonClick(lesson)}
                              disabled={lesson.isLocked}
                              className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 ${
                                currentLesson?.id === lesson.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                              } ${lesson.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <div className="flex-shrink-0">
                                {lesson.isCompleted ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                                ) : lesson.isLocked ? (
                                  <Lock className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Play className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                                <p className="text-xs text-gray-500 mt-1">{lesson.duration}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">Resources</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {course.resources} downloadable resources
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Resources
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
