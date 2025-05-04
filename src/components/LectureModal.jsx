import { assets } from '../assets/assets';
import { useState } from 'react';

const LectureModal = ({
  isOpen,
  onClose,
  lectureData,
  handleInputChange,
  handleFileUpload,
  videoPreview,
  pdfPreview,
  handleAddLecture,
  isEditing = false,
  handleRemoveVideo,
  handleRemovePdf
}) => {
  const [isRemovingVideo, setIsRemovingVideo] = useState(false);
  const [isRemovingPdf, setIsRemovingPdf] = useState(false);

  if (!isOpen) return null;

  // Determine if the video and PDF are AWS URLs
  const isAwsVideo = typeof videoPreview === 'string' && videoPreview.includes('amazonaws.com');
  const isAwsPdf = typeof pdfPreview === 'string' && pdfPreview.includes('amazonaws.com');

  const onRemoveVideo = async () => {
    setIsRemovingVideo(true);
    try {
      await handleRemoveVideo();
    } finally {
      setIsRemovingVideo(false);
    }
  };

  const onRemovePdf = async () => {
    setIsRemovingPdf(true);
    try {
      await handleRemovePdf();
    } finally {
      setIsRemovingPdf(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm overflow-auto z-50 p-4">
      <div className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 p-6 rounded-lg shadow-xl relative w-full max-w-[550px] max-h-[80vh] overflow-auto transition-all transform animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-3">
          {isEditing ? 'Edit Lecture' : 'Add Lecture'}
        </h2>

        <div className="space-y-5">
          <div className="form-group">
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Lecture Title
            </label>
            <input
              type="text"
              name="title"
              value={lectureData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200"
              placeholder="Enter lecture title"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Duration
            </label>
            <input
              type="text"
              name="Duration"
              value={lectureData.Duration}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 transition-colors duration-200"
              placeholder="e.g., 45 minutes"
            />
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              Video
            </label>
            {videoPreview ? (
              <div className="mt-2 relative">
                <video
                  src={videoPreview}
                  controls
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
                />
                <div className="mt-3 flex justify-between items-center">
                  {isAwsVideo && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                      AWS Hosted Video
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={onRemoveVideo}
                    disabled={isRemovingVideo}
                    className="flex items-center text-sm text-red-500 hover:text-red-700 disabled:text-gray-400 transition-colors duration-200 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isRemovingVideo ? 'Removing...' : 'Remove Video'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1">
                <label className="flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-blue-500 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium">Upload video file</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">MP4, MOV, or WebM</span>
                  <input
                    type="file"
                    name="videoUrl"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
              PDF Document
            </label>
            {pdfPreview ? (
              <div className="mt-2 relative">
                {isAwsPdf ? (
                  <div className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                    <a href={pdfPreview} target="_blank" rel="noopener noreferrer" className="ml-3 text-blue-500 hover:text-blue-700 font-medium hover:underline transition-colors duration-200">
                      View PDF Document
                    </a>
                  </div>
                ) : (
                  <iframe
                    src={pdfPreview}
                    className="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm"
                  />
                )}
                <div className="mt-3 flex justify-between items-center">
                  {isAwsPdf && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md">
                      AWS Hosted PDF
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={onRemovePdf}
                    disabled={isRemovingPdf}
                    className="flex items-center text-sm text-red-500 hover:text-red-700 disabled:text-gray-400 transition-colors duration-200 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 px-3 py-1.5 rounded-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    {isRemovingPdf ? 'Removing...' : 'Remove PDF'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-1">
                <label className="flex flex-col items-center px-4 py-6 bg-white dark:bg-gray-700 text-blue-500 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="text-sm font-medium">Upload PDF document</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF files only</span>
                  <input
                    type="file"
                    name="pdfUrl"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          <div className="form-group flex items-center gap-3 my-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="freePreview"
                checked={lectureData.freePreview}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700 dark:text-gray-300">Is Preview Free?</span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddLecture}
            className="flex-1 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          >
            {isEditing ? 'Update Lecture' : 'Add Lecture'}
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

export default LectureModal;