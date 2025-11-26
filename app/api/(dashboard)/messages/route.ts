import connectDB from "@/lib/db/db";
import messages from "@/lib/db/models/messages"; // افتراض أن هذا هو نموذج MongoDB
import { NextResponse } from "next/server";
import { verifyRecaptchaToken } from "@/lib/recaptcha-config";
import { z } from "zod";

// -----------------------------
// 0. مخطط التحقق من صحة البيانات (Zod Schema)
// -----------------------------

// قائمة نطاقات البريد الإلكتروني المسموح بها
const ALLOWED_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "aol.com",
  "icloud.com",
  "live.com",
  // يمكن إضافة نطاقات مسموح بها أخرى هنا
];

// Regex للتحقق مما إذا كان البريد الإلكتروني ينتهي بنطاق مسموح به
const allowedDomainsRegex = new RegExp(`@(${ALLOWED_DOMAINS.join("|")})$`, "i");

const BookingSchema = z.object({
  // 1. Date (Required)
  date: z
    .string({
      required_error: "حقل التاريخ مطلوب.",
    })
    .min(1, "حقل التاريخ مطلوب."),

  // 2. City (Required)
  city: z
    .string({
      required_error: "حقل المدينة مطلوب.",
    })
    .min(2, "حقل المدينة مطلوب ولا يقل عن حرفين."),

  // 3. Name (Max 50 characters)
  name: z
    .string({
      required_error: "حقل الاسم مطلوب.",
    })
    .min(2, "يجب أن يتكون الاسم من حرفين على الأقل.")
    .max(50, "لا يمكن أن يتجاوز الاسم 50 حرفًا.")
    .trim(),

  // 4. Email (Domain Check and Local Part Max 40)
  email: z
    .string({
      required_error: "حقل البريد الإلكتروني مطلوب.",
    })
    .email("صيغة البريد الإلكتروني غير صحيحة.")
    .max(255, "البريد الإلكتروني طويل جداً (الحد الأقصى 255 حرفًا).")
    .toLowerCase()
    .trim()

    // First Refinement: Check max length of Local Part (before @)
    .refine((val) => val.split("@")[0].length <= 40, {
      message:
        "لا يمكن أن يتجاوز الجزء المحلي من البريد الإلكتروني (قبل @) 40 حرفًا.",
    })

    // Second Refinement: Check if the domain is on the allowed list
    .refine((val) => allowedDomainsRegex.test(val), {
      message:
        "يرجى استخدام مزود بريد إلكتروني شائع (مثل Gmail، Yahoo، Outlook).",
    }),

  // 5. Phone (Required)
  phone: z
    .string({
      required_error: "حقل رقم الهاتف مطلوب.",
    })
    .min(8, "رقم الهاتف قصير جداً (الحد الأدنى 8 أرقام).")
    .max(20, "رقم الهاتف طويل جداً (الحد الأقصى 20 رقمًا).")
    .trim(),

  // reCAPTCHA Token اختياري في البيانات الفعلية، لكن سنتعامل معه في منطق الخادم
  recaptchaToken: z.string().optional(),
});

// -----------------------------
// ⭐ Rate Limiter مُحسَّن (IP Based & Session Based)
// -----------------------------
const rateLimit = new Map();
const SESSION_WINDOW_MS = 15 * 60 * 1000; // 15 دقيقة (ربع ساعة)

/**
 * يتحقق من تحديد المعدل بناءً على المفتاح المُعطى (يمكن أن يكون IP أو بريد إلكتروني).
 * @param key المفتاح المستخدم للتتبع (IP أو Email/Phone).
 * @param limit الحد الأقصى من الطلبات.
 * @param windowMs نافذة التتبع بالمللي ثانية.
 * @returns true إذا تم تجاوز الحد، false بخلاف ذلك.
 */
function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (!rateLimit.has(key)) {
    rateLimit.set(key, []);
  }

  // تصفية الطلبات القديمة
  const timestamps = rateLimit
    .get(key)
    .filter((timestamp: number) => now - timestamp < windowMs);

  if (timestamps.length >= limit) {
    // إذا تم تجاوز الحد، نضيف ختمًا زمنيًا جديدًا للحظر المستمر
    return true;
  }

  // إضافة طلب جديد
  timestamps.push(now);
  rateLimit.set(key, timestamps);
  return false;
}

/**
 * يتحقق من قيد الجلسة (ربع ساعة انتظار) ويفرضها.
 * @param sessionKey مفتاح الجلسة (Email/Phone).
 * @returns true إذا كان يجب حظر الإرسال، false بخلاف ذلك.
 */
function isSessionRestricted(sessionKey: string): boolean {
  const now = Date.now();
  if (!rateLimit.has(sessionKey)) {
    return false; // لا يوجد قيد سابق
  }

  // آخر ختم زمني للإرسال
  const timestamps = rateLimit.get(sessionKey);
  const lastAttemptTime = timestamps[timestamps.length - 1];

  // الوقت المتبقي قبل انقضاء فترة الـ 15 دقيقة
  const timeSinceLastAttempt = now - lastAttemptTime;

  if (timeSinceLastAttempt < SESSION_WINDOW_MS) {
    return true;
  }

  return false;
}

/**
 * تحديث وقت آخر إرسال ناجح أو فاشل بعد تجاوز الحد.
 * @param sessionKey مفتاح الجلسة.
 */
function updateSessionRestriction(sessionKey: string) {
  // نقوم بتعيين ختم زمني وحيد جديد لتمثيل بداية فترة الـ 15 دقيقة
  rateLimit.set(sessionKey, [Date.now()]);
}

// -----------------------------
// 🎯 API Route (POST)
// -----------------------------
export async function POST(req: Request) {
  // 1. الحصول على IP
  const ip =
    req.headers.get("x-forwarded-for") ||
    req.headers.get("x-real-ip") ||
    "unknown";

  // إعدادات Rate Limit لكل IP (لمنع هجمات DDoS البسيطة)
  const IP_LIMIT = 5;
  const IP_WINDOW = 60 * 1000; // دقيقة واحدة

  // 2. تطبيق Rate Limit بناءً على IP
  if (isRateLimited(ip, IP_LIMIT, IP_WINDOW)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "لقد تجاوزت الحد الأقصى من الطلبات (IP Rate Limit). يرجى المحاولة لاحقاً.",
      },
      { status: 429 }
    );
  }

  try {
    await connectDB();
    const body = await req.json();

    // 3. التحقق من صحة الإدخال (Zod Validation)
    // يتم إرجاع خطأ 400 إذا كانت البيانات غير صالحة وفقاً للمخطط الجديد
    const validationResult = BookingSchema.safeParse(body);

    if (!validationResult.success) {
      // إرجاع خطأ 400 مع رسالة التحقق
      const validationErrors = validationResult.error.issues
        .map((issue) => issue.message)
        .join("; ");
      return NextResponse.json(
        {
          success: false,
          message: `خطأ في بيانات الإرسال: ${validationErrors}`,
        },
        { status: 400 }
      );
    }

    const { date, city, name, email, phone, recaptchaToken } =
      validationResult.data;

    // إنشاء مفتاح الجلسة (Session Key) من البريد الإلكتروني والهاتف
    const sessionKey = `${email}_${phone}`;

    // 4. تطبيق قيد الجلسة (15 دقيقة)
    if (isSessionRestricted(sessionKey)) {
      const remainingTimeMs =
        SESSION_WINDOW_MS - (Date.now() - rateLimit.get(sessionKey)[0]);
      const remainingMinutes = Math.ceil(remainingTimeMs / 60000);
      return NextResponse.json(
        {
          success: false,
          message: `لا يمكنك إرسال حجز آخر إلا بعد ${remainingMinutes} دقيقة. يرجى الانتظار.`,
        },
        { status: 429 }
      );
    }

    // 5. التحقق من reCAPTCHA
    if (recaptchaToken) {
      const verification = await verifyRecaptchaToken(recaptchaToken);
      if (!verification.success) {
        // تحديث قيد الجلسة عند فشل التحقق الأمني
        updateSessionRestriction(sessionKey);
        return NextResponse.json(
          {
            success: false,
            message: "فشل التحقق الأمني. يرجى المحاولة مرة أخرى.",
          },
          { status: 403 }
        );
      }
    } else {
      // إذا كان رمز reCAPTCHA غير موجود (يفترض أن هذا مطلوب)
      return NextResponse.json(
        { success: false, message: "رمز التحقق الأمني (reCAPTCHA) مطلوب." },
        { status: 403 }
      );
    }

    // 6. إنشاء الحجز في MongoDB (بعد جميع الفحوصات)
    // نستخدم validationResult.data لضمان استخدام بيانات نظيفة
    const newBooking = await messages.create(validationResult.data);

    // 7. تحديث قيد الجلسة (15 دقيقة) بعد الإرسال الناجح
    updateSessionRestriction(sessionKey);

    return NextResponse.json(
      {
        success: true,
        message: "تم إنشاء الحجز بنجاح. يمكنك إرسال حجز آخر بعد 15 دقيقة.",
        data: newBooking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /booking error:", error);
    // عند حدوث خطأ داخلي في الخادم، لا نطبق قيد الجلسة لتجنب حظر المستخدمين لأسباب غير واضحة
    return NextResponse.json(
      { success: false, message: "فشل إنشاء الحجز بسبب خطأ داخلي في الخادم." },
      { status: 500 }
    );
  }
}

// -----------------------------
// 📌 جلب كل الحجوزات (GET)
// -----------------------------
export async function GET() {
  try {
    await connectDB();

    const bookings = await messages.find().sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, data: bookings },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /booking error:", error);
    return NextResponse.json(
      { success: false, message: "فشل جلب الحجوزات" },
      { status: 500 }
    );
  }
}
