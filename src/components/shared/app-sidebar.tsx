import * as React from 'react';
import {
  IconDashboard,
  IconUsers,
  IconBook,
  IconCalendarTime,
  IconClipboardList,
  IconFileCertificate,
  IconFileText,
  IconId,
  IconLayoutGrid,
  IconReport,
  IconSettings,
  IconSchool,
  IconBuildingBank,
  IconUser,
  IconBellRinging,
  IconBook2,
  IconCoin,
  IconDeviceDesktop,
  IconFileStack,
  IconFolder,
  IconHome,
  IconIdBadge2,
  IconListCheck,
  IconMessage,
  IconReceipt2,
  IconTruck,
  IconUserPlus,
  IconUsersGroup,
  IconWriting,
  IconHelp,
  IconSearch
} from '@tabler/icons-react';

import { NavMain } from './nav-main';
import { NavSecondary } from './nav-secondary';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import {
  BookOpen,
  Building,
  CalendarFold,
  ClipboardPlus,
  ContactRound,
  UserRoundSearch
} from 'lucide-react';

// Define the navigation structure
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  },

  navMain: [
    // === Dashboard ===
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard
    },
    {
      title: 'Campus',
      url: 'campus',
      icon: Building
    },
    {
      title: 'Intake',
      url: 'intake',
      icon: CalendarFold
    },
    {
      title: 'Course',
      url: 'course',
      icon: BookOpen
    },
    // {
    //   title: "University",
    //   url: "university",
    //   icon: Building ,
    // },
    {
      title: 'Staff',
      url: 'staff',
      icon: ContactRound
    },
    {
      title: 'Agent',
      url: 'agent',
      icon: UserRoundSearch
    },

    {
      title: 'Student',
      url: 'student',
      icon: UserRoundSearch
    },

    {
      title: 'Admission',
      icon: IconUserPlus,
      items: [
        { title: 'Applications', url: 'applicantions' },
        { title: 'New Registrations', url: '#' },
        { title: 'Student List', url: '#' },
        {
          title: 'Transfers',
          items: [
            { title: 'Transfer Out', url: '#' },
            { title: 'Transfer In', url: '#' }
          ]
        },
        { title: 'Status Types', url: '#' },
        { title: 'ID Cards', url: '#' },
        {
          title: 'Settings',
          items: [{ title: 'ID Card Settings', url: '#' }]
        }
      ]
    },

    // === Students ===
    {
      title: 'Students',
      icon: IconUsers,
      items: [
        {
          title: 'Attendances',
          items: [
            {
              title: 'Subject Attendances',
              url: '#'
            },
            {
              title: 'Attendance Report',
              url: '#'
            }
          ]
        },
        { title: 'Manage Leave', url: '#' },
        { title: 'Student Notes', url: '#' },
        {
          title: 'Enrollments',
          items: [
            { title: 'Single Enroll', url: '#' },
            { title: 'Group Enroll', url: '#' },
            { title: 'Course Add Drop', url: '#' },
            { title: 'Course Graduation', url: '#' }
          ]
        },
        { title: 'Alumni List', url: '#' }
      ]
    },

    // === Academic ===
    {
      title: 'Academic',
      icon: IconSchool,
      items: [
        { title: 'Faculties', url: '#' },
        { title: 'Programs', url: '#' },
        { title: 'Batches', url: '#' },
        { title: 'Sessions', url: '#' },
        { title: 'Semesters', url: '#' },
        { title: 'Sections', url: '#' },
        { title: 'Class Rooms', url: '#' },
        { title: 'Courses', url: '#' },
        { title: 'Enroll Course', url: '#' }
      ]
    },

    // === Routine ===
    {
      title: 'Routine',
      icon: IconCalendarTime,
      items: [
        { title: 'Manage Classes', url: '#' },
        { title: 'Class Schedules', url: '#' },
        { title: 'Manage Exams', url: '#' },
        { title: 'Teacher Routines', url: '#' },
        {
          title: 'Settings',
          items: [
            { title: 'Class Schedule', url: '#' },
            { title: 'Exam Schedule', url: '#' }
          ]
        }
      ]
    },

    // === Examinations ===
    {
      title: 'Examinations',
      icon: IconClipboardList,
      items: [
        { title: 'Exam Attendance', url: '#' },
        { title: 'Exam Mark Ledger', url: '#' },
        { title: 'Exam Result', url: '#' },
        { title: 'Course Mark Ledger', url: '#' },
        { title: 'Course Result', url: '#' },
        { title: 'Grading Systems', url: '#' },
        { title: 'Exam Types', url: '#' },
        { title: 'Admit Cards', url: '#' },
        {
          title: 'Settings',
          items: [
            { title: 'Admit Settings', url: '#' },
            {
              title: 'Mark Distribution',
              url: '#'
            }
          ]
        }
      ]
    },

    // === Study Material ===
    {
      title: 'Study Material',
      icon: IconBook,
      items: [
        { title: 'Assignment', url: '#' },
        { title: 'Content List', url: '#' },
        { title: 'Content Types', url: '#' }
      ]
    },

    // { title: "Fees Collection", url: "#", icon: IconCoin },
    // { title: "Human Resources", url: "#", icon: IconUsersGroup },
    // { title: "Staff Attendances", url: "#", icon: IconListCheck },
    // { title: "Leave Manager", url: "#", icon: IconWriting },
    // { title: "Accounts", url: "#", icon: IconBuildingBank },
    // { title: "Communicates", url: "#", icon: IconMessage },
    // { title: "Library", url: "#", icon: IconBook2 },
    // { title: "Inventory", url: "#", icon: IconFolder },
    // { title: "Hostel", url: "#", icon: IconHome },
    // { title: "Transports", url: "#", icon: IconTruck },
    // { title: "Front Desk", url: "#", icon: IconDeviceDesktop },
    // { title: "Transcripts", url: "#", icon: IconFileCertificate },
    // { title: "Reports", url: "#", icon: IconReport },
    {
      title: 'Settings',
      icon: IconSettings,
      items: [
        { title: 'Email', url: 'emails' },
        { title: 'Draft', url: 'drafts' },
      ]
    },
    { title: 'My Profile', url: '#', icon: IconUser }
  ],
  navSecondary: [
    { title: 'Help', url: '#', icon: IconHelp },
    { title: 'Search', url: '#', icon: IconSearch }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="w-60 min-w-64 max-w-[64] border-none "
    >
      <SidebarHeader className="flex h-14 items-center justify-center border-b border-gray-300">
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              // asChild
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <a href="#" className="flex items-center gap-2">
                <IconLayoutGrid className="!size-5 shrink-0 text-theme" />
                <span className="text-base font-semibold ">
                  University Management
                </span>
              </a>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-2">
        <NavMain items={data.navMain} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
