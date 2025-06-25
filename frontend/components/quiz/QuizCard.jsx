import { Clock, BookOpen, Star, Play } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export default function QuizCard({ quiz, onStart }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-600">{quiz.subject}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
          {quiz.difficulty}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{quiz.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {quiz.time_limit ? `${quiz.time_limit} min` : 'No limit'}
          </span>
          <span>{quiz.questions?.length || 0} questions</span>
        </div>
        {quiz.is_ai_generated && (
          <span className="flex items-center text-purple-600">
            <Star className="h-4 w-4 mr-1" />
            AI Generated
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          Created {formatDate(quiz.created_at)}
        </span>
        <button
          onClick={() => onStart(quiz.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
        >
          <Play className="h-4 w-4" />
          <span>Start Quiz</span>
        </button>
      </div>
    </div>
  );
}