import { useState, useEffect } from 'react';
import axios from 'axios';
import CourseQuizModal from '../../components/CourseQuizModal'
import InputField from '../../components/InputField'
import ThumbnailUpload from '../../components/ThumbnailUpload'
import LectureModal from '../../components/LectureModal'
import QuizModal from '../../components/QuizModal'
import LecturesList from '../../components/LecturesList'
import { getAllCategories } from '../../store/categories'
import { useDispatch, useSelector } from 'react-redux';
const AddCourse = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const dispatch = useDispatch();
  const categoriesState = useSelector((state) => state.categories.categories);
  const [isCustomeCategory, setIsCustomeCategory] = useState(false);

  const [courseData, setCourseData] = useState({
    title: '',
    subtitle: '',
    welcomeMessage: '',
    description: '',
    category: '',
    language: '',
    image: null
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
  const handleSelectCatgeory = (e) => {
    const { name, value } = e.target;
    if (value === "Other") {
      setIsCustomeCategory(true);
      setCourseData((prev) => ({
        ...prev,
        [name]: ""
      }))
    }
    else {
      setIsCustomeCategory(false);
      setCourseData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }
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

    if (name === 'options' && index !== null) {
      const newOptions = [...currentCourseQuestion.options];
      newOptions[index] = value;

      setCurrentCourseQuestion(prev => ({
        ...prev,
        options: newOptions
      }));
      return;
    }

    if (name === 'correctAnswer') {
      setCurrentCourseQuestion(prev => ({
        ...prev,
        correctAnswer: value
      }));
      return;
    }

    setCurrentCourseQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCourseQuestionTypeChange = (type) => {
    setCurrentCourseQuestion(prev => ({
      ...prev,
      questionType: type,
      options: type === 'multiple-choice' ?
        (prev.options.length > 0 ? prev.options : ['', '', '', '']) : [],
      correctAnswer: '',
      truthAnswers: [],
      paragraphAnswer: ''
    }));
  };
  const addCourseQuestionToQuiz = () => {
    const { questionText, questionType, options, correctAnswer } = currentCourseQuestion;

    if (!questionText.trim()) {
      alert('Please enter question text');
      return;
    }

    if (questionType === 'multiple-choice') {
      const isValid = options.every(opt => opt.trim() !== '') &&
        options.includes(correctAnswer);

      if (!isValid) {
        alert('Please fill all options and select a correct answer');
        return;
      }
    }

    // Add question to quiz
    setCourseQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentCourseQuestion }]
    }));

    // Reset question
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
      return response.data?.data?.Location;
    } catch (error) {
      console.log("Error S3", error);
      throw error;
    }
  };
  const prepareUploadImage = async () => {
    const image = courseData.image;
    const imageResult = await uploadToS3(image);
    return imageResult
  }
  const prepareUploadData = async () => {
    const updatedLectures = [];

    for (const item of lectures) {
      let pdfUrl = item.pdfUrl;
      let videoUrl = item.videoUrl;

      if (item.pdfUrl instanceof File) {
        const pdfResult = await uploadToS3(item.pdfUrl);
        pdfUrl = pdfResult;
      }

      if (item.videoUrl instanceof File) {
        const videoResult = await uploadToS3(item.videoUrl);
        videoUrl = videoResult;
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
      const processedImage = await prepareUploadImage();
      console.log("processedLectures>>>>>>>", processedLectures)
      const payload = {
        quiz: courseQuizData,
        curriculum: processedLectures,
        date: new Date().toString(),
        title: courseData.title,
        welcomeMessage: courseData.welcomeMessage,
        description: courseData.description,
        primaryLanguage: courseData.language,
        subtitle: courseData.subtitle,
        image: processedImage,
        category:courseData.category
      };
      console.log("payload>>>>>>>>>>>>>", payload)
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
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch])
  console.log("courseData>>>",courseData)
  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <form onSubmit={handleSubmit} className='flex flex-row justify-between max-w-[650px] gap-4 w-full text-gray-500'>
        <div>
          <InputField
            label="Course Title"
            name="title"
            value={courseData.title}
            onChange={handleCourseInputChange}
            placeholder="Type here"
            required
          />

          <InputField
            label="Subtitle"
            name="subtitle"
            value={courseData.subtitle}
            onChange={handleCourseInputChange}
            placeholder="Type here"
            required
          />

          <InputField
            label="Welcome Message"
            name="welcomeMessage"
            value={courseData.welcomeMessage}
            onChange={handleCourseInputChange}
            placeholder="Type here"
            required
          />

          <InputField
            label="Course Description"
            name="description"
            value={courseData.description}
            onChange={handleCourseInputChange}
            placeholder="Type here"
            isTextArea
          />

          <div className='flex flex-col gap-1 mb-4'>
            <p>Course Category</p>
            <select
              name="category"
              value={courseData.category}
              onChange={handleSelectCatgeory}
              className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500'
            >
               <option>Select...</option>

              {categoriesState?.map((item, index) => {
                return <option value={item.categoreName} key={index}>{item?.categoreName}</option>
              })}
            </select>
          </div>
          {isCustomeCategory &&
            <InputField
              label="Category Name"
              name="category"
              value={courseData.category}
              onChange={handleCourseInputChange}
              placeholder="Type here"
              required
            />
          }
          <InputField
            label="Primary Language"
            name="language"
            value={courseData.language}
            onChange={handleCourseInputChange}
            placeholder="Type here"
            required
          />

          <ThumbnailUpload
            thumbnailPreview={thumbnailPreview}
            handleFileChange={handleCourseInputChange}
          />

          <button type="submit" className='bg-black text-white w-max py-2.5 px-8 rounded my-4 '>
            CREATE COURSE
          </button>
        </div>

        <div>
          <LecturesList
            lectures={lectures}
            openQuizModal={openQuizModal}
            handleRemoveLecture={handleRemoveLecture}

          />

          <div
            className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            + Add Lecture
          </div>
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

      <LectureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lectureData={lectureData}
        handleInputChange={handleInputChange}
        handleFileUpload={handleFileUpload}
        videoPreview={videoPreview}
        pdfPreview={pdfPreview}
        handleAddLecture={handleAddLecture}
      />

      <QuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        quizData={quizData}
        currentQuestion={currentQuestion}
        handleQuestionTypeChange={handleQuestionTypeChange}
        handleQuestionInputChange={handleQuestionInputChange}
        addQuestionToQuiz={addQuestionToQuiz}
        removeQuestionFromQuiz={removeQuestionFromQuiz}
        saveQuiz={addQuizToLecture}
        setQuizData={setQuizData}
      />

      <CourseQuizModal
        isOpen={isCourseQuizModalOpen}
        onClose={() => setIsCourseQuizModalOpen(false)}
        quizData={courseQuizData}
        currentQuestion={currentCourseQuestion}
        handleQuestionTypeChange={handleCourseQuestionTypeChange}
        handleQuestionInputChange={handleCourseQuestionInputChange}
        addQuestionToQuiz={addCourseQuestionToQuiz}
        removeQuestionFromQuiz={(index) => setCourseQuizData(prev => ({
          ...prev,
          questions: prev.questions.filter((_, i) => i !== index)
        }))}
        saveQuiz={() => setIsCourseQuizModalOpen(false)}
        setQuizData={setCourseQuizData}
      />  </div>
  );
};

export default AddCourse;