import { useState, useEffect } from 'react';
import { Plus, MessageSquare, Clock, Trash2 } from 'lucide-react';
import { tutorAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TutorSidebar({ 
  currentSessionId, 
  onSessionSelect, 
  onNewSession 
}) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await tutorAPI.getSessions();
      setSessions(response.data);
    } catch (error) {
      toast.error('Failed to load chat sessions');
      console.error('Sessions error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = () => {
    onNewSession();
  };

  const truncateMessage = (message, maxLength = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b">
        <button
          onClick={handleNewSession}
          className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Chat History</h3>
        
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">
              No chat sessions yet. Start a conversation with your AI tutor!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg border transition-colors",
                  currentSessionId === session.id
                    ? "bg-primary-50 border-primary-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {session.title}
                  </h4>
                  <span className="text-xs text-gray-500 ml-2">
                    {formatDate(session.updated_at)}
                  </span>
                </div>
                
                {session.subject && (
                  <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded mb-1">
                    {session.subject}
                  </span>
                )}
                
                {session.last_message && (
                  <p className="text-xs text-gray-600">
                    {truncateMessage(session.last_message)}
                  </p>
                )}
                
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{formatDate(session.updated_at)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-xs text-gray-500 text-center">
          <p>AI-powered tutoring by SmartStudy AI+</p>
          <p className="mt-1">Ask questions, get explanations, learn better!</p>
        </div>
      </div>
    </div>
  );
}