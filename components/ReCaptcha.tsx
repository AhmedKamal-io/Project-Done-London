"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface ReCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  action?: string;
}

export default function ReCaptcha({ siteKey, onVerify, action = 'submit' }: ReCaptchaProps) {
  useEffect(() => {
    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.querySelector(`script[src*="recaptcha"]`);
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [siteKey]);

  const executeRecaptcha = async () => {
    if (typeof window !== 'undefined' && window.grecaptcha) {
      try {
        const token = await window.grecaptcha.execute(siteKey, { action });
        onVerify(token);
      } catch (error) {
        console.error('reCAPTCHA error:', error);
      }
    }
  };

  // Expose executeRecaptcha to parent component
  useEffect(() => {
    (window as any).executeRecaptcha = executeRecaptcha;
  }, []);

  return null; // reCAPTCHA v3 is invisible
}

/**
 * Hook to use reCAPTCHA in forms
 */
export function useReCaptcha(siteKey: string, action = 'submit') {
  const executeRecaptcha = async (): Promise<string> => {
    if (typeof window === 'undefined' || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded');
      return '';
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return '';
    }
  };

  return { executeRecaptcha };
}
