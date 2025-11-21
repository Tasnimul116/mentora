import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MoveLeft,
  Upload,
  Video,
  FileText,
  HelpCircle,
  Link as LinkIcon,
  X,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  AlertCircle,
  Settings,
  MinusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axiosInstance from '@/lib/axios';
import Select from 'react-select';
import { useToast } from '@/components/ui/use-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BlinkingDots } from '@/components/shared/blinking-dots';

// --- Interfaces ---
interface LessonOption {
  value: string;
  label: string;
}

interface QuizQuestion {
  _id?: string;
  tempId?: string;
  question: string;
  type: 'mcq' | 'short';
  options?: string[];
  correctAnswers?: string[];
}

interface QuizConfig {
  totalMarks: number;
  passMarks: number;
}

interface FormData {
  title: string;
  videoUrl: string;
  content: string;
  questions: QuizQuestion[];
  quizConfig?: QuizConfig;
  additionalFiles?: string[];
  additionalNote?: string;
}

interface LessonData {
  _id: string;
  title: string;
  type: 'video' | 'doc' | 'quiz';
  videoUrl?: string;
  content?: string;
  questions?: QuizQuestion[];
  quizConfig?: QuizConfig;
  prerequisiteLesson?: string;
  additionalFiles?: string[];
  additionalNote?: string;
}

// --- DnD Logic (Unchanged) ---
const ItemType = 'QUESTION';

interface QuestionItemProps {
  id: string;
  index: number;
  moveQuestion: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
  onDelete: () => void;
}

const QuestionItem = ({
  id,
  index,
  moveQuestion,
  children,
  onDelete
}: QuestionItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemType,
    collect(monitor) {
      return { handlerId: monitor.getHandlerId() };
    },
    hover(item: any, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as any).y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveQuestion(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => ({ id, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() })
  });
  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={`group relative rounded-xl border border-gray-200 bg-gray-50/50 p-4 pt-8 transition-all hover:border-blue-300 ${isDragging ? 'bg-blue-50 ring-2 ring-blue-400' : ''}`}
    >
      <div className="absolute right-1 top-1  z-10 opacity-100 transition-opacity">
        <Button
          type="button"
          onClick={onDelete}
          className=" bg-white text-red-500 shadow-none  hover:bg-gray-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div className="mr-4 flex gap-4">
        <div className="mt-2 cursor-move text-gray-300 hover:text-gray-500">
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex-1 space-y-4">{children}</div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function EditLessonPage() {
  const navigate = useNavigate();
  const { id, cid, mid } = useParams(); // Add lesson ID parameter

  // State
  const [loading, setLoading] = useState(false);
  const [lessonType, setLessonType] = useState<'video' | 'doc' | 'quiz'>(
    'video'
  );
  const [videoMethod, setVideoMethod] = useState<'link' | 'upload'>('link');
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Prerequisite State
  const [prerequisiteLoading, setPrerequisiteLoading] = useState(false);
  const [lessonOptions, setLessonOptions] = useState<LessonOption[]>([]);
  const [selectedPrerequisite, setSelectedPrerequisite] =
    useState<LessonOption | null>(null);

  const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
  const [additionalNote, setAdditionalNote] = useState<string>('');
  const { toast } = useToast();

  // Updated Initial State
  const [formData, setFormData] = useState<FormData>({
    title: '',
    videoUrl: '',
    content: '',
    questions: [],
    quizConfig: {
      totalMarks: 0,
      passMarks: 0,
    }
  });

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch existing lesson data
  useEffect(() => {
    const fetchLessonData = async () => {
      if (!id) return;
      
      try {
        const response = await axiosInstance.get(`/course-lesson/${id}`);
        const lesson: LessonData = response.data.data;

        // Set form data based on lesson type
        setLessonType(lesson.type);
        
        // Set main form fields
        setFormData({
          title: lesson.title || '',
          videoUrl: lesson.videoUrl || '',
          content: lesson.content || '',
          questions: lesson.questions || [],
          quizConfig: lesson.quizConfig || {
            totalMarks: 0,
            passMarks: 0,
          }
        });

        // Set additional note
        setAdditionalNote(lesson.additionalNote || '');

        // Set video preview if it's a video lesson
        if (lesson.type === 'video' && lesson.videoUrl) {
          setVideoPreview(lesson.videoUrl);
        }

        // Set prerequisite if exists
        if (lesson.prerequisiteLesson) {
          const selectedOption = lessonOptions.find(opt => opt.value === lesson.prerequisiteLesson);
          setSelectedPrerequisite(selectedOption || null);
        }

        setInitialDataLoaded(true);
      } catch (error) {
        console.error('Failed to fetch lesson data', error);
        toast({
          title: 'Error',
          description: 'Failed to load lesson data',
          variant: 'destructive'
        });
        navigate(-1);
      }
    };

    if (id) {
      fetchLessonData();
    }
  }, [id, lessonOptions, navigate, toast]);

  // Fetch Prerequisites
  useEffect(() => {
    const fetchLessons = async () => {
      if (!mid) return;
      setPrerequisiteLoading(true);
      try {
        const response = await axiosInstance.get(
          `/course-lesson?moduleId=${mid}&limit=all`
        );
        const lessons = response.data.data.result;
        const options = lessons.map((lesson: any) => ({
          value: lesson._id,
          label: lesson.title
        }));
        setLessonOptions(options);
      } catch (error) {
        console.error('Failed to fetch prerequisite lessons', error);
      } finally {
        setPrerequisiteLoading(false);
      }
    };
    fetchLessons();
  }, [mid]);

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanedQuestions = formData.questions.map(
      ({ tempId, ...rest }) => rest
    );

    // Prepare payload
    const payload: any = {
      ...formData,
      moduleId: mid,
      questions: lessonType === 'quiz' ? cleanedQuestions : undefined,
      quizConfig: lessonType === 'quiz' ? formData.quizConfig : undefined,
      type: lessonType, // Use the fixed lessonType
      prerequisiteLesson: selectedPrerequisite?.value || null,
      additionalNote: additionalNote || undefined,
    };

    // Handle file uploads if any
    if (additionalFiles.length > 0) {
      // In a real app, you would upload files first and get URLs
      // For now, we'll just pass the file objects
      payload.additionalFiles = additionalFiles.map(f => f.name); // Placeholder
    }

    try {
      // Use PUT method for updating
      await axiosInstance.put(`/course-lesson/${id}`, payload);

      // On success
      toast({
        title: 'Lesson Updated',
        description: 'Your lesson has been successfully updated.'
      });

      navigate(-1);
    } catch (error) {
      // On error
      const errorMessage =
        error?.response?.data?.message ||
        'Something went wrong, please try again.';

      toast({
        title: errorMessage,
        variant: 'destructive'
      });

      setLoading(false);
    }
  };

  // --- Video Handler ---
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      window.alert('Please select a valid video file!');
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      window.alert('File size exceeds 100MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setVideoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setFormData((prev) => ({
          ...prev,
          videoUrl: URL.createObjectURL(file)
        }));
        setUploading(false);
      }
    }, 100);
  };

  // --- Quiz Questions Logic ---
  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          tempId: `new-${Date.now()}`,
          question: '',
          type: 'mcq',
          options: ['', '', '', ''],
          correctAnswers: []
        }
      ]
    }));
  };

  const moveQuestion = useCallback((dragIndex: number, hoverIndex: number) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      const [draggedItem] = newQuestions.splice(dragIndex, 1);
      newQuestions.splice(hoverIndex, 0, draggedItem);
      return { ...prev, questions: newQuestions };
    });
  }, []);

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...formData.questions];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'type' && value === 'short') {
      updated[index].options = undefined;
      updated[index].correctAnswers = undefined;
    }
    if (field === 'type' && value === 'mcq' && !updated[index].options) {
      updated[index].options = ['', '', '', ''];
      updated[index].correctAnswers = [];
    }
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  const updateQuestionOption = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    const updated = [...formData.questions];
    if (updated[qIndex].options) {
      updated[qIndex].options![optIndex] = value;
      setFormData((prev) => ({ ...prev, questions: updated }));
    }
  };

  const toggleCorrectAnswer = (qIndex: number, optIndex: number) => {
    const updated = [...formData.questions];
    const currentAnswers = updated[qIndex].correctAnswers || [];
    const optionValue =
      updated[qIndex].options?.[optIndex] || `Option ${optIndex + 1}`;

    if (currentAnswers.includes(optionValue)) {
      updated[qIndex].correctAnswers = currentAnswers.filter(
        (a) => a !== optionValue
      );
    } else {
      updated[qIndex].correctAnswers = [...currentAnswers, optionValue];
    }
    setFormData((prev) => ({ ...prev, questions: updated }));
  };

  // --- Quiz Config Logic ---
  const handleQuizConfigChange = (field: keyof QuizConfig, value: any) => {
    setFormData((prev) => ({
      ...prev,
      quizConfig: { ...prev.quizConfig!, [field]: value }
    }));
  };

  // --- Lesson Type Options ---
  const lessonTypeOptions = [
    { value: 'video', label: 'Video Lesson' },
    { value: 'doc', label: 'Text Lesson' },
    { value: 'quiz', label: 'Quiz Assessment' }
  ];

  // --- Quiz Config Section (only for quiz type) ---
  const QuizConfigSection = () => (
    <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Settings className="h-5 w-5 text-supperagent" />
        <h3 className="text-sm font-semibold text-gray-900">
          Quiz Configuration
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label className="mb-1.5 block text-xs font-medium text-gray-600">
            Total Marks
          </Label>
          <Input
            type="number"
            min="0"
            value={formData.quizConfig?.totalMarks}
            onChange={(e) =>
              handleQuizConfigChange(
                'totalMarks',
                Number(e.target.value)
              )
            }
            className="bg-white"
          />
        </div>
        <div>
          <Label className="mb-1.5 block text-xs font-medium text-gray-600">
            Pass Marks
          </Label>
          <Input
            type="number"
            min="0"
            value={formData.quizConfig?.passMarks}
            onChange={(e) =>
              handleQuizConfigChange(
                'passMarks',
                Number(e.target.value)
              )
            }
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );

  // Styles
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderColor: state.isFocused ? '#2563eb' : '#e5e7eb',
      borderRadius: '0.5rem',
      padding: '2px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(37, 99, 235, 0.2)' : 'none',
      '&:hover': { borderColor: '#d1d5db' }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#2563eb'
        : state.isFocused
          ? '#eff6ff'
          : 'white',
      color: state.isSelected ? 'white' : '#1f2937'
    })
  };

  if (!initialDataLoaded && id) {
    return  <div className="flex justify-center py-6">
                    <BlinkingDots size="large" color="bg-supperagent" />
                  </div>;
  }
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Lesson</h1>
          </div>
          <Button onClick={() => navigate(-1)} variant="outline">
            <MoveLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {/* LEFT COLUMN: MAIN CONTENT */}
          <div className="space-y-6 lg:col-span-2">
            {/* Lesson Type Display (Fixed when editing) */}
            <div className="space-y-2 ">
              <Label className="text-sm font-semibold text-gray-900">
                Lesson Type
              </Label>
              <div className="rounded-md  bg-gray-100 px-4 py-2.5 text-gray-700 border-2 border-gray-300">
                {lessonTypeOptions.find(opt => opt.value === lessonType)?.label}
              </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="overflow-hidden rounded-xl border-2 border-gray-300 bg-white shadow-sm">
              <div className="space-y-6 p-6">
                {/* Title Input */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">
                    Lesson Title
                  </Label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Introduction to Advanced React Patterns"
                    required
                    className="w-full border border-gray-200 px-4 py-2.5 text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Quiz Config Section - Only for Quiz Type */}
                {lessonType === 'quiz' && <QuizConfigSection />}

                {/* Video Content */}
                {lessonType === 'video' && (
                  <div className="space-y-4 duration-300 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-900">
                        Video Source
                      </Label>
                      <div className="flex rounded-lg border-2 border-gray-300 bg-gray-200 p-1">
                        <button
                          type="button"
                          onClick={() => setVideoMethod('link')}
                          className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${videoMethod === 'link' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          External Link
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoMethod('upload')}
                          className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${videoMethod === 'upload' ? 'bg-white text-gray-900 shadow' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                          Direct Upload
                        </button>
                      </div>
                    </div>

                    {videoMethod === 'link' ? (
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                        <Input
                          type="url"
                          value={formData.videoUrl}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              videoUrl: e.target.value
                            })
                          }
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="group relative cursor-pointer rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-all hover:border-blue-500 hover:bg-blue-50/50"
                      >
                        {videoPreview ? (
                          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
                            <video
                              src={videoPreview}
                              className="h-full w-full object-contain"
                              controls
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setVideoPreview(null);
                                setFormData((prev) => ({
                                  ...prev,
                                  videoUrl: ''
                                }));
                              }}
                              className="absolute right-2 top-2 rounded-full bg-black/50 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center space-y-3 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110">
                              <Upload className="h-6 w-6 text-supperagent" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Click to upload video
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                MP4, WebM or Ogg (Max 100MB)
                              </p>
                            </div>
                          </div>
                        )}
                        {uploading && (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl bg-white/90 backdrop-blur-[1px]">
                            <div className="mb-3 h-16 w-16 animate-spin rounded-full border-4 border-blue-100 border-t-supperagent"></div>
                            <p className="text-sm font-medium text-supperagent">
                              Uploading {uploadProgress}%
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleVideoUpload}
                          accept="video/*"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Document Content */}
                {lessonType === 'doc' && (
                  <div className="space-y-2 duration-300 animate-in fade-in">
                    <label className="text-sm font-semibold text-gray-900">
                      Content
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(value) =>
                        setFormData((prev) => ({ ...prev, content: value }))
                      }
                      placeholder="Write your lesson content here..."
                      className="h-[300px] pb-12  "
                    />
                  </div>
                )}

                {/* Quiz Content */}
                {lessonType === 'quiz' && (
                  <div className="space-y-8 duration-300 animate-in fade-in">
                    {/* --- Existing Questions Builder --- */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <h3 className="text-sm font-semibold text-gray-900">
                        Questions Builder
                      </h3>
                      <Button
                        type="button"
                        onClick={addQuestion}
                        size="sm"
                        className="bg-supperagent text-white hover:bg-supperagent"
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Question
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {formData.questions.length === 0 && (
                        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                          <HelpCircle className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                          <p className="text-sm text-gray-500">
                            No questions added yet. Click "Add Question" to
                            start.
                          </p>
                        </div>
                      )}

                      {formData.questions.map((q, qIndex) => (
                        <QuestionItem
                          key={q.tempId || `q-${qIndex}`}
                          id={q.tempId || `q-${qIndex}`}
                          index={qIndex}
                          moveQuestion={moveQuestion}
                          onDelete={() =>
                            setFormData((prev) => ({
                              ...prev,
                              questions: prev.questions.filter(
                                (_, i) => i !== qIndex
                              )
                            }))
                          }
                        >
                          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="md:col-span-3">
                              <input
                                type="text"
                                value={q.question}
                                onChange={(e) =>
                                  updateQuestion(
                                    qIndex,
                                    'question',
                                    e.target.value
                                  )
                                }
                                placeholder="Enter the question text..."
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div className="md:col-span-1">
                              <select
                                value={q.type}
                                onChange={(e) =>
                                  updateQuestion(qIndex, 'type', e.target.value)
                                }
                                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                              >
                                <option value="mcq">MCQ</option>
                                <option value="short">Short Answer</option>
                              </select>
                            </div>
                          </div>

                          {q.type === 'mcq' && (
                            <div className="space-y-2 pl-1">
                              <p className="mb-2 text-xs font-medium text-gray-500">
                                Answer Options (Check correct ones)
                              </p>
                              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {q.options?.map((opt, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className="flex items-center gap-2"
                                  >
                                    <div
                                      onClick={() =>
                                        toggleCorrectAnswer(qIndex, optIndex)
                                      }
                                      className={`flex h-5 w-5 cursor-pointer items-center justify-center rounded border transition-colors ${q.correctAnswers?.includes(opt) ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 bg-white hover:border-gray-400'}`}
                                    >
                                      {q.correctAnswers?.includes(opt) && (
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                      )}
                                    </div>
                                    <Input
                                      type="text"
                                      value={opt}
                                      onChange={(e) =>
                                        updateQuestionOption(
                                          qIndex,
                                          optIndex,
                                          e.target.value
                                        )
                                      }
                                      placeholder={`Option ${optIndex + 1}`}
                                      className={`flex-1 rounded-md border px-3 py-1.5 text-sm outline-none ${q.correctAnswers?.includes(opt) ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {q.type === 'short' && (
                            <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-3">
                              <AlertCircle className="mt-0.5 h-5 w-5 text-supperagent" />
                              <div>
                                <p className="text-sm font-medium text-supperagent">
                                  Manual Grading Required
                                </p>
                                <p className="mt-1 text-xs text-supperagent">
                                  Short questions do not have a pre-defined
                                  answer here. Instructors will score this
                                  question manually after submission.
                                </p>
                              </div>
                            </div>
                          )}
                        </QuestionItem>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SETTINGS */}
          <div className="space-y-6">
            <div className="sticky top-6 rounded-xl border-2 border-gray-300 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Lesson Settings
              </h3>
              <div className="space-y-4">
              

                {/* Additional Files */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Additional Resources
                  </label>
                  <div className="space-y-2">
                    {additionalFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-2"
                      >
                        <span className="max-w-[150px] truncate text-xs text-gray-700">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setAdditionalFiles((f) =>
                              f.filter((_, i) => i !== idx)
                            )
                          }
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    <div
                      onClick={() => additionalFileInputRef.current?.click()}
                      className="flex cursor-pointer items-center justify-center rounded border border-dashed border-gray-300 py-3 hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Plus className="h-3 w-3" /> Add File
                      </span>
                    </div>
                    <input
                      type="file"
                      ref={additionalFileInputRef as any}
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files)
                          setAdditionalFiles([
                            ...additionalFiles,
                            ...Array.from(e.target.files)
                          ]);
                      }}
                      multiple
                    />
                  </div>
                </div>

                {/* Additional Note - ReactQuill */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    Additional Note
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={additionalNote}
                    onChange={setAdditionalNote}
                    placeholder="Add additional notes for this lesson..."
                    className="h-[250px] pb-16"
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-supperagent hover:bg-supperagent/90"
                >
                  {loading ? 'Saving...' : 'Update Lesson'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DndProvider>
  );
}

// Helper ref for additional files to work without redefining component
const additionalFileInputRef = { current: null };