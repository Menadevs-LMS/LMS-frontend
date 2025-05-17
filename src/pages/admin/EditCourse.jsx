import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Plus, Edit, Pencil } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
import { editCourse } from "../../store/courses";
import { getCourseDetails } from '../../store/coursdetails';

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

const EditCourseController = () => {
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
    const [editingLecture, setEditingLecture] = useState(null);

    const [videoPreview, setVideoPreview] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [courseLoaded, setCourseLoaded] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { courseId } = useParams(); // Get course ID from URL params
    const categoriesState = useSelector((state) => state.categories.categories || []);
    const courseDetails = useSelector((state) => state.courseDetails?.course);

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

    // Helper functions
    const showNotification = (type, message, duration = 5000) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, duration);
    };

    // Fetch course data when component mounts
    useEffect(() => {
        if (courseId) {
            dispatch(setLoading(true));
            dispatch(getCourseDetails(courseId)).then((action) => {
                console.log("Course data received:", action.payload);
                if (action.payload) {
                    populateFormWithCourseData(action.payload);
                    setCourseLoaded(true);
                } else {
                    showNotification('error', 'Failed to load course data');
                    navigate('/educator/my-courses');
                }
                dispatch(setLoading(false));
            });
        }
    }, [courseId, dispatch, navigate]);

    // Populate form with existing course data
    const populateFormWithCourseData = (course) => {
        console.log("Populating form with course data:", course);
        
        // Format the curriculum to match the form schema
        const formattedCurriculum = course.curriculum?.map(lecture => {
            // Extract ID correctly, handling MongoDB ObjectId format
            const lectureId = lecture.id || (lecture._id?.$oid ? lecture._id.$oid : lecture._id);
            console.log("Processing lecture with ID:", lectureId);
            
            // Handle the lecture's quiz if it exists
            let formattedQuiz = null;
            if (lecture.quiz) {
                formattedQuiz = {
                    ...lecture.quiz,
                    _id: lecture.quiz._id?.$oid || lecture.quiz._id,
                    questions: lecture.quiz.questions?.map(q => ({
                        ...q,
                        _id: q._id?.$oid || q._id
                    })) || []
                };
            }
            
            return {
                id: lectureId,
                title: lecture.title,
                Duration: lecture.Duration,
                videoUrl: lecture.videoUrl,
                pdfUrl: lecture.pdfUrl,
                freePreview: lecture.freePreview || false,
                quiz: formattedQuiz
            };
        }) || [];

        // Format the course quiz
        let formattedCourseQuiz = { title: '', questions: [] };
        if (course.quiz) {
            formattedCourseQuiz = {
                ...course.quiz,
                _id: course.quiz._id?.$oid || course.quiz._id,
                questions: course.quiz.questions?.map(q => ({
                    ...q,
                    _id: q._id?.$oid || q._id
                })) || []
            };
        }

        console.log("Formatted curriculum:", formattedCurriculum);
        console.log("Formatted course quiz:", formattedCourseQuiz);

        // Reset the form with the course data
        reset({
            title: course.title || '',
            subtitle: course.subtitle || '',
            welcomeMessage: course.welcomeMessage || '',
            description: course.description || '',
            category: course.category || '',
            language: course.primaryLanguage || '',
            image: course.image || null,
            curriculum: formattedCurriculum,
            quiz: formattedCourseQuiz
        });

        // Set custom category state if needed
        setIsCustomCategory(
            !categoriesState.some(cat => cat.categoreName === course.category)
        );
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
        if (editingLecture) {
            // Update existing lecture
            const curriculum = getValues('curriculum');
            const updatedCurriculum = curriculum.map(lecture => 
                String(lecture.id) === String(editingLecture.id) 
                    ? { ...lectureData, id: lecture.id, quiz: lecture.quiz } 
                    : lecture
            );
            setValue('curriculum', updatedCurriculum);
            showNotification('success', 'Lecture updated successfully');
        } else {
            // Add new lecture
            append({
                ...lectureData,
                id: Date.now().toString()
            });
            showNotification('success', 'Lecture added successfully');
        }
        
        // Reset state
        setIsModalOpen(false);
        setVideoPreview(null);
        setPdfPreview(null);
        setEditingLecture(null);
    };
    
    const handleEditLecture = (lectureId) => {
        const lectureToEdit = getValues('curriculum').find(
            lecture => String(lecture.id) === String(lectureId)
        );
        
        console.log("Editing lecture:", lectureToEdit);
        
        if (lectureToEdit) {
            setEditingLecture(lectureToEdit);
            
            // Set previews if URLs exist
            if (lectureToEdit.videoUrl) {
                console.log("Setting video preview:", lectureToEdit.videoUrl);
                setVideoPreview(lectureToEdit.videoUrl);
            }
            
            if (lectureToEdit.pdfUrl) {
                console.log("Setting PDF preview:", lectureToEdit.pdfUrl);
                setPdfPreview(lectureToEdit.pdfUrl);
            }
            
            setIsModalOpen(true);
        }
    };

    const handleRemoveLecture = (lectureId) => {
        const index = getValues('curriculum').findIndex(
            lecture => String(lecture.id) === String(lectureId)
        );

        if (index !== -1) {
            remove(index);
            showNotification('info', 'Lecture removed');
        }
    };

    const handleAddQuiz = (lectureId, quizData) => {
        const lectureIndex = getValues('curriculum').findIndex(
            lecture => String(lecture.id) === String(lectureId)
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
            lecture => String(lecture.id) === String(lectureId)
        );
        
        const lectureQuiz = lecture?.quiz || null;
        console.log("Lecture quiz data:", lectureQuiz);
        setCurrentLectureQuiz(lectureQuiz);
        setIsQuizModalOpen(true);
    };

    const handleCourseQuizSave = (data) => {
        setValue('quiz', data);
        setIsCourseQuizModalOpen(false);
        showNotification('success', 'Course quiz updated successfully');
    };

    // Open the course quiz modal with existing data
    const openCourseQuizModal = () => {
        // Make sure we use the existing quiz data
        const currentQuiz = getValues('quiz');
        
        // Ensure questions are properly set up
        if (!currentQuiz || !currentQuiz.questions || !Array.isArray(currentQuiz.questions)) {
            setValue('quiz', {
                title: currentQuiz?.title || '',
                questions: []
            });
        }
        
        console.log("Opening course quiz modal with data:", getValues('quiz'));
        setIsCourseQuizModalOpen(true);
    };

    // File handling
    const uploadToS3 = async (file) => {
        if (!file) return null;
      
        try {
          console.log("Attempting to upload file:", file.name || "Unknown file");
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
              setUploadProgress(prev => Math.max(prev, percentCompleted));
            },
            // Add a longer timeout for larger files
            timeout: 60000 // 60 seconds
          });
      
          if (!response.data?.data?.Location) {
            throw new Error("Upload response missing Location URL");
          }
      
          console.log("File uploaded successfully:", response.data.data.Location);
          return response.data.data.Location;
        } catch (error) {
          console.error("S3 upload error:", error);
          
          // Provide more detailed error message based on the error type
          let errorMessage = "File upload failed";
          
          if (error.response) {
            // The server responded with a status code outside the 2xx range
            errorMessage = `Server error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`;
          } else if (error.request) {
            // The request was made but no response was received
            errorMessage = "Network error: No response received from server";
          } else {
            // Something else caused the error
            errorMessage = error.message || "Unknown upload error";
          }
          
          throw new Error(errorMessage);
        }
      };

    // Extract file from various possible formats
    const extractFile = (fileData) => {
        if (fileData instanceof File) {
            return fileData;
        }

        if (fileData && typeof fileData === 'object') {
            if (fileData['0'] instanceof File) {
                return fileData['0'];
            }
            if (fileData.url && typeof fileData.url === 'string') {
                return fileData.url;
            }
        }

        if (typeof fileData === 'string' && fileData.trim() !== '') {
            return fileData;
        }

        return null;
    };

    // Update the prepareUploads function in EditCourse.jsx

const prepareUploads = async (data) => {
    setIsUploading(true);
    setUploadProgress(0);
  
    try {
      // Process course image
      let imageUrl = null;
      const imageFile = extractFile(data.image);
      console.log("Image file to upload:", imageFile, "Type:", typeof imageFile);
      
      // Skip upload if it's already a URL
      if (typeof imageFile === 'string') {
        imageUrl = imageFile; // Keep existing URL
      } else if (imageFile) {
        try {
          imageUrl = await uploadToS3(imageFile);
        } catch (error) {
          console.error("Image upload failed:", error);
          showNotification('warning', 'Image upload failed. Keeping existing image.');
          // Use existing image URL from course details if available
          imageUrl = courseDetails?.image || null;
        }
      }
      setUploadProgress(20);
  
      // Process lectures
      const updatedLectures = await Promise.all(data.curriculum.map(async (lecture, index) => {
        const pdfFile = extractFile(lecture.pdfUrl);
        const videoFile = extractFile(lecture.videoUrl);
        let pdfUrl = null;
        let videoUrl = null;
  
        console.log(`Lecture ${index} - PDF:`, pdfFile, "Video:", videoFile);
  
        // Handle PDF file
        if (typeof pdfFile === 'string') {
          pdfUrl = pdfFile; // Keep existing URL
        } else if (pdfFile) {
          try {
            pdfUrl = await uploadToS3(pdfFile);
          } catch (error) {
            console.error(`PDF upload failed for lecture ${index}:`, error);
            showNotification('warning', `PDF upload failed for lecture "${lecture.title}". Keeping existing PDF.`);
            
            // Find the existing lecture in courseDetails to get the original URL
            const originalLecture = courseDetails?.curriculum?.find(
              l => String(l.id || l._id?.$oid || l._id) === String(lecture.id)
            );
            pdfUrl = originalLecture?.pdfUrl || null;
          }
        }
  
        // Handle Video file
        if (typeof videoFile === 'string') {
          videoUrl = videoFile; // Keep existing URL
        } else if (videoFile) {
          try {
            videoUrl = await uploadToS3(videoFile);
          } catch (error) {
            console.error(`Video upload failed for lecture ${index}:`, error);
            showNotification('warning', `Video upload failed for lecture "${lecture.title}". Keeping existing video.`);
            
            // Find the existing lecture in courseDetails to get the original URL
            const originalLecture = courseDetails?.curriculum?.find(
              l => String(l.id || l._id?.$oid || l._id) === String(lecture.id)
            );
            videoUrl = originalLecture?.videoUrl || null;
          }
        }
  
        setUploadProgress(prev => prev + Math.floor(80 / data.curriculum.length));
  
        return {
          ...lecture,
          videoUrl,
          pdfUrl
        };
      }));
  
      setUploadProgress(100);
  
      return {
        ...data,
        image: imageUrl,
        curriculum: updatedLectures
      };
    } catch (error) {
      showNotification('error', 'Failed to process files: ' + (error.message || 'Unknown error'));
      console.log("Upload error details:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

    const onSubmit = async (data) => {
        dispatch(setLoading(true));

        try {
            console.log("Form data before processing:", data);
            const processedData = await prepareUploads(data);
            console.log("Processed data for submission:", processedData);

            const payload = {
                id: courseId, 
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

            console.log("Submitting payload to API:", payload);

            // Use PUT to update the existing course
            const response = await axios.put(
                `${backendUrl}/instructor/course/update/${courseId}`, 
                payload, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("API Response:", response);
            
            // Dispatch update action to Redux
            dispatch(editCourse(payload));
            
            showNotification('success', 'Course updated successfully');
            setTimeout(() => {
                navigate("/educator/my-courses");
            }, 2000);
        } catch (error) {
            showNotification('error', 'Failed to update course: ' + (error.message || 'Unknown error'));
            console.error('Update error:', error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    if (!courseId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Error</h2>
                    <p className="mt-2">No course ID provided. Cannot edit course.</p>
                    <button 
                        onClick={() => navigate('/educator/my-courses')}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Return to My Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-green-600 text-white py-6 shadow-md mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Course Management Dashboard</h1>
                    <p className="mt-1 text-green-100">Edit your educational content</p>
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
                            <Edit className="mr-2 h-5 w-5" />
                            Edit Course
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Update your course details
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

                        {!courseLoaded ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                                <span className="ml-3 text-gray-600">Loading course data...</span>
                            </div>
                        ) : (
                            <>
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
                                                    Edit lectures, videos, and resources for your course
                                                </p>
                                            </div>

                                            <LecturesList
                                                lectures={getValues('curriculum')}
                                                openQuizModal={openQuizModal}
                                                handleRemoveLecture={handleRemoveLecture}
                                                handleEditLecture={handleEditLecture}
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
                                                                    onClick={() => openCourseQuizModal()}
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
                                                        onClick={() => openCourseQuizModal()}
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
                                            onClick={() => navigate('/educator/my-courses')}
                                            className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isUploading || isSubmitting}
                                            className={`px-6 py-2 rounded-md transition-colors ${isUploading || isSubmitting
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                                                }`}
                                        >
                                            {isSubmitting ? 'Updating...' : 'Update Course'}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>

                <LectureModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingLecture(null);
                        setVideoPreview(null);
                        setPdfPreview(null);
                    }}
                    handleAddLecture={handleAddLecture}
                    videoPreview={videoPreview}
                    pdfPreview={pdfPreview}
                    setVideoPreview={setVideoPreview}
                    setPdfPreview={setPdfPreview}
                    handleRemovePdf={() => setPdfPreview(null)}
                    handleRemoveVideo={() => setVideoPreview(null)}
                    isEditing={!!editingLecture}
                    initialData={editingLecture || {
                        title: '',
                        Duration: '',
                        freePreview: false,
                        videoUrl: null,
                        pdfUrl: null
                    }}
                />

                <QuizModal
                    isOpen={isQuizModalOpen}
                    onClose={() => {
                        setIsQuizModalOpen(false);
                        setCurrentLectureId(null);
                        setCurrentLectureQuiz(null);
                    }}
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

export default EditCourseController;