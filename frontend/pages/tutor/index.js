import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import ChatInterface from '../../components/tutor/ChatInterface';
import TutorSidebar from '../../components/tutor/TutorSidebar';
import { api } from '../../lib/api';

export default function TutorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      loadChatSessions();
    }
  }, [session]);

  const loadChatSessions = async () => {
    try {
      const sessions = await api.get('/tutor/sessions');
      setChatSessions(sessions);
      if (sessions.length > 0 && !currentSession) {
        setCurrentSession(sessions[0]);
      }
    } catch (error) {
      console.error('Failed to load chat sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = (subject = null) => {
    const newSession = {
      id: null,
      title: `New Chat${subject ? ` - ${subject}` : ''}`,
      subject,
      messages: [],
      updated_at: new Date().toISOString()
    };
    setCurrentSession(newSession);
    setSidebarOpen(false);
  };

  const handleSessionSelect = (session) => {
    setCurrentSession(session);
    setSidebarOpen(false);
  };

  const handleSessionUpdate = (updatedSession) => {
    setCurrentSession(updatedSession);
    loadChatSessions(); // Refresh the sessions list
  };

  if (status === 'loading' || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:shadow-none lg:border-r
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <TutorSidebar
            sessions={chatSessions}
            currentSession={currentSession}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-900 ml-2">
                {currentSession?.title || 'AI Tutor'}
              </h1>
              {currentSession?.subject && (
                <span className="ml-3 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {currentSession.subject}
                </span>
              )}
            </div>
            <button
              onClick={() => handleNewSession()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              New Chat
            </button>
          </div>

          {/* Chat interface */}
          <div className="flex-1 overflow-hidden">
            <ChatInterface
              session={currentSession}
              onSessionUpdate={handleSessionUpdate}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}