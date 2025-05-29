import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { X, Clock, CheckCircle, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const createQuizSchema = (questions) => {
  const schemaFields = {};

  questions.forEach((question, index) => {
    if (question.questionType === 'multiple-choice') {
      schemaFields[`question_${index}`] = z.string().optional();
    } else if (question.questionType === 'truth-sentence') {
      schemaFields[`question_${index}`] = z.string().optional();
    } else if (question.questionType === 'paragraph') {
      schemaFields[`question_${index}`] = z.string().optional();
    }
  });

  return z.object(schemaFields);
};

const QuizModal = ({
  isOpen,
  onClose,
  quiz,
  courseId,
  lectureId,
  progress,
  onQuizComplete,
  updateLectuerProgress,
  updateCourseProgress,
  chooseQuiz,
  quizCompleted,
  setQuizCompleted,
  lastScore,
  getCourseDetailsWithProgress
}) => {
  const dispatch = useDispatch();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isClosing, setIsClosing] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); 
  const timerRef = useRef(null);

  const questions = quiz?.questions || [];
  const quizSchema = createQuizSchema(questions);

  const {
    register,
    setValue,
    getValues,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(quizSchema),
    mode: 'onChange'
  });
  console.log("lastScore,,", lastScore)
  const resetQuiz = useCallback(() => {
    console.log('Resetting quiz state');
    setCurrentQuestion(0);
    setQuizCompleted(false);
    setScore(0);
    setUserAnswers({});
    setTimeLeft(0);
    setIsSubmitting(false);
    setQuizStarted(false); 
    reset();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [reset, setQuizCompleted]);

  const handleTimeUp = useCallback(async () => {
    const currentAnswer = getValues(`question_${currentQuestion}`);
    if (!currentAnswer) {
      setValue(`question_${currentQuestion}`, '');
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const formData = getValues();
      await onSubmitQuiz(formData);
    }
  }, [currentQuestion, questions.length, getValues, setValue]);

  useEffect(() => {
    if (isOpen && quiz) {
      console.log('Quiz modal opened with chooseQuiz:', chooseQuiz);
      if (!quizCompleted) {
        resetQuiz();
      }
    }
  }, [isOpen, quiz?.id, chooseQuiz, resetQuiz, quizCompleted, quiz]); 

  useEffect(() => {
    if (questions[currentQuestion] && !quizCompleted && isOpen && !quizStarted) {
      const duration = parseInt(questions[currentQuestion].questionDuration) * 60;
      setTimeLeft(duration);
      setQuizStarted(true); 
    }
  }, [currentQuestion, questions, quizCompleted, isOpen, quizStarted]);

  useEffect(() => {
    if (timeLeft > 0 && !quizCompleted && isOpen) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else if (timeLeft === 0 && !quizCompleted && isOpen && questions.length > 0 && quizStarted) {
      handleTimeUp();
    }
  }, [timeLeft, quizCompleted, isOpen, handleTimeUp, questions.length, quizStarted]);

  const handleNextQuestion = async () => {
    const currentAnswer = getValues(`question_${currentQuestion}`);
    if (!currentAnswer) {
      setValue(`question_${currentQuestion}`, '');
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setQuizStarted(false); 
    } else {
      const formData = getValues();
      await onSubmitQuiz(formData);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = (answers) => {
    let correctAnswers = 0;

    questions.forEach((question, index) => {
      const userAnswer = answers[`question_${index}`];

      if (!userAnswer) return;

      if (question.questionType === 'multiple-choice') {
        if (userAnswer === question.correctAnswer) {
          correctAnswers++;
        }
      } else if (question.questionType === 'truth-sentence') {
        if (question.truthAnswers.includes(userAnswer)) {
          correctAnswers++;
        }
      } else if (question.questionType === 'paragraph') {
        const expectedAnswer = question.paragraphAnswer.toLowerCase();
        const userAnswerLower = userAnswer.toLowerCase();

        const keywords = expectedAnswer.split(' ').filter(word => word.length > 3);
        const matchedKeywords = keywords.filter(keyword =>
          userAnswerLower.includes(keyword)
        );

        if (matchedKeywords.length >= Math.ceil(keywords.length * 0.5)) {
          correctAnswers++;
        }
      }
    });

    return Math.round((correctAnswers / questions.length) * 100);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setQuizStarted(false);
    }
  };

  const onSubmitQuiz = async (data) => {
    setIsSubmitting(true);

    try {
      const calculatedScore = calculateScore(data);
      setScore(calculatedScore);
      setUserAnswers(data);

      console.log('Submitting quiz with chooseQuiz:', chooseQuiz);

      if (chooseQuiz === 0) {
        if (updateLectuerProgress && courseId && lectureId) {
          await dispatch(updateLectuerProgress({
            courseId: courseId,
            lectureId: lectureId,
            payload: {
              viewed: true,
              dateViewed: new Date().toISOString(),
              quizScore: calculatedScore, completeQuiz: true
            }
          })).unwrap();
          await dispatch(getCourseDetailsWithProgress(courseId)).unwrap();
        }
      } else if (chooseQuiz === 1) {
        if (updateCourseProgress && courseId) {
          await dispatch(updateCourseProgress({
            id: courseId,
            payload: {
              completed: true,
              completionDate: new Date().toISOString(),
              quizScore: calculatedScore
            }
          })).unwrap();
          await dispatch(getCourseDetailsWithProgress(courseId)).unwrap();

        }
      }

      setQuizCompleted(true);

      if (onQuizComplete) {
        onQuizComplete(calculatedScore, data);
      }

    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = async () => {
    if (isClosing) return;

    setIsClosing(true);

    if (!quizCompleted) {
      const confirmClose = await new Promise((resolve) => {
        const result = confirm('Are you sure you want to close the quiz? Your progress will be lost.');
        resolve(result);
      });

      if (!confirmClose) {
        setIsClosing(false);
        return;
      }
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    resetQuiz();
    onClose();
    setIsClosing(false);
  };

  const handleRetakeQuiz = () => {
    resetQuiz();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!isOpen || !quiz) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{quiz.title}</h2>
              {!quizCompleted && (
                <p className="text-blue-100 mt-1">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              )}
            </div>
            <button
              onClick={closeModal}
              disabled={isClosing}
              className="p-2 hover:bg-blue-800 rounded-full transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!quizCompleted && (
            <div className="mt-4">
              {/* Progress Bar */}
              <div className="w-full bg-blue-800 rounded-full h-2">
                <div
                  className="bg-blue-200 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="flex items-center mt-3 text-blue-100">
                <Clock className="w-4 h-4 mr-2" />
                <span className={`font-mono text-lg ${timeLeft <= 30 ? 'text-red-300' : ''}`}>
                  {formatTime(timeLeft)}
                </span>
                {timeLeft <= 30 && <span className="ml-2 text-sm">Time running out!</span>}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {!quizCompleted ? (
            <div className="space-y-6">
              {questions[currentQuestion] && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].questionText}
                  </h3>

                  {questions[currentQuestion].questionType === 'multiple-choice' && (
                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            value={option}
                            {...register(`question_${currentQuestion}`)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {questions[currentQuestion].questionType === 'truth-sentence' && (
                    <div className="space-y-3">
                      {['True', 'False'].map((option) => (
                        <label
                          key={option}
                          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            value={option}
                            {...register(`question_${currentQuestion}`)}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {questions[currentQuestion].questionType === 'paragraph' && (
                    <div>
                      <textarea
                        {...register(`question_${currentQuestion}`)}
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                        rows="6"
                        placeholder="Enter your answer here..."
                      />
                    </div>
                  )}

                  {errors[`question_${currentQuestion}`] && (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors[`question_${currentQuestion}`].message}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h3>
                <p className="text-gray-600">Congratulations on finishing the quiz.</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {score > 0 ? score : (lastScore || 0)}%
                </div>
                <p className="text-gray-700">
                  {score > 0 ? 'Your final score' : 'Your previous score'}
                </p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Questions answered: {questions.length}</p>
                  <p>Correct answers: {Math.round(((score > 0 ? score : (lastScore || 0)) / 100) * questions.length)}</p>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                {/* Only show retake button for lecture quizzes, not course final quiz */}
                <button
                  onClick={handleRetakeQuiz}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Retake Quiz
                </button>

                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Course
                </button>
              </div>
            </div>
          )}
        </div>

        {!quizCompleted && (
          <div className="bg-gray-50 p-6 border-t">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors ${index === currentQuestion
                      ? 'bg-blue-600'
                      : index < currentQuestion
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                      }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={isSubmitting}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentQuestion === questions.length - 1 ? (
                  <>
                    Submit Quiz
                    {isSubmitting && (
                      <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;