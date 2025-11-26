/**
 * Google reCAPTCHA v3 Configuration
 * 
 * للحصول على المفاتيح:
 * 1. اذهب إلى https://www.google.com/recaptcha/admin
 * 2. سجل موقعك
 * 3. اختر reCAPTCHA v3
 * 4. احصل على Site Key و Secret Key
 * 5. أضف المفاتيح إلى ملف .env
 */

export const RECAPTCHA_CONFIG = {
  // Site Key (للاستخدام في Frontend)
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Test key
  
  // Secret Key (للاستخدام في Backend فقط)
  secretKey: process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe', // Test key
  
  // Minimum score (0.0 - 1.0)
  // 0.0 = likely bot, 1.0 = likely human
  minScore: 0.5,
  
  // Verification URL
  verifyUrl: 'https://www.google.com/recaptcha/api/siteverify',
};

/**
 * Verify reCAPTCHA token on server side
 */
export async function verifyRecaptchaToken(token: string): Promise<{
  success: boolean;
  score?: number;
  error?: string;
}> {
  try {
    const response = await fetch(RECAPTCHA_CONFIG.verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_CONFIG.secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: 'reCAPTCHA verification failed',
      };
    }

    // Check score
    if (data.score < RECAPTCHA_CONFIG.minScore) {
      return {
        success: false,
        score: data.score,
        error: `Score too low: ${data.score}`,
      };
    }

    return {
      success: true,
      score: data.score,
    };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return {
      success: false,
      error: 'Verification request failed',
    };
  }
}
