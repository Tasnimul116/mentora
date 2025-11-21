// import { useEffect, useState } from 'react';
// import {
//   Plus,
//   Pen,
//   MoveLeft,
//   Video,
//   FileText,
//   HelpCircle,
//   Search
// } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from '@/components/ui/table';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger
// } from '@/components/ui/tooltip';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Badge } from '@/components/ui/badge';
// import { BlinkingDots } from '@/components/shared/blinking-dots';
// import axiosInstance from '@/lib/axios';
// import { Input } from '@/components/ui/input';
// import { DataTablePagination } from '@/components/shared/data-table-pagination';

// export default function LessonsPage() {
//   const [lessons, setLessons] = useState<any>([]);
//   const [loading, setLoading] = useState(true);
//   const [moduleName, setModuleName] = useState('');
//   const navigate = useNavigate();
//   const { cid, mid } = useParams();
//   const [moduleId, setModuleId] = useState('');
//   const [courseId, setCourseId] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [entriesPerPage, setEntriesPerPage] = useState(100);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     if (mid) {
//       setModuleId(mid);
//       setCourseId(cid || '');
//       fetchLessons(currentPage, entriesPerPage, searchTerm);
//       fetchModule();
//     }
//   }, [currentPage, entriesPerPage, mid]);

//   const fetchModule = async () => {
//     try {
//       const response = await axiosInstance.get(`/course-modules/${mid}`);
//       if (response.data?.success && response.data.data) {
//         setModuleName(response.data.data.title);
//       }
//     } catch (error) {
//       console.error('Error fetching module:', error);
//     }
//   };

//   const fetchLessons = async (
//     page: number,
//     entriesPerPage: number,
//     searchTerm = ''
//   ) => {
//     setLoading(true);
//     try {
//       const response = await axiosInstance.get(
//         `/course-lesson?moduleId=${mid}`,
//         {
//           params: {
//             page,
//             limit: entriesPerPage,
//             ...(searchTerm ? { searchTerm } : {})
//           }
//         }
//       );
//       if (response.data?.success) {
//         setLessons(response.data.data.result);
//         setTotalPages(response.data.data.meta.totalPage);
//       } else {
//         setLessons([]);
//       }
//     } catch (error) {
//       console.error('Error fetching lessons:', error);
//       setLessons([]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const handleSearch = () => {
//     fetchLessons(currentPage, entriesPerPage, searchTerm);
//   };
//   const getLessonIcon = (type: string) => {
//     switch (type) {
//       case 'video':
//         return <Video className="h-4 w-4" />;
//       case 'doc':
//         return <FileText className="h-4 w-4" />;
//       case 'quiz':
//         return <HelpCircle className="h-4 w-4" />;
//       default:
//         return <FileText className="h-4 w-4" />;
//     }
//   };

//   const getLessonTypeBadge = (type: string) => {
//     const variants: any = {
//       video: 'default',
//       doc: 'default',
//       quiz: 'default'
//     };
//     return (
//       <Badge variant={variants[type] || 'default'}>
//         {type.charAt(0).toUpperCase() + type.slice(1)}
//       </Badge>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <div className="flex flex-row items-center gap-4">
//             <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
//             <div className="flex items-center space-x-4">
//               <Input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search lesson..."
//                 className="h-8 w-[200px]"
//               />
//               <Button
//                 onClick={handleSearch}
//                 size="default"
//                 className="h-8 bg-supperagent px-4 hover:bg-supperagent/90"
//               >
//                 <Search className="mr-2 h-4 w-4" />
//                 Search
//               </Button>
//             </div>
//           </div>
//           {moduleName && (
//             <p className="mt-2 text-sm text-gray-600">
//               Module: <span className="font-semibold">{moduleName}</span>
//             </p>
//           )}
//         </div>
//         <div className="flex flex-row items-center gap-4">
//           <Button size="default" onClick={() => navigate(-1)} variant="outline">
//             <MoveLeft className="mr-2 h-4 w-4" />
//             Back
//           </Button>
//           <Button
//             size="default"
//             onClick={() => navigate(`create`)}
//             className="bg-supperagent hover:bg-supperagent/90"
//             disabled={!mid}
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             New Lesson
//           </Button>
//         </div>
//       </div>

//       <Card>
//         <CardContent className="pt-4">
//           {loading ? (
//             <div className="flex justify-center py-6">
//               <BlinkingDots size="large" color="bg-supperagent" />
//             </div>
//           ) : lessons.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-12 text-gray-500">
//               <FileText className="mb-4 h-12 w-12 text-gray-400" />
//               <p className="text-lg">No lessons found.</p>
//               <Button
//                 onClick={() =>
//                   navigate(`create?module=${moduleId}&course=${courseId}`)
//                 }
//                 className="mt-4 bg-supperagent hover:bg-supperagent/90"
//                 disabled={!mid}
//               >
//                 Create your first lesson
//               </Button>
//             </div>
//           ) : (
//             <Table className="">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Lesson Title</TableHead>
//                   <TableHead>Type</TableHead>
//                   <TableHead className="text-right">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {lessons.map((lesson: any, index: number) => (
//                   <TableRow key={lesson._id}>
//                     <TableCell className="font-medium">
//                       <div className="flex items-center gap-2">
//                         {/* {getLessonIcon(lesson.type)} */}
//                         {lesson.title}
//                       </div>
//                     </TableCell>
//                     <TableCell>{getLessonTypeBadge(lesson.type)}</TableCell>
//                     <TableCell className="text-center">
//                       <div className="flex items-center justify-end gap-2">
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <Button
//                                 variant="default"
//                                 size="icon"
//                                 className="h-8 w-8"
//                                 onClick={() => navigate(`edit/${lesson._id}`)}
//                               >
//                                 <Pen className="h-4 w-4" />
//                               </Button>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p>Edit Lesson</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}

//           {lessons.length > 40 && (
//             <DataTablePagination
//               pageSize={entriesPerPage}
//               setPageSize={setEntriesPerPage}
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={setCurrentPage}
//             />
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }



import { useEffect, useState, useRef } from "react";
import {
  Plus,
  Pen,
  MoveLeft,
  Video,
  FileText,
  HelpCircle,
  Search,
  Move,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BlinkingDots } from "@/components/shared/blinking-dots";
import axiosInstance from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { DataTablePagination } from "@/components/shared/data-table-pagination";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [moduleName, setModuleName] = useState("");
  const navigate = useNavigate();
  const { cid, mid } = useParams();
  const [moduleId, setModuleId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (mid) {
      setModuleId(mid);
      setCourseId(cid || "");
      fetchLessons(currentPage, entriesPerPage, searchTerm);
      fetchModule();
    }
  }, [currentPage, entriesPerPage, mid]);

  const fetchModule = async () => {
    try {
      const response = await axiosInstance.get(`/course-modules/${mid}`);
      if (response.data?.success && response.data.data) {
        setModuleName(response.data.data.title);
      }
    } catch (error) {
      console.error("Error fetching module:", error);
    }
  };

  const fetchLessons = async (page: number, entriesPerPage: number, searchTerm = "") => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/course-lesson?moduleId=${mid}&fields=title,type,index`, {
        params: {
          page,
          limit: entriesPerPage,
          ...(searchTerm ? { searchTerm } : {}),
        },
      });

      if (response.data?.success) {
        // Sort lessons by index
        const sorted = response.data.data.result.sort((a: any, b: any) => a.index - b.index);
        setLessons(sorted);
        setTotalPages(response.data.data.meta.totalPage);
      } else {
        setLessons([]);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
      setLessons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchLessons(currentPage, entriesPerPage, searchTerm);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "doc":
        return <FileText className="h-4 w-4" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getLessonTypeBadge = (type: string) => {
    return (
      <Badge variant="default">
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  // ----------------------------------------
  // 🔥 DRAG AND DROP LOGIC
  // ----------------------------------------

  const moveRow = (fromIndex: number, toIndex: number) => {
    const updated = [...lessons];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);

    // update index number
    const reIndexed = updated.map((lesson, i) => ({
      ...lesson,
      index: i + 1,
    }));

    setLessons(reIndexed);
    saveNewOrder(reIndexed);
  };

  const saveNewOrder = async (updatedLessons: any[]) => {
    try {
      await axiosInstance.patch(`/course-lesson/reorder/${mid}`, {
        lessons: updatedLessons.map((l) => ({
          id: l._id,
          index: l.index,
        })),
      });
    } catch (error) {
      console.error("Error saving order:", error);
    }
  };

  // ----------------------------------------
  // 🔥 ROW COMPONENT WITH DRAG HANDLER
  // ----------------------------------------
  const DraggableRow = ({ lesson, index }: any) => {
    const ref = useRef<any>(null);
    const ITEM_TYPE = "lesson";

    const [, drop] = useDrop({
      accept: ITEM_TYPE,
      hover: (item: any) => {
        if (item.index !== index) {
          moveRow(item.index, index);
          item.index = index;
        }
      },
    });

    const [{ isDragging }, drag] = useDrag({
      type: ITEM_TYPE,
      item: { id: lesson._id, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    drag(drop(ref));

    return (
      <TableRow
        ref={ref}
        style={{ opacity: isDragging ? 0.4 : 1, cursor: "grab" }}
      >
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 text-gray-400" />
            {lesson.title}
          </div>
        </TableCell>

        <TableCell>{getLessonTypeBadge(lesson.type)}</TableCell>

        <TableCell className="text-right">
          <Button
            variant="default"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`edit/${lesson._id}`)}
          >
            <Pen className="h-4 w-4" />
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex flex-row items-center gap-4">
              <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
              <div className="flex items-center space-x-4">
                <Input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search lesson..."
                  className="h-8 w-[200px]"
                />
                <Button
                  onClick={handleSearch}
                  size="default"
                  className="h-8 bg-supperagent px-4 hover:bg-supperagent/90"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
            {moduleName && (
              <p className="mt-2 text-sm text-gray-600">
                Module: <span className="font-semibold">{moduleName}</span>
              </p>
            )}
          </div>

          <div className="flex flex-row items-center gap-4">
            <Button size="default" onClick={() => navigate(-1)} variant="outline">
              <MoveLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              size="default"
              onClick={() => navigate(`create`)}
              className="bg-supperagent hover:bg-supperagent/90"
              disabled={!mid}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Lesson
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <BlinkingDots size="large" color="bg-supperagent" />
              </div>
            ) : lessons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FileText className="mb-4 h-12 w-12 text-gray-400" />
                <p className="text-lg">No lessons found.</p>
                <Button
                  onClick={() =>
                    navigate(`create?module=${moduleId}&course=${courseId}`)
                  }
                  className="mt-4 bg-supperagent hover:bg-supperagent/90"
                  disabled={!mid}
                >
                  Create your first lesson
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {lessons.map((lesson: any, index: number) => (
                    <DraggableRow key={lesson._id} lesson={lesson} index={index} />
                  ))}
                </TableBody>
              </Table>
            )}

            {lessons.length > 40 && (
              <DataTablePagination
                pageSize={entriesPerPage}
                setPageSize={setEntriesPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DndProvider>
  );
}
