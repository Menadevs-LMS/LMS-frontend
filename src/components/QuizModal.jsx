import { useState } from 'react';

const QuizModal = ({
    isOpen,
    onClose,
    quizData,
    currentQuestion,
    handleQuestionTypeChange,
    handleQuestionInputChange,
    addQuestionToQuiz,
    removeQuestionFromQuiz,
    saveQuiz,
    setQuizData,
}) => {
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);

    if (!isOpen) return null;

    const handleAddQuestion = () => {
        setIsAddingQuestion(true);
        addQuestionToQuiz();
        setTimeout(() => setIsAddingQuestion(false), 300);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm overflow-auto z-50 p-4">
            <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-6 rounded-lg shadow-xl relative w-full max-w-[600px] max-h-[85vh] overflow-auto transition-all transform animate-fadeIn">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-3">
                    Add Quiz to Lecture
                </h2>

                <div className="space-y-5">
                    <div className="form-group">
                        <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                            Quiz Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={quizData.title}
                            onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter a descriptive title for this quiz"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200"
                        />
                    </div>

                    {/* Question Creation Section */}
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
                                    onChange={handleQuestionTypeChange}
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

                        {/* Render different input based on question type */}
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
                                                value={option}
                                                checked={currentQuestion.correctAnswer === option}
                                                onChange={(e) => handleQuestionInputChange(e)}
                                                className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
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
                                    Correct Answer
                                </label>
                                <div className="flex gap-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            value="true"
                                            checked={currentQuestion.correctAnswer === "true"}
                                            onChange={(e) => handleQuestionInputChange(e)}
                                            className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">True</span>
                                    </label>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="correctAnswer"
                                            value="false"
                                            checked={currentQuestion.correctAnswer === "false"}
                                            onChange={(e) => handleQuestionInputChange(e)}
                                            className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">False</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {currentQuestion.questionType === 'paragraph' && (
                            <div className="space-y-3 mb-4">
                                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                                    Sample Answer (Optional)
                                </label>
                                <textarea
                                    name="correctAnswer"
                                    value={currentQuestion.correctAnswer || ""}
                                    onChange={(e) => handleQuestionInputChange(e)}
                                    placeholder="Enter a sample answer or leave blank"
                                    rows="3"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200"
                                ></textarea>
                            </div>
                        )}

                        <button
                            onClick={handleAddQuestion}
                            disabled={isAddingQuestion || !currentQuestion.questionText}
                            className={`flex items-center justify-center w-full px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${!currentQuestion.questionText
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
                    {quizData.questions.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                                <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                </svg>
                                Quiz Questions ({quizData.questions.length})
                            </h3>
                            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                                {quizData.questions.map((q, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm flex justify-between items-center group hover:border-blue-300 dark:hover:border-blue-500 transition-colors duration-200">
                                        <div className="flex items-center">
                                            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full mr-2">
                                                Q{index + 1}
                                            </span>
                                            <span className="text-gray-800 dark:text-gray-200 font-medium">{q.questionText}</span>
                                        </div>
                                        <button
                                            onClick={() => removeQuestionFromQuiz(index)}
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
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={saveQuiz}
                        disabled={quizData.questions.length === 0 || !quizData.title}
                        className={`flex-1 px-4 py-2.5 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 ${quizData.questions.length === 0 || !quizData.title
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
                                : 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                            }`}
                    >
                        <div className="flex items-center justify-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Save Quiz to Lecture
                        </div>
                    </button>
                </div>

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

export default QuizModal;