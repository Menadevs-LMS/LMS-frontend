import React from 'react';
import { Pencil, Trash2, Play, FileText, PlusCircle } from 'lucide-react';

const LecturesList = ({ 
  lectures = [], 
  openQuizModal, 
  handleRemoveLecture, 
  handleEditLecture, 
  isEditCourse = false 
}) => {
  console.log("LecturesList - Lectures:", lectures);

  return (
    <div className="space-y-4">
      {lectures.length === 0 ? (
        <div className="text-center bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No lectures added yet. Start building your course curriculum.
          </p>
        </div>
      ) : (
        lectures.map((lecture, index) => (
          <div 
            key={lecture.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{lecture.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    Duration: {lecture.Duration}
                    {lecture.freePreview && (
                      <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-0.5 rounded">
                        Free Preview
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center mt-3 md:mt-0 space-x-3">
                {lecture.videoUrl && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded flex items-center">
                    <Play className="w-3 h-3 mr-1" />
                    Video
                  </span>
                )}
                
                {lecture.pdfUrl && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded flex items-center">
                    <FileText className="w-3 h-3 mr-1" />
                    PDF
                  </span>
                )}
                
                {lecture.quiz ? (
                  <span 
                    className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs font-medium px-2 py-1 rounded flex items-center cursor-pointer"
                    onClick={() => openQuizModal(lecture.id)}
                  >
                    {lecture.quiz.title} ({lecture.quiz.questions?.length || 0} questions)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => openQuizModal(lecture.id)}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs font-medium px-2 py-1 rounded flex items-center transition-colors"
                  >
                    <PlusCircle className="w-3 h-3 mr-1" />
                    Add Quiz
                  </button>
                )}
                
                <div className="flex space-x-2">
                  {handleEditLecture && (
                    <button
                      type="button"
                      onClick={() => handleEditLecture(lecture.id)}
                      className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      aria-label="Edit lecture"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveLecture(lecture.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    aria-label="Remove lecture"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LecturesList;