'use client';

import { useRouter } from 'next/navigation';
import { useAuthCheck } from './utils/authCheck';

export default function App() {
  const router = useRouter();
  const isAuthenticated = useAuthCheck();

  if (!isAuthenticated) {
    router.push('/login');
    return <div>Redirecting to login...</div>;
  }

  router.push('/dashboard');

  return null;
}
