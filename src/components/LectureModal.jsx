import { assets } from '../assets/assets';

 const LectureModal = ({
  isOpen,
  onClose,
  lectureData,
  handleInputChange,
  handleFileUpload,
  videoPreview,
  pdfPreview,
  handleAddLecture
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-scroll z-50">
      <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-[550px] max-h-[750px] overflow-scroll">
        <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

        <div className="mb-2">
          <p>Lecture Title</p>
          <input
            type="text"
            name="title"
            value={lectureData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded py-1 px-2"
          />
        </div>

        <div className="mb-2">
          <p>Duration</p>
          <input
            type="text"
            name="Duration"
            value={lectureData.Duration}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded py-1 px-2"
          />
        </div>

        <div className="mb-2">
          <p>Video Upload</p>
          <input
            type="file"
            name="videoUrl"
            accept="video/*"
            onChange={handleFileUpload}
            className="mt-1 block w-full border rounded py-1 px-2"
          />
          {videoPreview && (
            <video
              src={videoPreview}
              controls
              className="mt-2 w-full"
            />
          )}
        </div>

        <div className="mb-2">
          <p>PDF Upload</p>
          <input
            type="file"
            name="pdfUrl"
            accept=".pdf"
            onChange={handleFileUpload}
            className="mt-1 block w-full border rounded py-1 px-2"
          />
          {pdfPreview && (
            <iframe
              src={pdfPreview}
              className="mt-2 w-full h-64"
            />
          )}
        </div>

        <div className="flex gap-2 my-4">
          <p>Is Preview Free?</p>
          <input
            type="checkbox"
            name="freePreview"
            checked={lectureData.freePreview}
            onChange={handleInputChange}
            className='mt-1 scale-125'
          />
        </div>

        <button
          type='button'
          onClick={handleAddLecture}
          className="w-full bg-blue-400 text-white px-4 py-2 rounded"
        >
          Add Lecture
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

export default LectureModal