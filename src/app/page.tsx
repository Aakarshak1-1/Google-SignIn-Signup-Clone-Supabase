import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignIn } from '@/components/auth/SignIn';

export default function Home() {
  return (
    <AuthLayout
      title="Sign in"
      subtitle="with your Google Account. This account will be available to other Google apps in the browser."
    >
      <SignIn />
    </AuthLayout>
  );
}
