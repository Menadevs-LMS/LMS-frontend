import { assets } from '../assets/assets';

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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-scroll z-50">
            <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-[550px] max-h-[750px] overflow-scroll">
                <h2 className="text-lg font-semibold mb-4">Add Quiz to Lecture</h2>

                <div className="mb-2">
                    <p>Quiz Title</p>
                    <input
                        type="text"
                        name="title"
                        value={quizData.title}
                        onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                        className="mt-1 block w-full border rounded py-1 px-2"
                    />
                </div>

                {/* Question Creation Section */}
                <div className="mb-2">
                    <p>Add Question</p>
                    <input
                        type="text"
                        name="questionText"
                        value={currentQuestion.questionText}
                        onChange={handleQuestionInputChange}
                        placeholder="Enter question text"
                        className="mt-1 block w-full border rounded py-1 px-2"
                    />
                </div>

                <div className="mb-2">
                    <p>Question Type</p>
                    <select
                        name="questionType"
                        value={currentQuestion.questionType}
                        onChange={handleQuestionTypeChange}
                        className="mt-1 block w-full border rounded py-1 px-2"
                    >
                        <option value="multiple-choice">Multiple Choice</option>
                        <option value="truth-sentence">True/False</option>
                        <option value="paragraph">Paragraph</option>
                    </select>
                </div>

                {/* Render different input based on question type */}
                {currentQuestion.questionType === 'multiple-choice' && (
                    <>
                        {currentQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-2 mb-2">
                                <input
                                    type="text"
                                    name="options"
                                    value={option}
                                    onChange={(e) => handleQuestionInputChange(e, index)}
                                    placeholder={`Option ${index + 1}`}
                                    className="flex-grow border rounded py-1 px-2"
                                />
                                <input
                                    type="radio"
                                    name="correctAnswer"
                                    value={option}
                                    checked={currentQuestion.correctAnswer === option}
                                    onChange={(e) => handleQuestionInputChange(e)}
                                />
                            </div>
                        ))}
                    </>
                )}

                <button
                    onClick={addQuestionToQuiz}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                    Add Question
                </button>

                {/* Display added questions */}
                {quizData.questions.map((q, index) => (
                    <div key={index} className="bg-gray-100 p-2 rounded mt-2 flex justify-between">
                        <span>{q.questionText}</span>
                        <button
                            onClick={() => removeQuestionFromQuiz(index)}
                            className="text-red-500"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => saveQuiz()}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
                >
                    Save Quiz to Lecture
                </button>

                <img
                    src={assets.cross_icon}
                    onClick={onClose}
                    className='absolute top-4 right-4 w-4 cursor-pointer'
                    alt="Close"
                />
            </div>
        </div>
    );
};

export default QuizModal