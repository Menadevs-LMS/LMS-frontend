const LecturesList = ({ lectures, openQuizModal, handleRemoveLecture, handleEditLecture, isEditCourse }) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium text-lg mb-2">Course Lectures</h3>

      {lectures.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-2">Added Lectures:</h4>
          <ul className="space-y-2">
            {lectures.map((lecture, index) => (
              <li key={lecture.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                <div>
                  <span className="font-medium">{index + 1}. {lecture.title}</span>
                  <p className="text-sm text-gray-600">
                    {lecture.Duration} min {lecture.freePreview ? '(Free Preview)' : ''}
                  </p>
                  {lecture.quiz && (
                    <p className="text-sm text-green-600">
                      Quiz Added ({lecture.quiz.questions.length} questions)
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {isEditCourse &&
                    <button
                      type="button"
                      onClick={() => handleEditLecture(lecture.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                  }
                  <button
                    type="button"
                    onClick={() => openQuizModal(lecture.id)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {lecture.quiz ? 'Edit Quiz' : 'Add Quiz'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveLecture(lecture.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LecturesList;