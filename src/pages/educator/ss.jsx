import { useState } from 'react';
import { assets } from '../../assets/assets';
import axios from 'axios';

const AddCourse = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    welcomeMessage: '',
    description: '',
    category: 'Beginner',
    language: '',
    thumbnail: null
  });
  const [courseQuizData, setCourseQuizData] = useState({
    title: '',
    questions: []
  });
  const [isCourseQuizModalOpen, setIsCourseQuizModalOpen] = useState(false);
  const [lectures, setLectures] = useState([]);
  const [lectureData, setLectureData] = useState({
    title: '',
    videoUrl: null,
    public_id: '',
    freePreview: false,
    pdfUrl: null,
    quiz: null,
    Duration: ''
  });

  const [quizData, setQuizData] = useState({
    title: '',
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    questionText: '',
    questionType: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    truthAnswers: [],
    paragraphAnswer: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [videoPreview, setVideoPreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [currentCourseQuestion, setCurrentCourseQuestion] = useState({
    questionText: '',
    questionType: 'multiple-choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    truthAnswers: [],
    paragraphAnswer: ''
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLectureData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;

    if (name === 'videoUrl') {
      const file = files[0];
      if (file.type.startsWith('video/')) {
        const videoURL = URL.createObjectURL(file);
        setLectureData(prev => ({ ...prev, videoUrl: file }));
        setVideoPreview(videoURL);
      } else {
        alert('Please upload a valid video file');
      }
    }

    if (name === 'pdfUrl') {
      const file = files[0];
      // Validate PDF file
      if (file.type === 'application/pdf') {
        setLectureData(prev => ({ ...prev, pdfUrl: file }));
        setPdfPreview(URL.createObjectURL(file));
      } else {
        alert('Please upload a valid PDF file');
      }
    }
  };

  const handleCourseQuestionInputChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name.startsWith("options-")) {
      // Extract the index and update the corresponding option
      const optionIndex = parseInt(name.split("-")[1], 10);
      const newOptions = [...currentCourseQuestion.options];
      newOptions[optionIndex] = value;

      setCurrentCourseQuestion(prev => ({
        ...prev,
        options: newOptions
      }));
    } else {
      // General input change
      setCurrentCourseQuestion(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCourseQuestionTypeChange = (type) => {
    // Reset question based on type
    setCurrentCourseQuestion({
      questionText: currentCourseQuestion.questionText,
      questionType: type,
      options: type === 'multiple-choice' ? ['', '', '', ''] : [],
      correctAnswer: '',
      truthAnswers: type === 'truth-sentence' ? [] : [],
      paragraphAnswer: type === 'paragraph' ? '' : ''
    });
  };
  const addCourseQuestionToQuiz = () => {
    const { questionText, questionType, options, correctAnswer, truthAnswers, paragraphAnswer } = currentCourseQuestion;

    // Validation based on question type
    if (!questionText) {
      alert('Please enter question text');
      return;
    }

    switch (questionType) {
      case 'multiple-choice':
        if (!options.every(opt => opt.trim() !== '')) {
          alert('Please fill all multiple-choice options');
          return;
        }
        if (!correctAnswer) {
          alert('Please select a correct answer');
          return;
        }
        break;

      case 'truth-sentence':
        if (truthAnswers.length === 0) {
          alert('Please add truth sentence answers');
          return;
        }
        break;

      case 'paragraph':
        if (!paragraphAnswer) {
          alert('Please enter paragraph answer');
          return;
        }
        break;
    }

    // Add question to course quiz
    setCourseQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentCourseQuestion }]
    }));

    // Reset current question
    setCurrentCourseQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      truthAnswers: [],
      paragraphAnswer: ''
    });
  };
  // Quiz Management Methods
  const handleQuestionTypeChange = (e) => {
    const type = e.target.value;
    setCurrentQuestion(prev => ({
      ...prev,
      questionType: type,
      options: type === 'multiple-choice' ? ['', '', '', ''] : [],
      correctAnswer: '',
      truthAnswers: [],
      paragraphAnswer: ''
    }));
  };

  const handleQuestionInputChange = (e, index = null) => {
    const { name, value } = e.target;

    if (name === 'options') {
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion(prev => ({
        ...prev,
        options: newOptions
      }));
    } else {
      setCurrentQuestion(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const addQuestionToQuiz = () => {
    const { questionText, questionType, options, correctAnswer } = currentQuestion;

    if (!questionText) {
      alert('Please enter question text');
      return;
    }

    if (questionType === 'multiple-choice') {
      if (!options.every(opt => opt.trim() !== '')) {
        alert('Please fill all multiple-choice options');
        return;
      }
      if (!correctAnswer) {
        alert('Please select a correct answer');
        return;
      }
    }

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }]
    }));

    setCurrentQuestion({
      questionText: '',
      questionType: 'multiple-choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      truthAnswers: [],
      paragraphAnswer: ''
    });
  };

  const removeQuestionFromQuiz = (index) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const addQuizToLecture = () => {
    const updatedLectures = lectures.map(lecture =>
      lecture.id === currentLectureId
        ? { ...lecture, quiz: quizData }
        : lecture
    );

    setLectures(updatedLectures);
    setIsQuizModalOpen(false);
    setQuizData({ title: '', questions: [] });
    setCurrentLectureId(null);
  };

  const openQuizModal = (lectureId) => {
    const lecture = lectures.find(l => l.id === lectureId);
    setCurrentLectureId(lectureId);

    // If lecture already has a quiz, load it
    if (lecture.quiz) {
      setQuizData(lecture.quiz);
    } else {
      setQuizData({ title: '', questions: [] });
    }

    setIsQuizModalOpen(true);
  };
  const handleRemoveLecture = (id) => {
    setLectures(prev => prev.filter(lecture => lecture.id !== id));
  };
  // Existing methods (handleCourseInputChange, handleInputChange, etc.)
  // ... (keep all previous methods)
  const validateLecture = () => {
    const { title, Duration, videoUrl, pdfUrl } = lectureData;

    if (!title) {
      alert('Please enter a lecture title');
      return false;
    }

    if (!Duration) {
      alert('Please enter a duration');
      return false;
    }

    if (!videoUrl) {
      alert('Please upload a video');
      return false;
    }

    if (!pdfUrl) {
      alert('Please upload a PDF');
      return false;
    }

    return true;
  };
  const handleCourseInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      if (files[0]) {
        setCourseData(prev => ({
          ...prev,
          [name]: files[0]
        }));
        setThumbnailPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setCourseData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  const handleAddLecture = () => {
    if (!validateLecture()) return;

    const newLecture = {
      title: lectureData.title,
      videoUrl: lectureData.videoUrl,
      public_id: '', 
      freePreview: lectureData.freePreview,
      pdfUrl: lectureData.pdfUrl,
      quiz: lectureData.quiz,
      Duration: lectureData.Duration,
      id: Date.now()  
    };

    setLectures(prev => [...prev, newLecture]);

    setLectureData({
      title: '',
      videoUrl: null,
      public_id: '',
      freePreview: false,
      pdfUrl: null,
      quiz: null,
      Duration: ''
    });
    setVideoPreview(null);
    setPdfPreview(null);
    setIsModalOpen(false);
  };
  const validateCourse = () => {
    if (!courseData.title) {
      alert('Please enter a course title');
      return false;
    }

    if (lectures.length === 0) {
      alert('Please add at least one lecture');
      return false;
    }

    return true;
  };
  const openCourseQuizModal = () => {
    setIsCourseQuizModalOpen(true);
  };

  const uploadToS3 = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${backendUrl}/media/upload`, formData);
      console.log("Response s3>>>>", response.data);
      // Return just the Location (URL) from the S3 response
      return response.data?.data?.Location;
    } catch (error) {
      console.log("Error S3", error);
      throw error; // Rethrow to handle in the calling function
    }
  };
  // Fix the mapping with proper async/await
  const prepareUploadData = async () => {
    const updatedLectures = [];
    
    for (const item of lectures) {
      let pdfUrl = item.pdfUrl;
      let videoUrl = item.videoUrl;
      
      if (item.pdfUrl instanceof File) {
        const pdfResult = await uploadToS3(item.pdfUrl);
        pdfUrl = pdfResult; // Now just the URL string
      }
      
      if (item.videoUrl instanceof File) {
        const videoResult = await uploadToS3(item.videoUrl);
        videoUrl = videoResult; // Now just the URL string
      }
      
      updatedLectures.push({
        ...item,
        pdfUrl,
        videoUrl
      });
    }
    
    return updatedLectures;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const processedLectures = await prepareUploadData();
       console.log("processedLectures>>>>>>>", processedLectures)
      const payload = {
        quiz: courseQuizData,
        curriculum: processedLectures,
        date: new Date().toString(),
        titel: courseData.title,
        welcomeMessage: courseData.welcomeMessage,
        description: courseData.description,
        primaryLanguage: courseData.language,
        subtitle: courseData.subtitle
      };
     console.log("payload>>>>>>>>>>>>>",payload)
      const response = await axios.post(`${backendUrl}/instructor/course/add`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Course uploaded successfully:", response.data);

    } catch (error) {
      console.error("Error uploading course:", error);
    }
  };
  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <form onSubmit={handleSubmit} className='flex flex-row justify-between max-w-[650px] gap-4 w-full text-gray-500'>
        {/* Existing form fields */}
        <div>

        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input
            type="text"
            name="title"
            value={courseData.title}
            onChange={handleCourseInputChange}
            placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
            required
          />
        </div>
        <div className='flex flex-col gap-1'>
          <p>Subtitle</p>
          <input
            type="text"
            name="subtitle"
            value={courseData.subtitle}
            onChange={handleCourseInputChange}
            placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
            required
          />
        </div>
        <div className='flex flex-col gap-1'>
          <p>Welcome Message</p>
          <input
            type="text"
            name="welcomeMessage"
            value={courseData.welcomeMessage}
            onChange={handleCourseInputChange}
            placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
            required
          />
        </div>
        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <textarea
            name="description"
            value={courseData.description}
            onChange={handleCourseInputChange}
            placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
          ></textarea>
        </div>
        <div className='flex flex-col gap-1'>
          <p>Course Category</p>
          <select
            name="category"
            value={courseData.category}
            onChange={handleCourseInputChange}
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div className='flex flex-col gap-1'>
          <p>Primary Language</p>
          <input
            type="text"
            name="language"
            value={courseData.language}
            onChange={handleCourseInputChange}
            placeholder='Type here'
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
            required
          />
        </div>
        <div className='flex flex-col justify-between flex-wrap mt-4'>
          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label htmlFor='thumbnailImage' className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
              <input
                type="file"
                id='thumbnailImage'
                name="thumbnail"
                accept="image/*"
                onChange={handleCourseInputChange}
                hidden
              />
              {thumbnailPreview && (
                <img className='max-h-10' src={thumbnailPreview} alt="Thumbnail preview" />
              )}
              {!thumbnailPreview && <p className="text-sm text-gray-400">(No file selected)</p>}
            </label>
          </div>
          <button type="submit" className='bg-black text-white w-max py-2.5 px-8 rounded my-4 '>
          CREATE COURSE
        </button>
        </div>
        </div>

        <div>
        {/* Lectures Section */}
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
                        {lecture.duration} min {lecture.freePreview ? '(Free Preview)' : ''}
                      </p>
                      {lecture.quiz && (
                        <p className="text-sm text-green-600">
                          Quiz Added ({lecture.quiz.questions.length} questions)
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
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

          <div
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Lecture
          </div>
        </div>

        {/* Existing Lecture Modal */}
        {isModalOpen && (
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
                  type="text"  // Changed from number to text to match schema
                  name="Duration"  // Capital D to match schema
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
                onClick={() => setIsModalOpen(false)}
                className='absolute top-4 right-4 w-4 cursor-pointer'
                alt="Close"
              />
            </div>
          </div>
        )}

        {/* Quiz Modal */}
        {isQuizModalOpen && (
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
                onClick={addQuizToLecture}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
              >
                Save Quiz to Lecture
              </button>

              <img
                src={assets.cross_icon}
                onClick={() => setIsQuizModalOpen(false)}
                className='absolute top-4 right-4 w-4 cursor-pointer'
                alt="Close"
              />
            </div>
          </div>
        )}
        {/* Course Quiz Section */}
        {/* Course Quiz Modal */}
        {isCourseQuizModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 overflow-scroll z-50">
            <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-[550px] max-h-[750px] overflow-scroll">
              <h2 className="text-lg font-semibold mb-4">Add Course Quiz</h2>

              <div className="mb-2">
                <p>Quiz Title</p>
                <input
                  type="text"
                  name="title"
                  value={courseQuizData.title}
                  onChange={(e) => setCourseQuizData(prev => ({ ...prev, title: e.target.value }))}
                  className="mt-1 block w-full border rounded py-1 px-2"
                />
              </div>

              {/* Question Creation Section */}
              <div className="mb-2">
                <p>Add Question</p>
                <input
                  type="text"
                  name="questionText"
                  value={currentCourseQuestion.questionText}
                  onChange={handleCourseQuestionInputChange}
                  placeholder="Enter question text"
                  className="mt-1 block w-full border rounded py-1 px-2"
                />
              </div>

              <div className="mb-2">
                <p>Question Type</p>
                <div className="flex gap-2 mb-2">
                  {["multiple-choice", "truth-sentence", "paragraph"].map(type => (
                    <button
                      key={type}
                      onClick={() => handleCourseQuestionTypeChange(type)}
                      className={`px-3 py-1 rounded ${currentCourseQuestion.questionType === type
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                      {type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>

                {/* Conditional rendering based on question type */}
                {currentCourseQuestion.questionType === 'multiple-choice' && (
                  <div>
                    {currentCourseQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center mb-2">
                        <input
                          type="text"
                          name={`options-${index}`}  // Dynamically assign name
                          value={option}
                          onChange={handleCourseQuestionInputChange} // Use function
                          placeholder={`Option ${index + 1}`}
                          className="flex-grow mr-2 border rounded py-1 px-2"
                        />
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={option}
                          checked={currentCourseQuestion.correctAnswer === option}
                          onChange={handleCourseQuestionInputChange}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {currentCourseQuestion.questionType === 'truth-sentence' && (
                  <div>
                    <input
                      type="text"
                      name="truthAnswers"
                      value={currentCourseQuestion.truthAnswers.join(', ')}
                      onChange={handleCourseQuestionInputChange}
                      placeholder="Enter truth sentence answers (comma-separated)"
                      className="mt-1 block w-full border rounded py-1 px-2"
                    />
                  </div>
                )}

                {currentCourseQuestion.questionType === 'paragraph' && (
                  <div>
                    <textarea
                      name="paragraphAnswer"
                      value={currentCourseQuestion.paragraphAnswer}
                      onChange={handleCourseQuestionInputChange}
                      placeholder="Enter paragraph answer"
                      className="mt-1 block w-full border rounded py-1 px-2"
                      rows={4}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  addCourseQuestionToQuiz();
                  setCourseQuizData(prev => ({
                    ...prev,
                    questions: [...prev.questions, { ...currentCourseQuestion }]
                  }));
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              >
                Add Question
              </button>

              {/* Display added questions */}
              {courseQuizData.questions.map((q, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded mt-2 flex justify-between">
                  <span>{q.questionText}</span>
                  <button
                    onClick={() => {
                      setCourseQuizData(prev => ({
                        ...prev,
                        questions: prev.questions.filter((_, i) => i !== index)
                      }));
                    }}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={() => setIsCourseQuizModalOpen(false)}
                className="bg-green-500 text-white px-4 py-2 rounded mt-4 w-full"
              >
                Save Course Quiz
              </button>

              <img
                src={assets.cross_icon}
                onClick={() => setIsCourseQuizModalOpen(false)}
                className='absolute top-4 right-4 w-4 cursor-pointer'
                alt="Close"
              />
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-medium text-lg mb-2">Course Quiz</h3>
          {courseQuizData.questions.length > 0 ? (
            <div className="bg-gray-100 p-2 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{courseQuizData.title}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={openCourseQuizModal}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit Quiz
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {courseQuizData.questions.length} Questions
              </p>
            </div>
          ) : (
            <div
              className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
              onClick={openCourseQuizModal}
            >
              + Add Course Quiz
            </div>
          )}
        </div>
        </div>
        
      </form>
    </div>
  );
};

export default AddCourse;