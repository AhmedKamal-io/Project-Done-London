"use client";

import { useEffect } from 'react';

declare global {
  interface Window {
    grecaptcha: any;
    grecaptchaReady: boolean;
  }
}

interface ReCaptchaProviderProps {
  siteKey: string;
  children: React.ReactNode;
}

export default function ReCaptchaProvider({ siteKey, children }: ReCaptchaProviderProps) {
  useEffect(() => {
    // Check if script already loaded
    if (window.grecaptchaReady) {
      return;
    }

    // Load reCAPTCHA script
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      window.grecaptchaReady = true;
      console.log('✅ reCAPTCHA loaded successfully');
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount to avoid reloading
    };
  }, [siteKey]);

  return <>{children}</>;
}

/**
 * Hook to use reCAPTCHA in forms
 */
export function useReCaptcha(siteKey: string, action = 'submit') {
  useEffect(() => {
    // Ensure script is loaded
    if (typeof window !== 'undefined' && !window.grecaptchaReady) {
      const checkInterval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.execute) {
          window.grecaptchaReady = true;
          clearInterval(checkInterval);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, []);

  const executeRecaptcha = async (): Promise<string> => {
    if (typeof window === 'undefined') {
      console.warn('reCAPTCHA: window is undefined');
      return '';
    }

    // Wait for grecaptcha to be ready
    let attempts = 0;
    while (!window.grecaptcha && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }

    if (!window.grecaptcha || !window.grecaptcha.execute) {
      console.error('reCAPTCHA not loaded after waiting');
      return '';
    }

    try {
      const token = await window.grecaptcha.execute(siteKey, { action });
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      return '';
    }
  };

  return { executeRecaptcha };
}
