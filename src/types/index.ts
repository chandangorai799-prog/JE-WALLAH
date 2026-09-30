export type Branch = 'Electrical' | 'Mechanical' | 'Metallurgy' | 'Computer Science';

export type Semester = '1st Semester' | '3rd Semester' | '5th Semester';

export interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  topicsCount: number;
  description?: string;
}

export interface ResourceItem {
  title: string;
  url: string;
  type: 'pdf' | 'notes' | 'pyq' | 'cheatsheet';
}

export interface Lesson {
  id: string;
  subjectId: string;
  title: string;
  duration: string;
  videoUrl?: string;
  notesTitle?: string;
  notesContent?: string;
  isFreePreview?: boolean;
  order: number;
  resources?: ResourceItem[];
}

export interface Course {
  courseId: string;
  title: string;
  branch: Branch;
  semester: Semester;
  price: number; // 99 for 1st sem, 299 for 3rd sem, 249 for 5th sem
  originalPrice: number;
  description: string;
  thumbnail: string;
  rating: number;
  enrolledCount: number;
  subjects: Subject[];
  lessons: Lesson[];
  active: boolean;
  validity: string;
  targetBoard: string;
  highlights: string[];
}

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: 'student' | 'admin';
  createdAt: string;
  college?: string;
  branch?: Branch;
  semester?: Semester;
}

export interface Order {
  orderId: string;
  uid: string;
  courseId: string;
  courseTitle: string;
  branch: Branch;
  semester: Semester;
  amount: number;
  currency: string;
  paymentProvider: 'demo' | 'razorpay';
  paymentReference: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  paymentMethod: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface Purchase {
  purchaseId: string;
  uid: string;
  courseId: string;
  orderId: string;
  purchaseDate: string;
  accessStatus: 'active' | 'revoked';
}

export interface StudentProgress {
  progressId: string;
  uid: string;
  courseId: string;
  completedLessons: string[];
  lastLessonId?: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
