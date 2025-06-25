import { useState, useEffect } from 'react';
import { Clock, CheckCircle } from 'lucide-react';

export default function QuizInterface({ quiz, onSubmit, onExit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz.time_limit * 60 || null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!timeLeft) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const answerArray = quiz.questions.map((_, index) => answers[index] ?? -1);
    
    onSubmit({
      quiz_id: quiz.id,
      answers: answerArray,
      time_taken: timeTaken
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">{quiz.title}</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</p>
          </div>
          <div className="flex items-center space-x-4">
            {timeLeft && (
              <div className="flex items-center text-orange-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onExit}
              className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded"
            >
              Exit
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-medium mb-6">{question.question}</h2>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion, index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                answers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {answers[currentQuestion] === index && (
                    <CheckCircle className="h-4 w-4 text-white" />
                  )}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex space-x-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                index === currentQuestion
                  ? 'bg-blue-500 text-white'
                  : answers[index] !== undefined
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        
        {currentQuestion === quiz.questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}