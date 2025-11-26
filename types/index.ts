export type Language = "ar" | "en";

export interface ILogo {
  url: string;
  public_id: string;
}
export interface IAccreditation {
  _id: string;
  name_ar: string;
  name_en: string;
  logo: ILogo | null;
}
export interface Course {
  id: number;
  name: string;
  section: string;
  city: string;
  price: string;
  duration: string;
  nextDate: string;
  participants: number | string;
  language: string;
  description: string;
  importance: string[];
  outcomes: string[];
  services: string[];
  objectives: string[];
  modules: CourseModule[];
  instructor: Instructor;
  certificate: string;
  venue: string;
  includes: string[];
  faq: FAQItem[];
  image?: string;
}

export interface CourseModule {
  title: string;
  duration: string;
  topics: string[];
}

export interface Instructor {
  name: string;
  title: string;
  experience: string;
  image: string;
  bio?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedCourse {
  id: number;
  name: string;
  section: string;
  city: string;
  price: string;
  image: string;
}

export interface City {
  id: number;
  name: string;
  country: string;
  description: string;
  image: string;
  coursesCount: number;
  upcomingDates: string[];
}

export interface Section {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  coursesCount: number;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  courseId: number;
  city: string;
  date: string;
  company?: string;
  notes?: string;
}

export interface FilterOptions {
  city: string;
  section: string;
  search: string;
}

export interface Translation {
  [key: string]: string | ((arg?: any) => string);
}

export interface Translations {
  ar: Translation;
  en: Translation;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  image: string;
  rating: number;
  text: string;
  date: string;
}

export interface Partner {
  id: number;
  name: string;
  logo: string;
  url: string;
}

export interface Statistic {
  id: number;
  label: string;
  value: string;
  icon: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  subItems?: NavigationItem[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CourseFilters {
  sections?: string[];
  cities?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
  language?: string[];
  duration?: string[];
}

export interface SortOptions {
  field: "name" | "price" | "date" | "popularity";
  order: "asc" | "desc";
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user" | "instructor";
  avatar?: string;
  registeredCourses?: number[];
  createdAt: string;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  enrollmentDate: string;
  completionDate?: string;
}

export interface Certificate {
  id: number;
  enrollmentId: number;
  certificateNumber: string;
  issuedDate: string;
  downloadUrl: string;
}

export interface Review {
  id: number;
  courseId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface CalendarEvent {
  id: number;
  courseId: number;
  courseName: string;
  startDate: string;
  endDate: string;
  city: string;
  venue: string;
  availableSeats: number;
}

export interface SearchResult {
  type: "course" | "city" | "section" | "page";
  id: number;
  title: string;
  description: string;
  url: string;
  image?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  tags: string[];
  image: string;
  readTime: number;
}

export interface GalleryImage {
  id: number;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  category: string;
  courseId?: number;
  eventDate?: string;
}

export interface DownloadableResource {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  fileType: "pdf" | "doc" | "xls" | "ppt" | "zip";
  fileSize: string;
  category: string;
  downloadCount: number;
}

export interface CompanyTraining {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  numberOfParticipants: number;
  requestedCourses: number[];
  preferredDates: string[];
  location: "onsite" | "offsite" | "online";
  budget?: string;
  additionalRequirements?: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  submittedAt: string;
}

export interface PaymentDetails {
  amount: number;
  currency: string;
  method: "credit_card" | "bank_transfer" | "paypal" | "cash";
  transactionId?: string;
  status: "pending" | "completed" | "failed" | "refunded";
  paidAt?: string;
}

export interface Discount {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minPurchase?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usageCount: number;
  applicableCourses?: number[];
  active: boolean;
}

export interface CustomizableTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  darkMode: boolean;
  fontFamily: string;
  borderRadius: string;
}

// Utility Types
export type CourseStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "refunded";
export type UserRole = "admin" | "user" | "instructor";
export type NotificationType = "info" | "success" | "warning" | "error";
export type LocationType = "onsite" | "offsite" | "online";
export type FileType = "pdf" | "doc" | "xls" | "ppt" | "zip";
export type DiscountType = "percentage" | "fixed";
export type SortOrder = "asc" | "desc";
export type SortField = "name" | "price" | "date" | "popularity";

// Form Validation Types
export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
};

export type FormErrors<T> = {
  [K in keyof T]?: string;
};
