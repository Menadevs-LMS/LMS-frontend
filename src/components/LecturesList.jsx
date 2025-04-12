const LecturesList = ({ lectures, openQuizModal, handleRemoveLecture, handleEditLecture }) => {
  return (
    <div className="mt-6">
      <h3 className="font-medium text-xl mb-4 text-lms-text-primary">Course Lectures</h3>

      {lectures.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium mb-3 text-lms-text-secondary">Added Lectures:</h4>
          <ul className="space-y-3">
            {lectures.map((lecture, index) => (
              <li 
                key={lecture.id} 
                className="flex justify-between items-center p-3 bg-lms-bg-tertiary border border-lms-border rounded-md shadow-lms-card"
              >
                <div>
                  <span className="font-medium text-lms-text-primary">
                    {index + 1}. {lecture.title}
                  </span>
                  <p className="text-sm text-lms-neutral mt-1">
                    {lecture.Duration} min {lecture.freePreview ? '(Free Preview)' : ''}
                  </p>
                  {lecture.quiz && (
                    <p className="text-sm text-lms-text-primary mt-1">
                      Quiz Added ({lecture.quiz.questions.length} questions)
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {handleEditLecture && (
                    <button
                      type="button"
                      onClick={() => handleEditLecture(lecture.id)}
                      className="text-lms-accent-primary px-2 py-1 hover:bg-lms-accent-light rounded transition-all"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openQuizModal(lecture.id)}
                    className="text-lms-accent-primary px-2 py-1 hover:bg-lms-accent-light rounded transition-all"
                  >
                    {lecture.quiz ? 'Edit Quiz' : 'Add Quiz'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveLecture(lecture.id)}
                    className="text-red-500 px-2 py-1 hover:bg-red-500/10 rounded transition-all"
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