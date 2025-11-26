
import type {
  Course,
  RelatedCourse,
  City,
  Section,
  BookingFormData,
  ContactFormData,
  NewsletterFormData,
  Testimonial,
  User,
  Enrollment,
  Review,
  SearchResult,
  BlogPost,
  GalleryImage,
  CompanyTraining,
  Discount,
  APIResponse,
  FilterOptions,
  SortOptions,
  PaginationParams,
} from "@/types"

// Base API URL - adjust according to your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Helper function for API calls
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "An error occurred",
      }
    }

    return {
      success: true,
      data: data,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

// ============================================
// COURSE SERVICES
// ============================================

export const courseService = {
  // Get all courses with optional filters
  async getAllCourses(
    filters?: FilterOptions,
    sort?: SortOptions,
    pagination?: PaginationParams
  ): Promise<APIResponse<Course[]>> {
    const params = new URLSearchParams()
    if (filters?.city) params.append("city", filters.city)
    if (filters?.section) params.append("section", filters.section)
    if (filters?.search) params.append("search", filters.search)
    if (sort?.field) params.append("sortBy", sort.field)
    if (sort?.order) params.append("order", sort.order)
    if (pagination?.page) params.append("page", pagination.page.toString())
    if (pagination?.limit) params.append("limit", pagination.limit.toString())

    return fetchAPI<Course[]>(`/courses?${params.toString()}`)
  },

  // Get single course by ID
  async getCourseById(id: number): Promise<APIResponse<Course>> {
    return fetchAPI<Course>(`/courses/${id}`)
  },

  // Get related courses
  async getRelatedCourses(courseId: number): Promise<APIResponse<RelatedCourse[]>> {
    return fetchAPI<RelatedCourse[]>(`/courses/${courseId}/related`)
  },

  // Get courses by section
  async getCoursesBySection(section: string): Promise<APIResponse<Course[]>> {
    return fetchAPI<Course[]>(`/courses/section/${encodeURIComponent(section)}`)
  },

  // Get courses by city
  async getCoursesByCity(city: string): Promise<APIResponse<Course[]>> {
    return fetchAPI<Course[]>(`/courses/city/${encodeURIComponent(city)}`)
  },

  // Search courses
  async searchCourses(query: string): Promise<APIResponse<Course[]>> {
    return fetchAPI<Course[]>(`/courses/search?q=${encodeURIComponent(query)}`)
  },

  // Get upcoming courses
  async getUpcomingCourses(limit?: number): Promise<APIResponse<Course[]>> {
    const params = limit ? `?limit=${limit}` : ""
    return fetchAPI<Course[]>(`/courses/upcoming${params}`)
  },

  // Get featured courses
  async getFeaturedCourses(limit?: number): Promise<APIResponse<Course[]>> {
    const params = limit ? `?limit=${limit}` : ""
    return fetchAPI<Course[]>(`/courses/featured${params}`)
  },
}

// ============================================
// BOOKING SERVICES
// ============================================

export const bookingService = {
  // Submit booking form
  async createBooking(data: BookingFormData): Promise<APIResponse<{ bookingId: number }>> {
    return fetchAPI<{ bookingId: number }>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Get user bookings
  async getUserBookings(userId: number): Promise<APIResponse<Enrollment[]>> {
    return fetchAPI<Enrollment[]>(`/users/${userId}/bookings`)
  },

  // Cancel booking
  async cancelBooking(bookingId: number): Promise<APIResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>(`/bookings/${bookingId}/cancel`, {
      method: "POST",
    })
  },

  // Get booking details
  async getBookingById(bookingId: number): Promise<APIResponse<Enrollment>> {
    return fetchAPI<Enrollment>(`/bookings/${bookingId}`)
  },
}

// ============================================
// CITY SERVICES
// ============================================

export const cityService = {
  // Get all cities
  async getAllCities(): Promise<APIResponse<City[]>> {
    return fetchAPI<City[]>("/cities")
  },

  // Get city by ID
  async getCityById(id: number): Promise<APIResponse<City>> {
    return fetchAPI<City>(`/cities/${id}`)
  },

  // Get city by name
  async getCityByName(name: string): Promise<APIResponse<City>> {
    return fetchAPI<City>(`/cities/name/${encodeURIComponent(name)}`)
  },
}

// ============================================
// SECTION SERVICES
// ============================================

export const sectionService = {
  // Get all sections
  async getAllSections(): Promise<APIResponse<Section[]>> {
    return fetchAPI<Section[]>("/sections")
  },

  // Get section by ID
  async getSectionById(id: number): Promise<APIResponse<Section>> {
    return fetchAPI<Section>(`/sections/${id}`)
  },

  // Get section by name
  async getSectionByName(name: string): Promise<APIResponse<Section>> {
    return fetchAPI<Section>(`/sections/name/${encodeURIComponent(name)}`)
  },
}

// ============================================
// CONTACT SERVICES
// ============================================

export const contactService = {
  // Submit contact form
  async submitContactForm(data: ContactFormData): Promise<APIResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Subscribe to newsletter
  async subscribeNewsletter(data: NewsletterFormData): Promise<APIResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// ============================================
// TESTIMONIAL SERVICES
// ============================================

export const testimonialService = {
  // Get all testimonials
  async getAllTestimonials(): Promise<APIResponse<Testimonial[]>> {
    return fetchAPI<Testimonial[]>("/testimonials")
  },

  // Submit testimonial
  async submitTestimonial(data: Partial<Testimonial>): Promise<APIResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>("/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// ============================================
// USER SERVICES
// ============================================

export const userService = {
  // Get user profile
  async getUserProfile(userId: number): Promise<APIResponse<User>> {
    return fetchAPI<User>(`/users/${userId}`)
  },

  // Update user profile
  async updateUserProfile(userId: number, data: Partial<User>): Promise<APIResponse<User>> {
    return fetchAPI<User>(`/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Get user enrollments
  async getUserEnrollments(userId: number): Promise<APIResponse<Enrollment[]>> {
    return fetchAPI<Enrollment[]>(`/users/${userId}/enrollments`)
  },
}

// ============================================
// REVIEW SERVICES
// ============================================

export const reviewService = {
  // Get course reviews
  async getCourseReviews(courseId: number): Promise<APIResponse<Review[]>> {
    return fetchAPI<Review[]>(`/courses/${courseId}/reviews`)
  },

  // Submit review
  async submitReview(data: Partial<Review>): Promise<APIResponse<Review>> {
    return fetchAPI<Review>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Mark review as helpful
  async markReviewHelpful(reviewId: number): Promise<APIResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>(`/reviews/${reviewId}/helpful`, {
      method: "POST",
    })
  },
}

// ============================================
// SEARCH SERVICES
// ============================================

export const searchService = {
  // Global search
  async globalSearch(query: string): Promise<APIResponse<SearchResult[]>> {
    return fetchAPI<SearchResult[]>(`/search?q=${encodeURIComponent(query)}`)
  },

  // Get search suggestions
  async getSearchSuggestions(query: string): Promise<APIResponse<string[]>> {
    return fetchAPI<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`)
  },
}

// ============================================
// BLOG SERVICES
// ============================================

export const blogService = {
  // Get all blog posts
  async getAllPosts(page?: number, limit?: number): Promise<APIResponse<BlogPost[]>> {
    const params = new URLSearchParams()
    if (page) params.append("page", page.toString())
    if (limit) params.append("limit", limit.toString())
    return fetchAPI<BlogPost[]>(`/blog?${params.toString()}`)
  },

  // Get blog post by slug
  async getPostBySlug(slug: string): Promise<APIResponse<BlogPost>> {
    return fetchAPI<BlogPost>(`/blog/${slug}`)
  },

  // Get posts by category
  async getPostsByCategory(category: string): Promise<APIResponse<BlogPost[]>> {
    return fetchAPI<BlogPost[]>(`/blog/category/${encodeURIComponent(category)}`)
  },
}

// ============================================
// GALLERY SERVICES
// ============================================

export const galleryService = {
  // Get all gallery images
  async getAllImages(category?: string): Promise<APIResponse<GalleryImage[]>> {
    const params = category ? `?category=${encodeURIComponent(category)}` : ""
    return fetchAPI<GalleryImage[]>(`/gallery${params}`)
  },

  // Get course gallery
  async getCourseGallery(courseId: number): Promise<APIResponse<GalleryImage[]>> {
    return fetchAPI<GalleryImage[]>(`/courses/${courseId}/gallery`)
  },
}

// ============================================
// COMPANY TRAINING SERVICES
// ============================================

export const companyTrainingService = {
  // Submit company training request
  async submitRequest(data: Partial<CompanyTraining>): Promise<APIResponse<{ requestId: number }>> {
    return fetchAPI<{ requestId: number }>("/company-training", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Get company training request status
  async getRequestStatus(requestId: number): Promise<APIResponse<CompanyTraining>> {
    return fetchAPI<CompanyTraining>(`/company-training/${requestId}`)
  },
}

// ============================================
// DISCOUNT SERVICES
// ============================================

export const discountService = {
  // Validate discount code
  async validateDiscountCode(code: string, courseId?: number): Promise<APIResponse<Discount>> {
    const params = courseId ? `?courseId=${courseId}` : ""
    return fetchAPI<Discount>(`/discounts/validate/${code}${params}`)
  },

  // Apply discount
  async applyDiscount(code: string, amount: number): Promise<APIResponse<{ finalAmount: number }>> {
    return fetchAPI<{ finalAmount: number }>("/discounts/apply", {
      method: "POST",
      body: JSON.stringify({ code, amount }),
    })
  },
}

// ============================================
// STATISTICS SERVICES
// ============================================

export const statisticsService = {
  // Get platform statistics
  async getPlatformStats(): Promise<APIResponse<{
    totalCourses: number
    totalStudents: number
    totalInstructors: number
    totalCities: number
  }>> {
    return fetchAPI("/statistics/platform")
  },

  // Get course statistics
  async getCourseStats(courseId: number): Promise<APIResponse<{
    enrollments: number
    averageRating: number
    completionRate: number
  }>> {
    return fetchAPI(`/statistics/courses/${courseId}`)
  },
}

// ============================================
// FILE UPLOAD SERVICES
// ============================================

export const fileService = {
  // Upload file
  async uploadFile(file: File, type: string): Promise<APIResponse<{ url: string }>> {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("type", type)

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.message || "Upload failed",
        }
      }

      return {
        success: true,
        data: { url: data.url },
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  },

  // Delete file
  async deleteFile(fileUrl: string): Promise<APIResponse<{ message: string }>> {
    return fetchAPI<{ message: string }>("/upload", {
      method: "DELETE",
      body: JSON.stringify({ url: fileUrl }),
    })
  },
}

// ============================================
// CALENDAR SERVICES
// ============================================

export const calendarService = {
  // Get calendar events
  async getEvents(startDate?: string, endDate?: string): Promise<APIResponse<any[]>> {
    const params = new URLSearchParams()
    if (startDate) params.append("start", startDate)
    if (endDate) params.append("end", endDate)
    return fetchAPI<any[]>(`/calendar/events?${params.toString()}`)
  },

  // Get course schedule
  async getCourseSchedule(courseId: number): Promise<APIResponse<any[]>> {
    return fetchAPI<any[]>(`/courses/${courseId}/schedule`)
  },
}

// Export all services
export default {
  course: courseService,
  booking: bookingService,
  city: cityService,
  section: sectionService,
  contact: contactService,
  testimonial: testimonialService,
  user: userService,
  review: reviewService,
  search: searchService,
  blog: blogService,
  gallery: galleryService,
  companyTraining: companyTrainingService,
  discount: discountService,
  statistics: statisticsService,
  file: fileService,
  calendar: calendarService,
}