'use client';

import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignUp } from '@/components/auth/SignUp';
import { useState } from 'react';

export default function SignUpPage() {
  const [step, setStep] = useState<'name' | 'birthday' | 'email' | 'password'>('name');

  const titles = {
    name: {
      title: 'Create a Google Account',
      subtitle: 'Enter your name'
    },
    birthday: {
      title: 'Basic information',
      subtitle: 'Enter your birthday and gender'
    },
    email: {
      title: 'Choose your Gmail address',
      subtitle: 'Pick a Gmail address or create your own'
    },
    password: {
      title: 'Create a strong password',
      subtitle: 'Create a strong password with a mixture of letters, numbers and symbols'
    }
  };

  return (
    <AuthLayout
      title={titles[step].title}
      subtitle={titles[step].subtitle}
    >
      <SignUp onStepChange={setStep} />
    </AuthLayout>
  );
} 