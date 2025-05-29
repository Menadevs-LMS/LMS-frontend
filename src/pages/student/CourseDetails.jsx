import { useDispatch, useSelector } from 'react-redux';
import { assets } from '../../assets/assets';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import VideoLesson from './VideoLesson';
import PdfViewer from './PdfViewer';
import { checkEnrolled, enrolledCourse, updateLectuerProgress, updateCourseProgress, getCourseDetailsWithProgress } from '../../store/courseProgress';
import { getCourseDetails } from '../../store/coursdetails'
import QuizModal from './QuizModal';


const CourseDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { courseEnrolled, courseDeatilesProgress } = useSelector(state => state.courseProgress);
  const coursdetails = useSelector(state => state.coursedetails.courseDetails);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [completedVideos, setCompletedVideos] = useState({});
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedLectureId, setSelectedLectureId] = useState(null);
  const [lectureProgress, setLectureProgress] = useState(null);
  const [chooseQuiz, setChooseQuiz] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [lastScore, setLastScore] = useState(0)
  const checkCompleteQuizes = courseDeatilesProgress.data?.progress?.lecturesProgress.every((lecutre) => lecutre.completeQuiz === true);
  const SumScoreQuizes = courseDeatilesProgress.data?.progress?.lecturesProgress.reduce((a, b) => {
    return {
      quizScore: parseInt(a.quizScore) + parseInt(b.quizScore)
    };
  }, { quizScore: "0" });
  const averageQuizes = SumScoreQuizes / courseDeatilesProgress.data?.progress?.lecturesProgress.length


  const handleQuizSelect = (quiz, lectureId, progress, selectQuiz, statusQuiz, score) => {
    setSelectedQuiz(quiz);
    setLectureProgress(progress)
    setSelectedLectureId(lectureId);
    setQuizModalOpen(true);
    setChooseQuiz(selectQuiz)
    setQuizCompleted(statusQuiz)
    setLastScore(parseInt(score))
  };
  console.log("courseEnrolled>>", courseDeatilesProgress)

  const handleQuizComplete = (score, answers) => {
    console.log('Quiz completed with score:', score);
    console.log('User answers:', answers);
  };
  const getCourse = useCallback(async () => {
    await dispatch(checkEnrolled(id)).unwrap()
    await dispatch(getCourseDetails(id)).unwrap();
    await dispatch(getCourseDetailsWithProgress(id)).unwrap()
  }, [dispatch, id]);

  useEffect(() => {

    getCourse()


    const savedCompletedVideos = localStorage.getItem(`course_${id}_completed_videos`);
    if (savedCompletedVideos) {
      setCompletedVideos(JSON.parse(savedCompletedVideos));
    }
  }, [id, dispatch, courseEnrolled?.success, getCourse]);



  const toggleChapter = (index) => {
    setExpandedChapters(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleVideoSelect = (videoUrl, lectureId) => {
    setSelectedVideo(videoUrl);
    setSelectedVideoId(lectureId);
    setSelectedPdf(null);
  };

  const handlePdfSelect = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
    setSelectedVideo(null);
    setSelectedVideoId(null);
  };

  const handleVideoComplete = async (lectureId) => {
    const updatedCompletedVideos = {
      ...completedVideos,
      [lectureId]: true
    };

    setCompletedVideos(updatedCompletedVideos);
    localStorage.setItem(
      `course_${id}_completed_videos`,
      JSON.stringify(updatedCompletedVideos)
    );

    try {
      await dispatch(getCourseDetailsWithProgress(id)).unwrap();
    } catch (error) {
      console.error('Error refreshing course progress:', error);
    }
  };
  const handleEnrolled = async () => {
    await dispatch(enrolledCourse({ id, payload: coursdetails })).unwrap();
    await dispatch(checkEnrolled(id)).unwrap();
  }

  const isVideoCompleted = (lectureId) => {
    const localCompleted = completedVideos[lectureId] === true;

    const backendCompleted = courseDeatilesProgress.data?.curriculum?.find(
      chapter => chapter._id === lectureId
    )?.progress?.viewed === true;

    return localCompleted || backendCompleted;
  };

  const getTotalCompletedVideos = () => {
    return Object.values(completedVideos).filter(Boolean).length;
  };

  const getTotalVideos = () => {
    if (!courseDeatilesProgress.data?.curriculum) return 0;
    return courseDeatilesProgress.data.curriculum.filter(chapter => chapter.videoUrl).length;
  };

  const getCompletionPercentage = () => {
    const total = getTotalVideos();
    if (total === 0) return 0;
    return Math.round((getTotalCompletedVideos() / total) * 100);
  };

  if (!courseDeatilesProgress.data) return <div className="flex justify-center items-center min-h-screen">Loading course details...</div>;

  console.log("courseDeatilesProgress.data>>>", courseDeatilesProgress.data)
  return (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 pt-10 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70"></div>
        {courseEnrolled?.success &&
          <div className="max-w-xl z-10 text-gray-500">
            <h1 className="md:text-course-deatails-heading-large text-course-deatails-heading-small font-semibold text-gray-800">
              {courseDeatilesProgress.data.title}
            </h1>

            <p className="pt-4 md:text-base text-sm">
              {courseDeatilesProgress.data.subtitle}
            </p>

            <div className='flex items-center space-x-2 pt-3 pb-1 text-sm'>
              <p>{courseDeatilesProgress.data.category}</p>
              <div className='flex'>
                <p>{courseDeatilesProgress.data.primaryLanguage}</p>
              </div>
            </div>

            <p className='text-sm'>Course created on <span className='text-blue-600'>{new Date(courseDeatilesProgress.data.date).toLocaleDateString()}</span></p>



            <div className="pt-8 text-gray-800">
              <h2 className="text-xl font-semibold">Course Structure</h2>
              <div className="pt-5">
                {courseDeatilesProgress.data.curriculum && courseDeatilesProgress.data.curriculum.map((chapter, index) => (
                  <div key={chapter._id} className="border border-gray-300 bg-white mb-2 rounded">
                    <div
                      className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                      onClick={() => toggleChapter(index)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={assets.down_arrow_icon}
                          alt="arrow icon"
                          className={`transform transition-transform  ? 'rotate-180' : ''}`}
                        />
                        <p className="font-medium md:text-base text-sm">{chapter.title}</p>
                      </div>
                      <p className="text-sm md:text-default">{chapter.Duration} min</p>
                    </div>

                    <div className={`overflow-hidden transition-all duration-300 ${expandedChapters[index] ? 'max-h-96' : 'max-h-0'}`}>
                      <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                        {chapter.videoUrl && (
                          <li className="flex items-start gap-2 py-1">
                            <img src={assets.play_icon} alt="video icon" className="w-4 h-4 mt-1" />
                            <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                              <p>
                                Video Lesson
                                {isVideoCompleted(chapter._id) && (
                                  <span className="ml-2 text-green-600">✓</span>
                                )}
                              </p>
                              <div className='flex gap-2'>
                                <button
                                  onClick={() => handleVideoSelect(chapter.videoUrl, chapter._id)}
                                  className="text-blue-600 hover:underline"
                                >
                                  Watch
                                </button>
                              </div>
                            </div>
                          </li>
                        )}

                        {chapter.pdfUrl && (
                          <li className="flex items-start gap-2 py-1">
                            <img src={assets.lesson_icon} alt="pdf icon" className="w-4 h-4 mt-1" />
                            <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                              <p>Lecture Notes</p>
                              <div className='flex gap-2'>
                                <button
                                  onClick={() => handlePdfSelect(chapter.pdfUrl)}
                                  className="text-blue-600 hover:underline"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          </li>
                        )}

                        {chapter.quiz && (
                          <li className="flex items-start gap-2 py-1">
                            <img src={assets.star} alt="quiz icon" className="w-4 h-4 mt-1" />
                            <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                              <p>
                                {chapter.quiz.title}
                                {chapter.progress.completeQuiz && (
                                  <span className="ml-2 text-green-600">✓ Completed</span>
                                )}
                              </p>
                              <div className='flex gap-2'>
                                <button
                                  disabled={chapter.progress.completeQuiz}
                                  className={
                                    chapter.progress.completeQuiz
                                      ? "text-blue-600 opacity-50 cursor-not-allowed"
                                      : "text-blue-600 hover:underline"
                                  }
                                  onClick={
                                    chapter.progress.completeQuiz
                                      ? undefined
                                      : () => handleQuizSelect(chapter.quiz, chapter._id, chapter.progress, 0, chapter.progress.completeQuiz, chapter.progress.quizScore)
                                  }
                                >
                                  {chapter.progress.completeQuiz ? "Quiz Completed" : "Take Quiz"}
                                </button>
                              </div>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
                <div key={courseDeatilesProgress.data.quiz._id} className="border border-gray-300 bg-white mb-2 rounded">
                  <div className="flex items-center justify-between px-4 py-3 cursor-pointer select-none">
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow icon"
                        className="transform transition-transform"
                      />
                      <p className="font-medium md:text-base text-sm">
                        {courseDeatilesProgress.data.quiz.title}
                        {courseDeatilesProgress.data.progress.hasCompletedCourseQuiz && (
                          <span className="ml-2 text-green-600">✓ Completed</span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="overflow-hidden transition-all duration-300 max-h-96">
                    <ul className="list-disc md:pl-10 pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {courseDeatilesProgress.data.quiz && (
                        <li className="flex items-start gap-2 py-1">
                          <img src={assets.star} alt="quiz icon" className="w-4 h-4 mt-1" />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>Final Course Assessment</p>
                            <div className='flex gap-2'>
                              <button
                                disabled={courseDeatilesProgress.data.progress.hasCompletedCourseQuiz}
                                className={
                                  courseDeatilesProgress.data.progress.hasCompletedCourseQuiz
                                    ? "text-blue-600 opacity-50 cursor-not-allowed"
                                    : "text-blue-600 hover:underline"
                                }
                                onClick={
                                  courseDeatilesProgress.data.progress.hasCompletedCourseQuiz
                                    ? undefined
                                    : () => handleQuizSelect(
                                      courseDeatilesProgress.data.quiz,
                                      courseDeatilesProgress.data.quiz._id,
                                      courseDeatilesProgress.data.progress,
                                      1,
                                      courseDeatilesProgress.data.progress.hasCompletedCourseQuiz,
                                      courseDeatilesProgress.data.progress.quizScore
                                    )
                                }
                              >
                                {courseDeatilesProgress.data.progress.hasCompletedCourseQuiz
                                  ? "Quiz Completed"
                                  : "Take Final Quiz"}
                              </button>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <QuizModal
              isOpen={quizModalOpen}
              onClose={() => setQuizModalOpen(false)}
              quiz={selectedQuiz}
              courseId={id}
              lectureId={selectedLectureId}
              onQuizComplete={handleQuizComplete}
              updateLectuerProgress={updateLectuerProgress}
              updateCourseProgress={updateCourseProgress}
              progress={lectureProgress}
              chooseQuiz={chooseQuiz}
              quizCompleted={quizCompleted}
              setQuizCompleted={setQuizCompleted}
              lastScore={lastScore}
              getCourseDetailsWithProgress={getCourseDetailsWithProgress}
            />
            <div className="py-20 text-sm md:text-default">
              <h3 className="text-xl font-semibold text-gray-800">Course Description</h3>
              <p className="rich-text pt-3">
                {courseDeatilesProgress.data.description}
              </p>
              {courseDeatilesProgress.data.welcomeMessage && (
                <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="italic">{courseDeatilesProgress.data.welcomeMessage}</p>
                </div>
              )}
            </div>
          </div>
        }
        {(selectedVideo || selectedPdf) && (
          <div className="mt-8 mb-6 border border-gray-300 rounded-lg p-4 bg-white">
            <h3 className="text-lg font-medium mb-4 text-gray-800">
              {selectedVideo ? "Video Lesson" : "Course Material"}
            </h3>
            {selectedVideo && (
              <VideoLesson
                videoUrl={selectedVideo}
                lectureId={selectedVideoId}
                courseId={id}
                onComplete={handleVideoComplete}
                isCompleted={isVideoCompleted(selectedVideoId)}
              />
            )}
            {selectedPdf && <PdfViewer pdfUrl={selectedPdf} />}
          </div>
        )}
        {!courseEnrolled.success &&
          <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]">
            <img
              src={courseDeatilesProgress.data.image}
              alt={courseDeatilesProgress.data.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-5">
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">Course Progress</span>
                  <span className="text-sm font-medium text-gray-800">{getCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {getTotalCompletedVideos()}/{getTotalVideos()} videos completed
                </p>
              </div>

              <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
                <div className="flex items-center gap-1">
                  <img src={assets.time_clock_icon} alt="clock icon" />
                  <p>
                    {courseDeatilesProgress.data?.curriculum?.reduce((total, chapter) =>
                      total + (parseInt(chapter.Duration) || 0), 0)} min
                  </p>
                </div>
                <div className="h-4 w-px bg-gray-500/40"></div>
                <div className="flex items-center gap-1">
                  <img src={assets.lesson_icon} alt="lesson icon" />
                  <p>{courseDeatilesProgress.data.curriculum?.length} lessons</p>
                </div>
              </div>

              <button className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition" onClick={() => handleEnrolled()}>
                Enroll Now
              </button>

              <div className="pt-6">
                <p className="md:text-xl text-lg font-medium text-gray-800">What's in the course?</p>
                <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                  <li>Lifetime access with free updates.</li>
                  <li>Step-by-step, hands-on project guidance.</li>
                  <li>Downloadable resources and source code.</li>
                  <li>
                    {courseDeatilesProgress.data.curriculum?.filter(chapter => chapter.quiz).length +
                      (courseDeatilesProgress.data.quiz ? 1 : 0)} quizzes to test your knowledge.
                  </li>
                  <li>Certificate of completion.</li>
                </ul>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  );
};

export default CourseDetails;