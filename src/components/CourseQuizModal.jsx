import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define form validation schema
const questionSchema = z.object({
  questionText: z.string().min(1, { message: "Question text is required" }),
  questionType: z.enum(["multiple-choice", "truth-sentence", "paragraph"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  truthAnswers: z.array(z.string()).optional(),
  paragraphAnswer: z.string().optional()
});

const quizSchema = z.object({
  title: z.string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be less than 100 characters" }),
  questions: z.array(questionSchema)
    .min(1, { message: "At least one question is required" })
});

const CourseQuizModal = ({
  isOpen,
  onClose,
  quizData,
  saveQuiz
}) => {
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  
  console.log("CourseQuizModal - Initial Quiz Data:", quizData);
  
  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isDirty }
  } = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: []
    }
  });
  
  // Current question being edited
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    truthAnswers: [],
    paragraphAnswer: ''
  });

  // Initialize form with quiz data when the modal opens
  useEffect(() => {
    if (isOpen && quizData) {
      console.log("Initializing course quiz form with data:", quizData);
      
      // Ensure the quiz data has the correct structure
      const formattedQuizData = {
        title: quizData.title || '',
        questions: Array.isArray(quizData.questions) 
          ? quizData.questions.map(q => ({
              questionText: q.questionText || '',
              questionType: q.questionType || 'multiple-choice',
              options: q.options || [],
              correctAnswer: q.correctAnswer || '',
              truthAnswers: q.truthAnswers || [],
              paragraphAnswer: q.paragraphAnswer || ''
            }))
          : []
      };
      
      reset(formattedQuizData);
    }
  }, [isOpen, quizData, reset]);

  // Handle question type change
  const handleQuestionTypeChange = (type) => {
    setCurrentQuestion(prev => ({
      ...prev,
      questionType: type,
      options: type === 'multiple-choice' ? ['', '', '', ''] : [],
      correctAnswer: '',
      truthAnswers: [],
      paragraphAnswer: ''
    }));
  };

  // Handle input changes for current question
  const handleQuestionInputChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name === 'options' && index !== null) {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions
      }));
      return;
    }

    if (name === 'truthAnswers') {
      setCurrentQuestion(prev => ({
        ...prev,
        truthAnswers: value.split(',').map(t => t.trim()).filter(t => t.length > 0)
      }));
      return;
    }

    setCurrentQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle quiz title change
  const handleQuizTitleChange = (e) => {
    setValue('title', e.target.value, { shouldValidate: true, shouldDirty: true });
  };

  // Add question to quiz
  const addQuestionToQuiz = () => {
    // Validate question
    if (!currentQuestion.questionText) {
      alert('Please enter question text');
      return;
    }

    if (currentQuestion.questionType === 'multiple-choice') {
      const allOptionsFilled = currentQuestion.options.some(opt => opt.trim() !== '');
      if (!allOptionsFilled || !currentQuestion.correctAnswer) {
        alert('Please fill at least one option and select a correct answer');
        return;
      }
    }

    // Add question to form data
    const currentQuestions = getValues('questions') || [];
    setValue('questions', [...currentQuestions, { ...currentQuestion }], 
      { shouldValidate: true, shouldDirty: true });

    console.log("Added question to quiz:", currentQuestion);

    // Reset current question
    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      truthAnswers: [],
      paragraphAnswer: ''
    });
    
    setIsAddingQuestion(true);
    setTimeout(() => setIsAddingQuestion(false), 300);
  };

  // Remove question from quiz
  const removeQuestion = (index) => {
    console.log("Removing question at index:", index);
    const questions = getValues('questions');
    setValue('questions', questions.filter((_, i) => i !== index), 
      { shouldValidate: true, shouldDirty: true });
  };

  // Handle form submission
  const onSubmit = (data) => {
    // Create a structured quiz object with all required fields
    const structuredQuiz = {
      title: data.title,
      questions: data.questions.map(question => ({
        questionText: question.questionText,
        questionType: question.questionType,
        options: question.options || [],
        correctAnswer: question.correctAnswer || '',
        truthAnswers: question.truthAnswers || [],
        paragraphAnswer: question.paragraphAnswer || ''
      }))
    };
    
    console.log("Course quiz data being saved:", structuredQuiz);
    
    // Call the parent component's saveQuiz function
    saveQuiz(structuredQuiz);
    onClose();
  };

  // Check if add button should be disabled
  const isAddButtonDisabled = !currentQuestion.questionText ||
    (currentQuestion.questionType === 'multiple-choice' &&
      (currentQuestion.options.every(opt => opt.trim() === '') || !currentQuestion.correctAnswer));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm overflow-auto z-50 p-4">
      <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-6 rounded-lg shadow-xl relative w-full max-w-2xl max-h-[85vh] overflow-auto transition-all transform">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-3">
          Course Quiz Configuration
        </h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Quiz Title
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="Enter a descriptive title for this quiz"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Create New Question
            </h3>

            <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Question Text
              </label>
              <input
                type="text"
                name="questionText"
                value={currentQuestion.questionText}
                onChange={handleQuestionInputChange}
                placeholder="Enter your question here"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200"
              />
            </div>

            <div className="form-group mb-4">
              <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Question Type
              </label>
              <div className="relative">
                <select
                  name="questionType"
                  value={currentQuestion.questionType}
                  onChange={(e) => handleQuestionTypeChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200 appearance-none"
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="truth-sentence">True/False</option>
                  <option value="paragraph">Paragraph</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Different input types based on question type */}
            {currentQuestion.questionType === 'multiple-choice' && (
              <div className="space-y-3 mb-4">
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  Answer Options
                </label>
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        name="options"
                        value={option}
                        onChange={(e) => handleQuestionInputChange(e, index)}
                        placeholder={`Option ${index + 1}`}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200"
                      />
                      <div className="absolute left-0 inset-y-0 flex items-center pl-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === option}
                        onChange={() => handleQuestionInputChange({
                          target: {
                            name: 'correctAnswer',
                            value: option
                          }
                        })}
                        className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                        disabled={!option.trim()}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Correct</span>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {currentQuestion.questionType === 'truth-sentence' && (
              <div className="space-y-3 mb-4">
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  True Statements (comma-separated)
                </label>
                <input
                  type="text"
                  name="truthAnswers"
                  value={currentQuestion.truthAnswers ? currentQuestion.truthAnswers.join(', ') : ''}
                  onChange={handleQuestionInputChange}
                  placeholder="Enter comma-separated true statements"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  Example: The sky is blue, Water is wet
                </p>
              </div>
            )}

            {currentQuestion.questionType === 'paragraph' && (
              <div className="space-y-3 mb-4">
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  Expected Answer (Optional)
                </label>
                <textarea
                  name="paragraphAnswer"
                  value={currentQuestion.paragraphAnswer || ""}
                  onChange={handleQuestionInputChange}
                  placeholder="Enter a sample answer or leave blank"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200 resize-none"
                ></textarea>
              </div>
            )}

<button
              type="button"
              onClick={addQuestionToQuiz}
              disabled={isAddButtonDisabled}
              className={`flex items-center justify-center w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${isAddButtonDisabled
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-sm'
                }`}
            >
              {isAddingQuestion ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              )}
              Add Question to Quiz
            </button>
          </div>

          {/* Display added questions */}
          {watch('questions')?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                Quiz Questions ({watch('questions').length})
              </h3>
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                {watch('questions').map((question, index) => (
                  <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm flex justify-between items-center group hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200">
                    <div className="flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full mr-2">
                        Q{index + 1}
                      </span>
                      <div>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">
                          {question.questionText}
                        </span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded">
                          {question.questionType === 'multiple-choice' ? 'Multiple Choice' :
                            question.questionType === 'truth-sentence' ? 'True/False' : 'Paragraph'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-200 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                      aria-label="Remove question"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              {errors.questions && (
                <p className="text-red-500 text-sm mt-1">{errors.questions.message}</p>
              )}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty || watch('questions')?.length === 0 || !watch('title')}
              className={`flex-1 px-4 py-2.5 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 ${!isDirty || watch('questions')?.length === 0 || !watch('title')
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Save Course Quiz
              </div>
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 focus:outline-none"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CourseQuizModal;