import { CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';

export default function QuizResults({ quiz, attempt, onRetake, onViewQuizzes }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (score) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    return 'F';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Score Summary */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
        <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-gray-600 mb-6">{quiz.title}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className={`text-4xl font-bold ${getScoreColor(attempt.score)}`}>
              {Math.round(attempt.score)}%
            </div>
            <div className="text-gray-600">Score</div>
            <div className="text-2xl font-semibold text-gray-800 mt-1">
              {getGrade(attempt.score)}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-4xl font-bold text-blue-600">
              {attempt.answers.filter((answer, index) => 
                answer === quiz.questions[index]?.correct_answer
              ).length}
            </div>
            <div className="text-gray-600">Correct</div>
            <div className="text-lg text-gray-500 mt-1">
              out of {quiz.questions.length}
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-4xl font-bold text-purple-600">
              <Clock className="h-8 w-8 inline-block mr-2" />
            </div>
            <div className="text-gray-600">Time</div>
            <div className="text-lg text-gray-500 mt-1">
              {formatTime(attempt.time_taken)}
            </div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Question Review</h2>
        
        <div className="space-y-6">
          {quiz.questions.map((question, index) => {
            const userAnswer = attempt.answers[index];
            const correctAnswer = question.correct_answer;
            const isCorrect = userAnswer === correctAnswer;
            
            return (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium">Question {index + 1}</h3>
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                
                <p className="mb-4">{question.question}</p>
                
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-lg border ${
                        optionIndex === correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : optionIndex === userAnswer && !isCorrect
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        <div className="flex space-x-2">
                          {optionIndex === correctAnswer && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                              Correct
                            </span>
                          )}
                          {optionIndex === userAnswer && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                              Your Answer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {question.explanation && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={onRetake}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          Retake Quiz
        </button>
        <button
          onClick={onViewQuizzes}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium"
        >
          View All Quizzes
        </button>
      </div>
    </div>
  );
}