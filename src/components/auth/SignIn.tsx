'use client';

import { FormEvent } from 'react';
import Link from 'next/link';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useSignInStore } from '@/state/authState';

export const SignIn = () => {
  const {
    email,
    password,
    error,
    step,
    loading,
    setEmail,
    setPassword,
    setError,
    setStep,
    checkEmail,
    signIn
  } = useSignInStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (step === 'email') {
      if (!email) {
        setError('Enter an email');
        return;
      }

      const emailExists = await checkEmail(email);
      if (emailExists) {
        setStep('password');
      }
      return;
    }

    // Password step
    if (!password) {
      setError('Enter a password');
      return;
    }

    await signIn(email, password);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 'email' ? (
          <>
            <Input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              error={error}
              className="text-white bg-transparent border-gray-500"
              disabled={loading}
            />

            <div className="text-sm text-[#8ab4f8] hover:text-[#c2d9fc]">
              <Link href="/forgot-password">Forgot email?</Link>
            </div>

            <div className="text-sm text-gray-400 mt-8">
              <p>
                Not your computer? Use Guest mode to sign in privately.{' '}
                <Link href="#" className="text-[#8ab4f8] hover:text-[#c2d9fc]">
                  Learn more
                </Link>
              </p>
            </div>

            <div className="flex justify-between items-center mt-8">
              <Link
                href="/signup"
                className="text-[#8ab4f8] text-sm hover:text-[#c2d9fc]"
              >
                Create account
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? 'Checking...' : 'Next'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 text-white mb-4 cursor-pointer" onClick={() => setStep('email')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <div className="text-sm">{email}</div>
            </div>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              error={error}
              className="text-white bg-transparent border-gray-500"
              autoFocus
              disabled={loading}
            />

            <div className="text-sm text-[#8ab4f8] hover:text-[#c2d9fc]">
              <Link href="/forgot-password">Forgot password?</Link>
            </div>

            <div className="flex justify-end items-center mt-8">
              <Button type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Next'}
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}; 