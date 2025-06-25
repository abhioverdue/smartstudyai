import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  LayoutDashboard, 
  Brain, 
  BookOpen, 
  BarChart3, 
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Tutor', href: '/tutor', icon: Brain },
  { name: 'Quizzes', href: '/quiz', icon: BookOpen },
  { name: 'Progress', href: '/progress', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Help', href: '/help', icon: HelpCircle },
];

export default function Sidebar({ className }) {
  const router = useRouter();

  return (
    <div className={cn("bg-white w-64 min-h-screen border-r border-gray-200", className)}>
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary-50 text-primary-700 border-r-2 border-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-primary-500" : "text-gray-400 group-hover:text-gray-500"
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        {/* Bottom section */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                  SmartStudy AI+ v1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}