import { NextRequest, NextResponse } from 'next/server';
import { verifyRecaptchaToken } from '@/lib/recaptcha-config';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No reCAPTCHA token provided' },
        { status: 400 }
      );
    }

    const verification = await verifyRecaptchaToken(token);

    if (!verification.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: verification.error,
          score: verification.score 
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      score: verification.score,
    });
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
