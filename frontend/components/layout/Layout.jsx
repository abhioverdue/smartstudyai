import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function Layout({ children, showSidebar = true }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    // Redirect to login if not authenticated and trying to access protected routes
    const protectedRoutes = ['/dashboard', '/quiz', '/tutor', '/progress', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => 
      router.pathname.startsWith(route)
    );
    
    if (!session && isProtectedRoute) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {showSidebar && session && <Sidebar />}
        <main className={cn("flex-1", showSidebar && session ? "ml-0" : "")}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
