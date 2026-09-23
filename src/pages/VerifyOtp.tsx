import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Mail,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { useVerifyOtpMutation, useResendOtpMutation } from '../hooks/useAuthMutations';
import { AwoLoader, AwoLogo } from '../components/AwoLoader';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export const VerifyOtp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const verifyMutation = useVerifyOtpMutation();
  const resendMutation = useResendOtpMutation();

  const email = location.state?.email as string | undefined;
  const password = location.state?.password as string | undefined;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect to login if email is missing in route state
  useEffect(() => {
    if (!email || !password) {
      navigate('/login', { replace: true });
    }
  }, [email, password, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setSuccessMessage(null);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setSuccessMessage(null);

    const nextFocusIndex = Math.min(pastedData.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < OTP_LENGTH) return;
    if (!email) return;

    try {
      setSuccessMessage(null);
      await verifyMutation.mutateAsync({ email, otp: fullOtp });
      setSuccessMessage('OTP verified successfully! Redirecting to dashboard...');

      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } catch {
      // TanStack Query automatically captures the error object in verifyMutation.error
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resendMutation.isPending || !email || !password) return;

    try {
      setSuccessMessage(null);
      verifyMutation.reset();
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();

      const response = await resendMutation.mutateAsync({ email, password });
      setSuccessMessage(response?.message || `A new OTP has been sent to ${email}`);
      setCooldown(RESEND_COOLDOWN);
    } catch {
      // TanStack Query automatically captures the error object in resendMutation.error
    }
  };

  if (!email) {
    return null;
  }

  const isSubmitting = verifyMutation.isPending;
  const isResending = resendMutation.isPending;
  const isOtpComplete = otp.join('').length === OTP_LENGTH;
  const rawOtpError =
    (verifyMutation.error && verifyMutation.error.message) ||
    (resendMutation.error && resendMutation.error.message) ||
    null;

  let apiError: string | null = null;
  if (rawOtpError) {
    if (rawOtpError.toLowerCase().includes('could not send email')) {
      apiError =
        'Failed to send OTP verification email (Backend mail service error: "Could not send email"). Please check the backend SMTP email configuration.';
    } else {
      apiError = rawOtpError;
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 font-sans">
      {/* Full-screen Loader Overlay */}
      {(isSubmitting || isResending) && (
        <AwoLoader
          fullScreen
          message={isSubmitting ? 'Verifying OTP code...' : 'Resending verification code...'}
          size="lg"
        />
      )}

      {/* LEFT PANEL - Hero Branding & Visuals */}
      <div className="md:w-1/2 bg-slate-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle Background Decorative Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / Branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
             <div className="relative z-10 flex items-center space-x-3">
                      <AwoLogo className="h-14  w-auto" showDots={false} />
                      
                    </div>
            <span className="font-bold text-xl tracking-tight text-white">
            </span>
          </div>
        </div>

        {/* Hero Middle Content */}
        <div className="relative z-10 my-12 max-w-lg">
          

          <h1 className="text-xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Security <span className="text-emerald-400">Verification</span>
          </h1>

          

         
        </div>

        {/* Bottom Footer Details */}
        <div className="relative z-10 text-xs text-slate-400 border-t border-slate-800/80 pt-6 flex items-center justify-between">
          <p>© {new Date().getFullYear()} AWO Platform. All rights reserved.</p>
        </div>
      </div>

      {/* RIGHT PANEL - Verification Form */}
      <div className="md:w-1/2 p-6 sm:p-12 md:p-16 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button & Header */}
          <div>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-6 group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
              <Mail className="w-6 h-6 text-emerald-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Verify One-Time Password</h2>
            <p className="text-sm text-slate-500 mt-2">
              We have sent a {OTP_LENGTH}-digit security code to{' '}
              <span className="font-semibold text-slate-800">{email}</span>.
            </p>
          </div>

          {/* Error Banner */}
          {apiError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-700 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3 text-emerald-800 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Enter {OTP_LENGTH}-Digit Code
              </label>

              <div className="flex items-center justify-between gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-11 h-13 sm:w-13 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all duration-200 outline-none ${digit
                      ? 'border-emerald-500 bg-emerald-50/30 text-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isOtpComplete}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Verify Code</span>
            </button>
          </form>

          {/* Resend Section */}
          <div className="pt-4 border-t border-slate-200/80 text-center">
            <p className="text-sm text-slate-500 mb-2">Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="inline-flex items-center text-sm font-semibold text-emerald-600 hover:text-emerald-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${isResending ? 'animate-spin' : ''}`} />
              {cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
