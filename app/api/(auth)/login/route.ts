import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod"; // مكتبة Zod للتحقق من صحة البيانات (تحتاج إلى: npm install zod)
import { RateLimiterMemory } from "rate-limiter-flexible"; // مكتبة تحديد المعدل (تحتاج إلى: npm install rate-limiter-flexible)

// جلب المتغيرات من .env.local
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const AUTH_TOKEN_SECRET = process.env.AUTH_TOKEN_SECRET;

// ---------------------------------------------
// 1. إعدادات تحديد المعدل (Rate Limiting)
// يستخدم RateLimiterMemory للتخزين في الذاكرة - يجب استبداله بـ Redis أو DB في الإنتاج
// 5 محاولات فاشلة في 10 دقائق لكل بريد إلكتروني
// يتم الحظر لمدة 15 دقيقة بعد تجاوز الحد
// ---------------------------------------------
const emailLimiter = new RateLimiterMemory({
  points: 5, // عدد النقاط (المحاولات) المسموح بها
  duration: 60 * 10, // المدة بالثواني (10 دقائق)
  blockDuration: 60 * 15, // مدة الحظر بالثواني (15 دقيقة)
});

// ---------------------------------------------
// 2. مخطط التحقق من صحة الإدخال (Validation Schema)
// ---------------------------------------------
const LoginSchema = z.object({
  email: z.string().email({ message: "البريد الإلكتروني غير صحيح." }),
  password: z
    .string()
    .min(6, { message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل." }),
});

export async function POST(request: Request) {
  const body = await request.json();
  const emailAttempt = body.email || "unknown_email"; // استخدام البريد حتى لو كان غير صالح في التحقق من المعدل

  // 1. التحقق من وجود الإعدادات (Check ENV)
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !AUTH_TOKEN_SECRET) {
    console.error("Missing Admin ENV variables!");
    return NextResponse.json(
      {
        success: false,
        message: "خطأ في تهيئة الخادم (Server configuration error)",
      },
      { status: 500 }
    );
  }

  // ---------------------------------------------
  // 2. تطبيق تحديد المعدل (Rate Limiting)
  // سنقوم بتحديد المعدل قبل التحقق من البيانات لمنع محاولات التخمين
  // ---------------------------------------------
  try {
    await emailLimiter.consume(emailAttempt);
  } catch (rateLimiterRes: any) {
    // إذا تم تجاوز الحد، يتم إرجاع خطأ 429
    const msBeforeNext =
      rateLimiterRes &&
      typeof rateLimiterRes === "object" &&
      "msBeforeNext" in rateLimiterRes
        ? (rateLimiterRes as any).msBeforeNext
        : 0;
    const retryAfter = Math.ceil((msBeforeNext || 0) / 1000);
    return NextResponse.json(
      {
        success: false,
        message: `لقد تجاوزت الحد الأقصى للمحاولات. حاول مرة أخرى بعد ${retryAfter} ثانية.`,
      },
      {
        status: 429, // 429 Too Many Requests
        headers: { "Retry-After": retryAfter.toString() },
      }
    );
  }

  // ---------------------------------------------
  // 3. التحقق من صحة الإدخال (Validation)
  // ---------------------------------------------
  const validationResult = LoginSchema.safeParse(body);

  if (!validationResult.success) {
    // إرجاع خطأ 400 إذا كان التحقق غير ناجح
    const validationErrors = validationResult.error.issues
      .map((issue) => issue.message)
      .join("; ");
    return NextResponse.json(
      { success: false, message: validationErrors },
      { status: 400 }
    );
  }

  // استخدام البيانات التي تم التحقق من صحتها
  const { email, password } = validationResult.data;

  // ---------------------------------------------
  // 4. التحقق من بيانات الاعتماد (Credential Check)
  // ---------------------------------------------
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // تسجيل الدخول ناجح: يتم إعادة تعيين عداد تحديد المعدل (لإلغاء أي حظر سابق)
    // (RateLimiterMemory does not expose a direct reset, but in a production setup with Redis this would be done)

    // 5. تعيين ملف تعريف الارتباط (Cookie)
    cookies().set("admin_auth_token", AUTH_TOKEN_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // أسبوع
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الدخول بنجاح",
    });
  }

  // إذا كانت بيانات الاعتماد غير صالحة
  return NextResponse.json(
    { success: false, message: "بيانات اعتماد غير صالحة" },
    { status: 401 }
  );
}
