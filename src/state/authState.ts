import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';

interface SignInState {
  email: string;
  password: string;
  error: string;
  step: 'email' | 'password';
  loading: boolean;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  setStep: (step: 'email' | 'password') => void;
  setLoading: (loading: boolean) => void;
  checkEmail: (email: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<void>;
}

interface SignUpState {
  step: 'name' | 'birthday' | 'email' | 'password';
  formData: {
    firstName: string;
    lastName: string;
    day: string;
    month: string;
    year: string;
    gender: string;
    email: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
  };
  errors: {
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  loading: boolean;
  setStep: (step: 'name' | 'birthday' | 'email' | 'password') => void;
  setFormData: (data: Partial<SignUpState['formData']>) => void;
  setErrors: (errors: Partial<SignUpState['errors']>) => void;
  setLoading: (loading: boolean) => void;
  resetForm: () => void;
  signUp: () => Promise<void>;
}

export const useSignInStore = create<SignInState>((set, get) => ({
  email: '',
  password: '',
  error: '',
  step: 'email',
  loading: false,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error) => set({ error }),
  setStep: (step) => set({ step }),
  setLoading: (loading) => set({ loading }),
  checkEmail: async (email) => {
    try {
      set({ loading: true, error: '' });

      // Try to reset password for the email - this is a safe way to check if the account exists
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });

      // If there's no error, the email exists
      if (!error) {
        return true;
      }

      // If we get an invalid email error, the account doesn't exist
      if (error.message.includes('Email not found')) {
        set({ error: 'No account found with this email. Please create an account first.' });
        return false;
      }

      // For other errors, we'll assume the account exists but there might be other issues
      console.error('Error checking email:', error);
      return true;
    } catch (error) {
      console.error('Error in checkEmail:', error);
      set({ error: 'An error occurred. Please try again.' });
      return false;
    } finally {
      set({ loading: false });
    }
  },
  signIn: async (email, password) => {
    try {
      set({ loading: true, error: '' });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          set({ error: 'Wrong password. Try again.' });
        } else if (error.message.includes('Email not confirmed')) {
          set({ error: 'Please verify your email address before signing in.' });
        } else {
          set({ error: error.message });
        }
        return;
      }

      if (data?.user) {
        alert('Login succeeded!');
        // You might want to redirect here or update the UI
      }
    } catch (error) {
      console.error('Error in signIn:', error);
      set({ error: 'An error occurred. Please try again.' });
    } finally {
      set({ loading: false });
    }
  }
}));

export const useSignUpStore = create<SignUpState>((set, get) => ({
  step: 'name',
  formData: {
    firstName: '',
    lastName: '',
    day: '',
    month: '',
    year: '',
    gender: '',
    email: '',
    password: '',
    confirmPassword: '',
    showPassword: false,
  },
  errors: {
    firstName: '',
    lastName: '',
    birthday: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  loading: false,
  setStep: (step) => set({ step }),
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setErrors: (errors) => set((state) => ({ errors: { ...state.errors, ...errors } })),
  setLoading: (loading) => set({ loading }),
  resetForm: () => set({
    step: 'name',
    formData: {
      firstName: '',
      lastName: '',
      day: '',
      month: '',
      year: '',
      gender: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
    },
    errors: {
      firstName: '',
      lastName: '',
      birthday: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    loading: false,
  }),
  signUp: async () => {
    const state = get();
    try {
      set({ loading: true });
      const { formData } = state;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            birth_date: `${formData.year}-${formData.month}-${formData.day}`,
            gender: formData.gender,
          },
        },
      });

      if (error) {
        set({ errors: { 
          firstName: '',
          lastName: '',
          birthday: '',
          email: error.message,
          password: '',
          confirmPassword: ''
        }});
        return;
      }

      if (data?.user?.identities?.length === 0) {
        set({ errors: {
          firstName: '',
          lastName: '',
          birthday: '',
          email: 'This email is already registered. Please sign in instead.',
          password: '',
          confirmPassword: ''
        }});
        return;
      }

      alert('Account created successfully! Please check your email for verification.');
      state.resetForm();
    } catch (error) {
      console.error('Error in signUp:', error);
      set({ errors: {
        firstName: '',
        lastName: '',
        birthday: '',
        email: 'An error occurred. Please try again.',
        password: '',
        confirmPassword: ''
      }});
    } finally {
      set({ loading: false });
    }
  },
})); 