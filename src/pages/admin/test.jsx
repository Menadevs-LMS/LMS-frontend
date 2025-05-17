import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Plus, } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import InputField from '../../components/InputField';
import ThumbnailUpload from '../../components/ThumbnailUpload';
import SelectField from '../../components/SelectField';
import LectureModal from '../../components/LectureModal';
import QuizModal from '../../components/QuizModal';
import CourseQuizModal from '../../components/CourseQuizModal';
import LecturesList from '../../components/LecturesList';

import { setLoading } from '../../store/auth';
import { getAllCategories } from '../../store/categories';

const questionSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  questionType: z.enum(["multiple-choice", "truth-sentence", "paragraph"]),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
  truthAnswers: z.array(z.string()).optional(),
  paragraphAnswer: z.string().optional(),
});

const quizSchema = z.object({
  title: z.string().min(1, "Quiz title is required"),
  questions: z.array(questionSchema),
});

const lectureSchema = z.object({
  id: z.string().or(z.number()),
  title: z.string().min(3, "Title must be at least 3 characters"),
  Duration: z.string().min(2, "Duration is required"),
  videoUrl: z.any().optional(),
  pdfUrl: z.any().optional(),
  freePreview: z.boolean().default(false),
  quiz: quizSchema.nullable().optional(),
});

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  subtitle: z.string().min(10, "Subtitle must be at least 10 characters"),
  welcomeMessage: z.string().min(1, "Welcome message is required"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.string().min(1, "Category is required"),
  language: z.string().min(1, "Language is required"),
  image: z.any().nullable().optional(),
  curriculum: z.array(lectureSchema).default([]),
  quiz: quizSchema.optional(),
});

const CoursesController = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [activeSectionTab, setActiveSectionTab] = useState('basic');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isCourseQuizModalOpen, setIsCourseQuizModalOpen] = useState(false);
  const [currentLectureId, setCurrentLectureId] = useState(null);
  const [currentLectureQuiz, setCurrentLectureQuiz] = useState(null);

  const [videoPreview, setVideoPreview] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);

  const dispatch = useDispatch();
  const categoriesState = useSelector((state) => state.categories.categories || []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      welcomeMessage: '',
      description: '',
      category: '',
      language: '',
      image: null,
      curriculum: [],
      quiz: {
        title: '',
        questions: []
      }
    }
  });

  const { append, remove } = useFieldArray({
    control,
    name: "curriculum",
  });

  const showNotification = (type, message, duration = 5000) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, duration);
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    if (value === "Other") {
      setIsCustomCategory(true);
      setValue('category', '');
    } else {
      setIsCustomCategory(false);
      setValue('category', value);
    }
  };

  const handleAddLecture = (lectureData) => {
    const newLecture = {
      ...lectureData,
      id: Date.now().toString()
    };

    append(newLecture);
    setIsModalOpen(false);
    setVideoPreview(null);
    setPdfPreview(null);
    showNotification('success', 'Lecture added successfully');
  };

  const handleRemoveLecture = (lectureId) => {
    const index = getValues('curriculum').findIndex(
      lecture => lecture.id.toString() === lectureId.toString()
    );

    if (index !== -1) {
      remove(index);
      showNotification('info', 'Lecture removed');
    }
  };

  const handleAddQuiz = (lectureId, quizData) => {
    const lectureIndex = getValues('curriculum').findIndex(
      lecture => lecture.id.toString() === lectureId.toString()
    );

    if (lectureIndex !== -1) {
      const updatedCurriculum = [...getValues('curriculum')];

      updatedCurriculum[lectureIndex] = {
        ...updatedCurriculum[lectureIndex],
        quiz: quizData
      };

      setValue('curriculum', updatedCurriculum);
      showNotification('success', 'Quiz added to lecture successfully');
    }
  };

  const openQuizModal = (lectureId) => {
    setCurrentLectureId(lectureId);

    const lecture = getValues('curriculum').find(
      lecture => lecture.id.toString() === lectureId.toString()
    );

    setCurrentLectureQuiz(lecture?.quiz || null);

    setIsQuizModalOpen(true);
  };

  const handleCourseQuizSave = (data) => {
    setValue('quiz', data);
    setIsCourseQuizModalOpen(false);
    showNotification('success', 'Course quiz added successfully');
  };

  const openCourseQuizModal = () => {
    setIsCourseQuizModalOpen(true);
  };

  const uploadToS3 = async (file) => {
    try {
      console.log("Uploading file:", file.name, file.type, file.size);

      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${backendUrl}/media/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      console.log("S3 upload response:", response.data);

      if (!response.data?.data?.Location) {
        throw new Error("Upload response missing Location URL");
      }

      return response.data.data.Location;
    } catch (error) {
      console.error("Error uploading to S3:", error);
      throw error;
    }
  };

  const prepareUploads = async (data) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      let imageUrl = null;

      if (data.image instanceof File) {
        imageUrl = await uploadToS3(data.image);
      }
      else if (data.image && typeof data.image === 'object') {
        console.log("Image is an object:", data.image);

        if (data.image['0'] instanceof File) {
          console.log("Found File in image['0']");
          imageUrl = await uploadToS3(data.image['0']);
          setUploadProgress(20);
        }
        else if (data.image.url && typeof data.image.url === 'string') {
          console.log("Using image.url property");
          imageUrl = data.image.url;
        }
        else {
          console.log("Could not extract valid image from object, setting to null");
          imageUrl = null;
        }
      }
      else if (typeof data.image === 'string' && data.image.trim() !== '') {
        console.log("Image is already a string URL");
        imageUrl = data.image;
      }
      else {
        console.log("No valid course image to upload, setting to null");
        imageUrl = null;
      }

      const updatedLectures = await Promise.all(data.curriculum.map(async (lecture, index) => {
        const lectureCopy = { ...lecture };

        let pdfUrl = lectureCopy.pdfUrl;
        if (pdfUrl instanceof File) {
          console.log(`Uploading PDF for lecture ${index}`);
          pdfUrl = await uploadToS3(pdfUrl);
          setUploadProgress(prev => prev + Math.floor(40 / data.curriculum.length / 2));
        } else if (pdfUrl && typeof pdfUrl === 'object' && Object.keys(pdfUrl).length === 0) {
          console.log(`Empty PDF object detected for lecture ${index}, setting to null`);
          pdfUrl = null;
        }

        let videoUrl = lectureCopy.videoUrl;
        if (videoUrl instanceof File) {
          console.log(`Uploading video for lecture ${index}`);
          videoUrl = await uploadToS3(videoUrl);
          setUploadProgress(prev => prev + Math.floor(40 / data.curriculum.length / 2));
        } else if (videoUrl && typeof videoUrl === 'object' && Object.keys(videoUrl).length === 0) {
          console.log(`Empty video object detected for lecture ${index}, setting to null`);
          videoUrl = null;
        }

        const updatedLecture = {
          ...lectureCopy,
          videoUrl: videoUrl,
          pdfUrl: pdfUrl
        };

        if (lectureCopy.quiz) {
          updatedLecture.quiz = {
            title: lectureCopy.quiz.title || '',
            questions: Array.isArray(lectureCopy.quiz.questions)
              ? lectureCopy.quiz.questions.map(q => ({
                questionText: q.questionText || '',
                questionType: q.questionType || 'multiple-choice',
                ...(q.questionType === 'multiple-choice' && {
                  options: Array.isArray(q.options) ? q.options : [],
                  correctAnswer: q.correctAnswer || ''
                }),
                ...(q.questionType === 'truth-sentence' && {
                  truthAnswers: Array.isArray(q.truthAnswers) ? q.truthAnswers : []
                }),
                ...(q.questionType === 'paragraph' && {
                  paragraphAnswer: q.paragraphAnswer || ''
                })
              }))
              : []
          };
        }

        console.log(`After processing - Lecture ${index}:`, {
          videoUrl: typeof updatedLecture.videoUrl,
          pdfUrl: typeof updatedLecture.pdfUrl
        });

        return updatedLecture;
      }));

      setUploadProgress(100);

      console.log("Data after processing:", {
        imageType: typeof imageUrl,
        curriculum: updatedLectures.map(l => ({
          id: l.id,
          videoUrlType: typeof l.videoUrl,
          pdfUrlType: typeof l.pdfUrl
        }))
      });

      return {
        ...data,
        image: imageUrl,
        curriculum: updatedLectures
      };
    } catch (error) {
      console.error("Upload error:", error);
      showNotification('error', 'Failed to upload files: ' + (error.message || 'Unknown error'));
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data) => {
    dispatch(setLoading(true));
    console.log("Form data before processing:", data);

    try {
      console.log("Image type:", typeof data.image, data.image instanceof File);
      if (typeof data.image === 'object') {
        console.log("Image object structure:", JSON.stringify(data.image, (key, value) => {
          if (value instanceof File) return `[File: ${value.name}]`;
          return value;
        }));
      }

      const validatedCurriculum = data.curriculum.map(lecture => {
        if (lecture.quiz) {
          return {
            ...lecture,
            quiz: {
              title: lecture.quiz.title || '',
              questions: (lecture.quiz.questions || []).map(q => ({
                questionText: q.questionText || '',
                questionType: q.questionType || 'multiple-choice',
                ...(q.questionType === 'multiple-choice' && {
                  options: Array.isArray(q.options) ? q.options : [],
                  correctAnswer: q.correctAnswer || ''
                }),
                ...(q.questionType === 'truth-sentence' && {
                  truthAnswers: Array.isArray(q.truthAnswers) ? q.truthAnswers : []
                }),
                ...(q.questionType === 'paragraph' && {
                  paragraphAnswer: q.paragraphAnswer || ''
                })
              }))
            }
          };
        }
        return lecture;
      });

      const processData = {
        ...data,
        curriculum: validatedCurriculum
      };
      console.log("Data before upload processing:", processData);

      const processedData = await prepareUploads(processData);
      console.log("Final processed data:", processedData);

      const payload = {
        quiz: processedData.quiz,
        curriculum: processedData.curriculum,
        date: new Date().toString(),
        title: processedData.title,
        welcomeMessage: processedData.welcomeMessage,
        description: processedData.description,
        primaryLanguage: processedData.language,
        subtitle: processedData.subtitle,
        image: processedData.image,
        category: processedData.category
      };

      console.log("Course payload to be sent:", payload);

      const response = await axios.post(`${backendUrl}/instructor/course/add`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("API response:", response);
      // navigate("/educator/my-courses");

      showNotification('success', 'Course created successfully');
    } catch (error) {
      console.error("Error creating course:", error);
      showNotification('error', 'Failed to create course: ' + (error.message || 'Unknown error'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-green-600 text-white py-6 shadow-md mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Course Management Dashboard</h1>
          <p className="mt-1 text-green-100">Create and manage your educational content</p>
        </div>
      </div>

      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 max-w-xs p-4 rounded-md shadow-lg z-50 ${notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
            notification.type === 'info' ? 'bg-blue-500' : 'bg-gray-500'
          } text-white`}>
          <p>{notification.message}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="course-form" className="bg-white rounded-lg shadow-md mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-green-700 flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Create New Course
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in the details to create a new course
            </p>
          </div>

          <div className="p-6">
            {isUploading && (
              <div className="mb-6 bg-green-50 p-4 rounded-md">
                <p className="text-sm font-medium text-green-700 mb-2">Uploading files...</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-green-600 mt-1 text-right">{uploadProgress}%</p>
              </div>
            )}

            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  type="button"
                  onClick={() => setActiveSectionTab('basic')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${activeSectionTab === 'basic' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Basic Information
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSectionTab('curriculum')}
                  className={`py-3 px-1 border-b-2 font-medium text-sm ${activeSectionTab === 'curriculum' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Curriculum
                </button>
              </nav>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {activeSectionTab === 'basic' && (
                <>
                  <InputField
                    label="Course Title"
                    name="title"
                    register={register}
                    errors={errors}
                    placeholder="Enter course title"
                    required
                    validation={{
                      required: "Course title is required",
                      minLength: {
                        value: 5,
                        message: "Title must be at least 5 characters long"
                      }
                    }}
                  />

                  <InputField
                    label="Subtitle"
                    name="subtitle"
                    register={register}
                    errors={errors}
                    placeholder="Enter course subtitle"
                    required
                    validation={{
                      required: "Subtitle is required",
                      minLength: {
                        value: 10,
                        message: "Subtitle must be at least 10 characters long"
                      }
                    }}
                  />

                  <InputField
                    label="Welcome Message"
                    name="welcomeMessage"
                    register={register}
                    errors={errors}
                    placeholder="Enter welcome message for students"
                    required
                    validation={{
                      required: "Welcome message is required"
                    }}
                  />

                  <InputField
                    label="Course Description"
                    name="description"
                    register={register}
                    errors={errors}
                    placeholder="Enter detailed course description"
                    isTextArea
                    required
                    validation={{
                      required: "Course description is required",
                      minLength: {
                        value: 50,
                        message: "Description must be at least 50 characters long"
                      }
                    }}
                  />

                  <SelectField
                    label="Course Category"
                    name="category"
                    register={register}
                    errors={errors}
                    options={[
                      ...categoriesState.map(cat => cat.categoreName),
                      "Other"
                    ]}
                    placeholder="Select category"
                    required
                    validation={{
                      required: "Course category is required"
                    }}
                    onChange={handleCategoryChange}
                  />

                  {isCustomCategory && (
                    <InputField
                      label="Custom Category Name"
                      name="category"
                      register={register}
                      errors={errors}
                      placeholder="Enter custom category name"
                      required
                      validation={{
                        required: "Category name is required"
                      }}
                    />
                  )}

                  <InputField
                    label="Primary Language"
                    name="language"
                    register={register}
                    errors={errors}
                    placeholder="e.g., English, Spanish, etc."
                    required
                    validation={{
                      required: "Primary language is required"
                    }}
                  />

                  <ThumbnailUpload
                    register={register}
                    errors={errors}
                    watch={watch}
                    setValue={setValue}
                  />
                </>
              )}

              {activeSectionTab === 'curriculum' && (
                <div className="space-y-6">
                  <div className="bg-green-50 p-4 rounded-md mb-6">
                    <h3 className="text-lg font-medium text-green-700 mb-2">Course Curriculum</h3>
                    <p className="text-sm text-green-600">
                      Add lectures, videos, and resources to your course
                    </p>
                  </div>

                  <LecturesList
                    lectures={getValues('curriculum')}
                    openQuizModal={openQuizModal}
                    handleRemoveLecture={handleRemoveLecture}
                    isEditCourse={true}
                  />

                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="w-full flex justify-center items-center bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors"
                    >
                      <Plus className="h-5 w-5 mr-2" /> Add New Lecture
                    </button>
                  </div>

                  <div className="mt-8 border-t pt-6">
                    <h3 className="font-medium text-lg mb-4">Course Quiz</h3>
                    {watch('quiz')?.questions?.length > 0 ? (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{watch('quiz').title}</span>
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
                        <p className="text-sm text-gray-600 mt-1">
                          {watch('quiz').questions.length} Questions
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={openCourseQuizModal}
                        className="w-full flex justify-center items-center bg-green-100 hover:bg-green-200 text-green-700 p-3 rounded-lg transition-colors"
                      >
                        <Plus className="h-5 w-5 mr-2" /> Add Course Quiz
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isUploading || isSubmitting}
                  className={`px-6 py-2 rounded-md transition-colors ${isUploading || isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                    }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <LectureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          handleAddLecture={handleAddLecture}
          videoPreview={videoPreview}
          pdfPreview={pdfPreview}
          setVideoPreview={setVideoPreview}
          setPdfPreview={setPdfPreview}
          handleRemovePdf={() => setPdfPreview(null)}
          handleRemoveVideo={() => setVideoPreview(null)}
          isEditing={false}
          initialData={{
            title: '',
            Duration: '',
            freePreview: false,
            videoUrl: null,
            pdfUrl: null
          }}
        />

        <QuizModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          lectureId={currentLectureId}
          handleAddQuiz={handleAddQuiz}
          initialQuizData={currentLectureQuiz}
        />

        <CourseQuizModal
          isOpen={isCourseQuizModalOpen}
          onClose={() => setIsCourseQuizModalOpen(false)}
          quizData={watch('quiz')}
          saveQuiz={handleCourseQuizSave}
        />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
            <Bell className="mr-2 h-5 w-5" /> Tips for Creating Great Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Course Content</h3>
              <p className="text-sm text-green-700">
                Create comprehensive content that addresses your audience's needs.
                Consider including varied learning materials like videos, PDFs, and quizzes.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Engagement</h3>
              <p className="text-sm text-green-700">
                Keep lectures concise (5-10 minutes) and engage students with real-world examples.
                Use free preview lectures to attract potential students.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-md">
              <h3 className="font-medium text-green-800 mb-2">Quality</h3>
              <p className="text-sm text-green-700">
                Ensure good audio/video quality and well-organized content structure.
                Review your course from a student's perspective before publishing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesController;