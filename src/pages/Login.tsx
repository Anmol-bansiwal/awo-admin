import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../hooks/useAuthMutations';
import { useAuthStore } from '../store/useAuthStore';
import { AwoLoader, AwoLogo } from '../components/AwoLoader';

// Schema for form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' })
  
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginSuccess(null);
      // await loginMutation.mutateAsync(data);
      // setLoginSuccess(`Verification code sent to ${data.email}. Redirecting...`);
      // setTimeout(() => {
      //   navigate('/verify-otp', {
      //     state: {
      //       email: data.email,
      //       password: data.password,
      //     },
      //     replace: true,
      //   });
      // }, 500);

      // TEMPORARY: Bypass OTP and login API
      setAuthSession(
        {
          id: 'admin',
          email: data.email,
          name: data.email.split('@')[0],
          role: 'admin',
        },
        'dummy_token_for_bypass',
        null
      );
      navigate('/dashboard', { replace: true });
    } catch {
      // TanStack Query automatically captures the error object in loginMutation.error
    }
  };

  const isSubmitting = loginMutation.isPending;
  const rawErrorMessage = loginMutation.error?.message;
  let apiError: string | null = null;

  if (rawErrorMessage) {
    if (rawErrorMessage.toLowerCase().includes('could not send email')) {
      apiError =
        'Failed to send OTP verification email (Backend mail service error: "Could not send email"). Please verify the backend SMTP mail server configuration.';
    } else {
      apiError = rawErrorMessage;
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 font-sans">
      {/* Late response / Async submission loader overlay */}
      {isSubmitting && (
        <AwoLoader fullScreen message="Authenticating with AWO servers..." size="lg" />
      )}
      {/* LEFT PANEL - Hero Branding & Visuals */}
      <div className="relative md:w-1/2 min-h-[380px] md:min-h-screen bg-slate-900 overflow-hidden flex flex-col justify-between p-8 lg:p-12 text-white select-none">
        {/* Background Image & Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/80 via-slate-900/90 to-emerald-900/40" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full filter blur-3xl" />

        {/* Top Logo Header */}
        <div className="relative z-10 flex items-center space-x-3">
          <AwoLogo className="h-14 w-auto" showDots={false} />
          
        </div>

        {/* Hero Middle Banner Text */}
        <div className="relative z-10 my-auto max-w-lg pt-12 md:pt-0">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Management <br />
            <span className="text-[#3BB54B] underline decoration-[#3BB54B]/40 decoration-4 underline-offset-8">
              Portal
            </span>
          </h1>
          

          {/* Feature Badges */}
          
        </div>

        {/* Bottom Left Footer */}
       
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header Title */}
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Please enter your credentials to access the admin dashboard.
            </p>
          </div>

          {/* Success Callout Banner */}
          {loginSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm font-medium leading-relaxed">
                {loginSuccess}
              </div>
            </div>
          )}

          {/* API Error Callout Banner */}
          {apiError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200/80 text-red-700 flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm font-medium leading-relaxed">
                {apiError}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            {/* Email / Username Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="admin@awo.com"
                  disabled={isSubmitting}
                  {...register('email')}
                  className={`block w-full pl-10 pr-4 py-3 bg-white border ${errors.email
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                    } rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>{errors.email.message}</span>
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-600"
                >
                  Password
                </label>
              
              </div>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  {...register('password')}
                  className={`block w-full pl-10 pr-10 py-3 bg-white border ${errors.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-slate-300 focus:ring-emerald-500 focus:border-emerald-500'
                    } rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-colors disabled:bg-slate-50 disabled:text-slate-500`}
                />
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center py-3.5 px-4 rounded-lg text-white font-semibold bg-[#3BB54B] hover:bg-[#319A3F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3BB54B] shadow-md shadow-[#3BB54B]/20 active:scale-[0.99] transition-all disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span>SIGNING IN...</span>
                </span>
              ) : (
                <span>SIGN IN</span>
              )}
            </button>
          </form>


        
        </div>
      </div>
    </div>
  );
};
