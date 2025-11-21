import { useEffect, useState } from 'react';
import { Plus, Pen, Settings, MoveLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import axiosInstance from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { DataTablePagination } from '@/components/shared/data-table-pagination';
import { BlinkingDots } from '@/components/shared/blinking-dots';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function InstructorPage() {
  const [instructors, setInstructors] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchData = async (page: number, limit: number, search: string = '') => {
    try {
      setInitialLoading(true);
      const response = await axiosInstance.get('/users', {
        params: {
          role: 'instructor',
          page,
          limit,
          ...(search ? { searchTerm: search } : {})
        }
      });
      setInstructors(response.data.data.result);
      setTotalPages(response.data.data.meta.totalPage);
    } catch (error: any) {
      console.error('Error fetching instructors:', error);
      toast({
        title: 'Error',
        description:
          error?.response?.data?.message || 'Failed to fetch instructors.',
        variant: 'destructive'
      });
    } finally {
      setInitialLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: boolean) => {
    try {
      const updatedStatus = status ? 'active' : 'block';
      await axiosInstance.patch(`/users/${id}`, { status: updatedStatus });

      setInstructors((prev) =>
        prev.map((inst) =>
          inst._id === id ? { ...inst, status: updatedStatus } : inst
        )
      );

      toast({ title: 'Instructor status updated successfully' });
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error?.response?.data?.message || 'Failed to update status.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchData(currentPage, entriesPerPage, searchTerm);
  }, [currentPage, entriesPerPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData(1, entriesPerPage, searchTerm);
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center py-6">
        <BlinkingDots size="large" color="bg-supperagent" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className='flex flex-row items-center gap-4'>
          <h1 className="text-2xl font-semibold">All Instructors</h1>
          <div className="flex items-center space-x-4">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by Name, Email"
              className="h-8 min-w-[300px]"
            />
            <Button
              onClick={handleSearch}
              size="sm"
              className="min-w-[100px] border-none bg-supperagent text-white hover:bg-supperagent/90"
            >
              Search
            </Button>
          </div>
        </div>

        <Button size="default" onClick={() => navigate(-1)} variant="outline">
          <MoveLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Instructors List</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-32 text-center">Status</TableHead>
                <TableHead className="w-32 text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {instructors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                    No instructors found
                  </TableCell>
                </TableRow>
              ) : (
                instructors.map((instructor) => (
                  <TableRow key={instructor._id}>
                    <TableCell>{instructor.name}</TableCell>
                    <TableCell>{instructor.email}</TableCell>
                    <TableCell>{instructor.phone || 'N/A'}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={instructor.status === 'active'}
                        onCheckedChange={(checked) =>
                          handleStatusChange(instructor._id, checked)
                        }
                        className="mx-auto"
                      />
                    </TableCell>
                    <TableCell className="space-x-1 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-supperagent text-white hover:bg-supperagent/90"
                        onClick={() => setEditingInstructor(instructor)}
                      >
                        <Pen className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {instructors.length > 40 && (
            <div className="mt-4">
              <DataTablePagination
                pageSize={entriesPerPage}
                setPageSize={setEntriesPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

