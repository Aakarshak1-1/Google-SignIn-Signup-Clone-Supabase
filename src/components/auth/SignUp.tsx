'use client';

import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { useSignUpStore } from '@/state/authState';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface SignUpProps {
  onStepChange: (step: 'name' | 'birthday' | 'email' | 'password') => void;
}

export const SignUp = ({ onStepChange }: SignUpProps) => {
  const router = useRouter();
  const { step, formData, errors, loading, setStep, setFormData, setErrors, signUp } = useSignUpStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const validateStep = () => {
    setErrors({
      firstName: '',
      lastName: '',
      birthday: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    let isValid = true;

    if (step === 'name') {
      if (!formData.firstName.trim()) {
        setErrors({ firstName: 'Enter first name' });
        isValid = false;
      }
    }

    else if (step === 'birthday') {
      const day = parseInt(formData.day);
      const year = parseInt(formData.year);
      const monthIndex = months.indexOf(formData.month);

      if (!formData.day || !formData.month || !formData.year ||
          day < 1 || day > 31 || year < 1900 || year > new Date().getFullYear() ||
          monthIndex === -1) {
        setErrors({ birthday: 'Enter a valid birth date' });
        isValid = false;
      }
    }

    else if (step === 'email') {
      if (!formData.email) {
        setErrors({ email: 'Choose a Gmail address' });
        isValid = false;
      } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setErrors({ email: 'Enter a valid email address' });
        isValid = false;
      }
    }

    else if (step === 'password') {
      if (!formData.password) {
        setErrors({ password: 'Enter a password' });
        isValid = false;
      } else if (formData.password.length < 8) {
        setErrors({ password: 'Use 8 characters or more for your password' });
        isValid = false;
      }

      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: "Those passwords didn't match. Try again." });
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    if (step === 'name') {
      setStep('birthday');
      onStepChange('birthday');
    }
    else if (step === 'birthday') {
      setStep('email');
      onStepChange('email');
    }
    else if (step === 'email') {
      setStep('password');
      onStepChange('password');
    }
    else {
      await signUp();
      router.push('/');
    }
  };

  const renderNameStep = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First name"
          error={errors.firstName}
          disabled={loading}
        />
        <Input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last name (optional)"
          error={errors.lastName}
          disabled={loading}
        />
      </div>
    </>
  );

  const renderBirthdayStep = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Select
          name="day"
          value={formData.day}
          onChange={handleChange}
          aria-label="Day"
          disabled={loading}
        >
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </Select>

        <Select
          name="month"
          value={formData.month}
          onChange={handleChange}
          aria-label="Month"
          disabled={loading}
        >
          <option value="">Month</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </Select>

        <Select
          name="year"
          value={formData.year}
          onChange={handleChange}
          aria-label="Year"
          disabled={loading}
        >
          <option value="">Year</option>
          {Array.from(
            { length: 100 },
            (_, i) => new Date().getFullYear() - i
          ).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Select>
      </div>

      <Select
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        aria-label="Gender"
        disabled={loading}
      >
        <option value="">Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </Select>

      {errors.birthday && (
        <p className="text-red-500 text-sm">{errors.birthday}</p>
      )}

      <button
        type="button"
        className="text-sm text-[#8ab4f8] hover:text-[#c2d9fc] cursor-pointer"
        disabled={loading}
      >
        Why we ask for birthday and gender
      </button>
    </div>
  );

  const renderEmailStep = () => (
    <div className="space-y-4">
      <div className="relative">
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email address"
          error={errors.email}
          disabled={loading}
        />
      </div>
      <p className="text-sm text-gray-400">
        You can use letters, numbers & periods
      </p>
      <button
        type="button"
        className="text-sm text-[#8ab4f8] hover:text-[#c2d9fc] cursor-pointer"
        disabled={loading}
      >
        Use your existing email address
      </button>
    </div>
  );

  const renderPasswordStep = () => (
    <div className="space-y-4">
      <Input
        type={formData.showPassword ? "text" : "password"}
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        error={errors.password}
        disabled={loading}
      />
      <Input
        type={formData.showPassword ? "text" : "password"}
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm"
        error={errors.confirmPassword}
        disabled={loading}
      />
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showPassword"
          checked={formData.showPassword}
          onChange={(e) => setFormData({ showPassword: e.target.checked })}
          className="w-4 h-4 rounded border-gray-600 bg-[#202124] checked:bg-[#1a73e8] focus:ring-[#1a73e8] focus:ring-offset-[#202124]"
          disabled={loading}
        />
        <label htmlFor="showPassword" className="text-gray-300 text-sm">
          Show password
        </label>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 'name' && renderNameStep()}
        {step === 'birthday' && renderBirthdayStep()}
        {step === 'email' && renderEmailStep()}
        {step === 'password' && renderPasswordStep()}

        <div className="flex justify-between items-center mt-12">
          <Button
            type="button"
            variant="text"
            onClick={() => router.push('/')}
            disabled={loading}
          >
            Sign in instead
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Next'}
          </Button>
        </div>
      </form>
    </div>
  );
}; 