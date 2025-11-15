export interface Lesson {
  id: number;
  title: string;
  duration: string;
  videoUrl?: string;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface CourseSection {
  title: string;
  lessons: number;
  hours: number;
  lessonsList: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  instructor: string;
  instructorTitle: string;
  instructorRating: number;
  instructorStudents: number;
  instructorBio: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  students: number;
  duration: number;
  lessons: number;
  resources: number;
  learningPoints: string[];
  requirements: string[];
  aboutDescription: string;
  sections: CourseSection[];
}

export interface EnrolledCourse extends Course {
  progress: number;
  completedLessons: number;
  lastAccessed: Date;
  currentLesson?: number;
}

export const courses: Course[] = [
  {
    id: 1,
    title: 'Mobile App Development The Complete Guide',
    description: 'Learn UIKIT, JavaScript and web programming. HTML development | React and Deployment | Query',
    category: 'Mobile Development',
    image: '/mobileapp.png',
    instructor: 'Kathryn Murphy',
    instructorTitle: 'Senior Developer',
    instructorRating: 4.8,
    instructorStudents: 15400,
    instructorBio: 'With over 10 years of experience in mobile app development, Kathryn Murphy brings practical, industry-level expertise to every course.',
    price: 89.99,
    originalPrice: 248.00,
    rating: 4.3,
    reviews: 1200,
    students: 229,
    duration: 31,
    lessons: 17,
    resources: 40,
    learningPoints: [
      'Prepare for becoming a Professional Front-End Developer',
      'Syntax of Code Optimized to Connect and interact with web',
      'Understand and use real time UI Engaging with JavaScript',
      'CSS Class Designing with JavaScript',
      'Learn Database Configurations with JavaScript',
      'Complete Web Development with React',
    ],
    requirements: [
      'Have an internet connection (or at least working internet)',
      'It is highly recommended that you download the free Firebug text editor',
      'It is recommended that you download the free Firefox text editor',
    ],
    aboutDescription: 'This comprehensive guide covers everything you need to know about mobile app development. From basic concepts to advanced techniques, you\'ll learn how to build professional-grade applications. Explore different programming languages, frameworks, and best practices used by leading companies.',
    sections: [
      {
        title: 'Program Information 2023/2024 Edition',
        lessons: 3,
        hours: 2,
        lessonsList: [
          { id: 101, title: 'Welcome & Course Overview', duration: '15:30', isCompleted: true },
          { id: 102, title: 'Setting Up Your Environment', duration: '45:10', isCompleted: true },
          { id: 103, title: 'How to Get Help', duration: '10:00', isCompleted: false },
        ]
      },
      {
        title: 'About This Course',
        lessons: 1,
        hours: 0.5,
        lessonsList: [
          { id: 104, title: 'Course Goals and Objectives', duration: '20:00', isCompleted: false },
        ]
      },
      {
        title: 'Real-Oriented Structures',
        lessons: 3,
        hours: 1.5,
        lessonsList: [
          { id: 105, title: 'Understanding OOP', duration: '30:00', isCompleted: false },
          { id: 106, title: 'Classes and Objects', duration: '30:00', isCompleted: false, isLocked: true },
          { id: 107, title: 'Inheritance and Polymorphism', duration: '30:00', isCompleted: false, isLocked: true },
        ]
      },
      {
        title: 'HTML Foundations: Building The Foundation',
        lessons: 2,
        hours: 1,
        lessonsList: [
          { id: 108, title: 'HTML Tags and Structure', duration: '30:00', isCompleted: false, isLocked: true },
          { id: 109, title: 'Forms and Inputs', duration: '30:00', isCompleted: false, isLocked: true },
        ]
      },
      {
        title: 'Certified HTML Foundations 2023/2024',
        lessons: 5,
        hours: 3,
        lessonsList: [
          { id: 110, title: 'Semantic HTML', duration: '45:00', isCompleted: false, isLocked: true },
          { id: 111, title: 'Accessibility (a11y)', duration: '45:00', isCompleted: false, isLocked: true },
          { id: 112, title: 'HTML5 APIs', duration: '30:00', isCompleted: false, isLocked: true },
          { id: 113, title: 'Media Elements', duration: '30:00', isCompleted: false, isLocked: true },
          { id: 114, title: 'Project: Build a Blog Layout', duration: '30:00', isCompleted: false, isLocked: true },
        ]
      },
      {
        title: 'Your Development Toolbox',
        lessons: 3,
        hours: 2,
        lessonsList: [
          { id: 115, title: 'Using VS Code', duration: '45:00', isCompleted: false, isLocked: true },
          { id: 116, title: 'Git and GitHub Basics', duration: '45:00', isCompleted: false, isLocked: true },
          { id: 117, title: 'Browser DevTools', duration: '30:00', isCompleted: false, isLocked: true },
        ]
      },
      {
        title: 'JavaScript Specialist',
        lessons: 5,
        hours: 2.5,
        lessonsList: [
          { id: 118, title: 'Variables and Data Types', duration: '30:00', isCompleted: false, isLocked: true },
          { id: 119, title: 'Functions and Scope', duration: '30:00', isCompleted: false, isLocked: true },
          { id: 120, title: 'DOM Manipulation', duration: '30:00', isCompleted: false, isLocked: true },
          { id: 121, title: 'Events', duration: '30:00', isCompleted: false, isLocked: true },
          { id: 122, title: 'ES6+ Features', duration: '30:00', isCompleted: false, isLocked: true },
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Web Development Bootcamp 2024',
    description: 'Complete web development course covering HTML, CSS, JavaScript, React, Node.js and more',
    category: 'Web Development',
    image: '/javascript-programming-web-development.png',
    instructor: 'John Smith',
    instructorTitle: 'Full Stack Developer',
    instructorRating: 4.7,
    instructorStudents: 8900,
    instructorBio: 'John Smith is a seasoned full-stack developer with a passion for teaching. With 8 years in the industry, he has worked with Fortune 500 companies.',
    price: 99.99,
    originalPrice: 199.99,
    rating: 4.5,
    reviews: 850,
    students: 150,
    duration: 45,
    lessons: 25,
    resources: 60,
    learningPoints: [
      'Master HTML5 and CSS3 fundamentals',
      'Build responsive websites with modern techniques',
      'Learn JavaScript from basics to advanced',
      'Create dynamic web apps with React',
      'Understand backend development with Node.js',
      'Deploy applications to production',
    ],
    requirements: [
      'A computer with internet connection',
      'No prior programming experience needed',
      'Willingness to learn and practice',
    ],
    aboutDescription: 'This bootcamp-style course takes you from absolute beginner to job-ready web developer. Learn by building real projects and get hands-on experience with the latest technologies.',
    sections: [
      {
        title: 'Introduction to Web Development',
        lessons: 4,
        hours: 3,
        lessonsList: [
          { id: 201, title: 'What is Web Development?', duration: '25:00', isCompleted: false },
          { id: 202, title: 'How the Internet Works', duration: '35:00', isCompleted: false },
          { id: 203, title: 'Setting Up Your Workspace', duration: '40:00', isCompleted: false },
          { id: 204, title: 'Your First Web Page', duration: '40:00', isCompleted: false },
        ]
      },
      {
        title: 'HTML & CSS Fundamentals',
        lessons: 6,
        hours: 8,
        lessonsList: [
          { id: 205, title: 'HTML Structure and Tags', duration: '50:00', isCompleted: false },
          { id: 206, title: 'CSS Selectors and Properties', duration: '60:00', isCompleted: false },
          { id: 207, title: 'Box Model and Layout', duration: '75:00', isCompleted: false },
          { id: 208, title: 'Flexbox Mastery', duration: '90:00', isCompleted: false },
          { id: 209, title: 'CSS Grid System', duration: '85:00', isCompleted: false },
          { id: 210, title: 'Responsive Design', duration: '120:00', isCompleted: false },
        ]
      },
      {
        title: 'JavaScript Mastery',
        lessons: 8,
        hours: 12,
        lessonsList: [
          { id: 211, title: 'JavaScript Basics', duration: '60:00', isCompleted: false },
          { id: 212, title: 'Control Flow', duration: '55:00', isCompleted: false },
          { id: 213, title: 'Functions Deep Dive', duration: '90:00', isCompleted: false },
          { id: 214, title: 'Arrays and Objects', duration: '100:00', isCompleted: false },
          { id: 215, title: 'DOM Manipulation', duration: '110:00', isCompleted: false },
          { id: 216, title: 'Event Handling', duration: '85:00', isCompleted: false },
          { id: 217, title: 'Async JavaScript', duration: '120:00', isCompleted: false },
          { id: 218, title: 'ES6+ Features', duration: '100:00', isCompleted: false },
        ]
      },
      {
        title: 'React Framework',
        lessons: 7,
        hours: 10,
        lessonsList: [
          { id: 219, title: 'Introduction to React', duration: '45:00', isCompleted: false },
          { id: 220, title: 'Components and Props', duration: '80:00', isCompleted: false },
          { id: 221, title: 'State Management', duration: '95:00', isCompleted: false },
          { id: 222, title: 'Hooks in Depth', duration: '110:00', isCompleted: false },
          { id: 223, title: 'React Router', duration: '75:00', isCompleted: false },
          { id: 224, title: 'API Integration', duration: '90:00', isCompleted: false },
          { id: 225, title: 'Building a Complete App', duration: '105:00', isCompleted: false },
        ]
      }
    ]
  }
];

export const enrolledCourses: EnrolledCourse[] = courses.map(course => ({
  ...course,
  progress: course.id === 1 ? 15 : 8,
  completedLessons: course.id === 1 ? 2 : 1,
  lastAccessed: new Date(Date.now() - (course.id === 1 ? 1 : 3) * 24 * 60 * 60 * 1000),
  currentLesson: course.id === 1 ? 103 : 202,
}));
