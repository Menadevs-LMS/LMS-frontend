import { assets } from '../assets/assets';

const CourseQuizModal = ({
    isOpen,
    onClose,
    quizData,
    currentQuestion,
    handleQuestionTypeChange,
    handleQuestionInputChange,
    addQuestionToQuiz,
    removeQuestionFromQuiz,
    saveQuiz,
    setQuizData
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-scroll z-50">
            <div className="bg-white text-gray-700 p-6 rounded-lg relative w-full max-w-2xl max-h-[90vh] overflow-auto">
                <h2 className="text-2xl font-bold mb-6">Course Quiz Configuration</h2>

                {/* Quiz Title */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Quiz Title</label>
                    <input
                        type="text"
                        value={quizData.title}
                        onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter quiz title"
                    />
                </div>

                {/* Question Type Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Question Type</label>
                    <div className="grid grid-cols-3 gap-3">
                        {['multiple-choice', 'truth-sentence', 'paragraph'].map((type) => (
                            <button
                                key={type}
                                onClick={() => handleQuestionTypeChange(type)}
                                className={`p-3 rounded-lg transition-colors ${currentQuestion.questionType === type
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                {type.replace('-', ' ').toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Question Text</label>
                    <textarea
                        name="questionText"
                        value={currentQuestion.questionText}
                        onChange={handleQuestionInputChange}
                        className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your question here..."
                    />
                </div>

                {/* Answer Section */}
                <div className="mb-8">
                    {currentQuestion.questionType === 'multiple-choice' && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium mb-2">Multiple Choice Options</label>
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        name="options" // Add name attribute
                                        value={option}
                                        onChange={(e) => handleQuestionInputChange(e, index)} // Pass index
                                        className="flex-1 p-2 border rounded"
                                        placeholder={`Option ${index + 1}`}
                                    />
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
                                        className="w-5 h-5"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {currentQuestion.questionType === 'truth-sentence' && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium mb-2">True/False Statements</label>
                            <input
                                type="text"
                                value={currentQuestion.truthAnswers.join(', ')}
                                onChange={(e) => handleQuestionInputChange({
                                    target: {
                                        name: 'truthAnswers',
                                        value: e.target.value.split(',').map(t => t.trim())
                                    }
                                })}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Enter comma-separated true statements"
                            />
                        </div>
                    )}

                    {currentQuestion.questionType === 'paragraph' && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium mb-2">Expected Answer</label>
                            <textarea
                                name="paragraphAnswer"
                                value={currentQuestion.paragraphAnswer}
                                onChange={handleQuestionInputChange}
                                className="w-full p-3 border rounded-lg h-32"
                                placeholder="Enter expected paragraph answer"
                            />
                        </div>
                    )}
                </div>

                {/* Add Question Button */}
                <button
                    onClick={addQuestionToQuiz}
                    className="w-full mb-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Add Question to Quiz
                </button>

                {/* Added Questions List */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Current Questions</h3>
                    <div className="space-y-3">
                        {quizData.questions.map((question, index) => (
                            <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <div>
                                    <p className="font-medium">{question.questionText}</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Type: {question.questionType.replace('-', ' ')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeQuestionFromQuiz(index)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={saveQuiz}
                        className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Save Course Quiz
                    </button>
                </div>

                {/* Close Icon */}
                <img
                    src={assets.cross_icon}
                    onClick={onClose}
                    className="absolute top-6 right-6 w-5 h-5 cursor-pointer hover:opacity-80"
                    alt="Close modal"
                />
            </div>
        </div>
    );
};


export default CourseQuizModal