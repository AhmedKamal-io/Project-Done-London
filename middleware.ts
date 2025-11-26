import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET;
const PROTECTED_PREFIX = "/admin";
const PUBLIC_ROUTES = "/login";

export function middleware(request: NextRequest) {
  const adminAuthToken = request.cookies.get("admin_auth_token")?.value;
  const url = request.nextUrl.clone();
  const pathname = url.pathname;
  
  // تجاهل مسارات الملفات الثابتة
  const isStaticFile = pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/);
  if (isStaticFile) {
    return NextResponse.next();
  }
  
  // تجاهل مسارات API
  const isApiRoute = pathname.startsWith('/api');
  if (isApiRoute) {
    return NextResponse.next();
  }

  // ====================================
  // معالجة المسارات المحمية (Admin)
  // ====================================
  const isAdminRoute = pathname.startsWith(PROTECTED_PREFIX);
  const isLoginRoute = pathname === PUBLIC_ROUTES;
  
  if (!AUTH_TOKEN_SECRET) {
    console.error("Critical: AUTH_TOKEN_SECRET is missing in environment!");
    if (isAdminRoute) {
      return NextResponse.redirect(new URL(PUBLIC_ROUTES, request.url));
    }
  }

  const isAuthenticated = adminAuthToken === AUTH_TOKEN_SECRET;

  // 1. معالجة المسارات المحمية (/admin/*)
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL(PUBLIC_ROUTES, request.url));
    }
    return NextResponse.next();
  }

  // 2. معالجة صفحة تسجيل الدخول (/login)
  if (isLoginRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(PROTECTED_PREFIX, request.url));
    }
    return NextResponse.next();
  }

  // ====================================
  // إدارة تعدد اللغات (i18n) للمسارات العامة
  // ====================================
  const response = NextResponse.next();
  
  // تحديد اللغة بناءً على المسار
  const detectedLang = pathname.startsWith('/ar/') || pathname === '/ar' ? 'ar' : 'en';
  
  // تحديث كوكيز اللغة
  response.cookies.set('language', detectedLang, { 
    path: '/', 
    maxAge: 60 * 60 * 24 * 365 
  });
  response.cookies.set('i18next', detectedLang, { 
    path: '/', 
    maxAge: 60 * 60 * 24 * 365 
  });
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
