import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

// 🔹 Mock Data
const mockStats = {
  totalStudents: 14_230,
  totalTeachers: 942,
  totalCourses: 412,
  totalCampuses: 5,
};

const attendanceData = [
  { month: 'Jan', attendance: 76 },
  { month: 'Feb', attendance: 79 },
  { month: 'Mar', attendance: 81 },
  { month: 'Apr', attendance: 85 },
  { month: 'May', attendance: 83 },
  { month: 'Jun', attendance: 74 },
  { month: 'Jul', attendance: 68 },
  { month: 'Aug', attendance: 92 },
  { month: 'Sep', attendance: 94 },
  { month: 'Oct', attendance: 91 },
  { month: 'Nov', attendance: 87 },
  { month: 'Dec', attendance: 89 },
];

export function AdminDashboard({ user }) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 space-y-6 ">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-xs">Academic overview and student engagement metrics</p>
        </div>
       
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Students */}
        <Card
          className="hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer"
          // onClick={() => navigate('/dashboard/students')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Students</CardTitle>
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">+12.5% vs last year</p>
          </CardContent>
        </Card>

        {/* Teachers */}
        <Card
          className="hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer"
          // onClick={() => navigate('/dashboard/teachers')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Teachers</CardTitle>
            <div className="p-2 rounded-lg bg-green-100 text-green-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-4-4H12a4 4 0 0 0-4 4v2" />
                <circle cx="17" cy="7" r="4" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalTeachers}</div>
            <p className="text-xs text-yellow-600 mt-1">+3.2% growth</p>
          </CardContent>
        </Card>

        {/* Courses */}
        <Card
          className="hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer"
          // onClick={() => navigate('/dashboard/courses')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Courses</CardTitle>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4" />
                <path d="m16.2 7.8 2.1-2.1" />
                <path d="M18 12h-4" />
                <path d="m16.2 16.2 2.1 2.1" />
                <path d="M12 18v4" />
                <path d="m4.9 4.9 2.1 2.1" />
                <path d="M2 12h4" />
                <path d="m4.9 19.1-2.1 2.1" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalCourses}</div>
            <p className="text-xs text-blue-600 mt-1">All departments included</p>
          </CardContent>
        </Card>

        {/* Campuses */}
        <Card
          className="hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer"
          // onClick={() => navigate('/dashboard/campuses')}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Campuses</CardTitle>
            <div className="p-2 rounded-lg bg-orange-100 text-orange-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalCampuses}</div>
            <p className="text-xs text-gray-600 mt-1">Main + 4 satellite</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Chart */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Student Attendance Trend</CardTitle>
          <CardDescription className='text-xs'>Monthly average attendance rate across all programs</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={attendanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="8 8" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[60, 100]}
                ticks={[60, 70, 80, 90, 100]}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: 'Attendance (%)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#6b7280',
                  fontSize: 12,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
                labelStyle={{ fontWeight: 'bold' }}
                formatter={(value: number) => [`${value}%`, 'Attendance']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="attendance"
                name="Attendance Rate"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#1D4ED8', stroke: '#fff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      
    </div>
  );
}