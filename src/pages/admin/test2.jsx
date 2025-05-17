import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Video, FileText, Plus, Trash2 } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDispatch, useSelector } from 'react-redux';
import InputField from '../../components/InputField';
import ThumbnailUpload from '../../components/ThumbnailUpload'
import { useNavigate } from 'react-router-dom';
import { setLoading } from '../../store/auth';
import LectureModal from '../../components/LectureModal'
import QuizModal from '../../components/QuizModal'
import CourseQuizModal from '../../components/CourseQuizModal'
import { getAllCategories } from '../../store/categories'
import { useForm, useFieldArray } from 'react-hook-form';
import SelectField from '../../components/SelectField';
import LecturesList from '../../components/LecturesList'
const CoursesController = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [activeSectionTab, setActiveSectionTab] = useState('basic');
    const [isCustomCategory, setIsCustomCategory] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [notification, setNotification] = useState({ show: false, type: '', message: '' });

    const dispatch = useDispatch();
    const navigation = useNavigate();
    const categoriesState = useSelector((state) => state.categories.categories || []);
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        getValues,
        formState: { errors, isSubmitting }
    } = useForm({
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
    const { fields, append, remove } = useFieldArray({
        control,
        name: "curriculum",

    });
    const {
        fields: questionFields,
        append: appendQuestion,
        remove: removeQuestion,
        update: updateQuestion
    } = useFieldArray({
        control,
        name: "quiz.questions"
    });
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
    const [currentLectureId, setCurrentLectureId] = useState(null);
    const [currentCourseQuestion, setCurrentCourseQuestion] = useState({
        questionText: '',
        questionType: 'multiple-choice',
        options: ['', '', '', ''],
        correctAnswer: '',
        truthAnswers: [],
        paragraphAnswer: ''
    });
    const handleAddLecture = (lectureData) => {
        append(lectureData);
        setIsModalOpen(false);
        showNotification('success', 'Lecture added successfully');
    };
    const handleRemoveLecture = (index) => {
        remove(index);
        showNotification('info', 'Lecture removed');
    };
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
            if (file.type === 'application/pdf') {
                setLectureData(prev => ({ ...prev, pdfUrl: file }));
                setPdfPreview(URL.createObjectURL(file));
            } else {
                alert('Please upload a valid PDF file');
            }
        }
    };

  

    // Show notification function
    const showNotification = (type, message, duration = 5000) => {
        setNotification({ show: true, type, message });
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, duration);
    };
    
    const handleCourseQuizSave = (data) => {
        console.log("Course quiz data saved:", data);
        // Update the form state with the quiz data
        setCourseQuizData(data);
        
        // If you're using react-hook-form for the entire form:
        setValue('quiz', data);
        
        // Show success notification
        showNotification('success', 'Course quiz added successfully');
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
    // const handleRemoveLecture = (id) => {
    //     setLectures(prev => prev.filter(lecture => lecture.id !== id));
    // };
  
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

    const prepareUploads = async (data) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Upload course image
            let imageUrl = data.image;
            if (data.image instanceof File) {
                imageUrl = await uploadToS3(data.image);
            }

            // Upload lecture files
            const updatedLectures = await Promise.all(data.curriculum.map(async (lecture) => {
                let pdfUrl = lecture.pdfUrl;
                let videoUrl = lecture.videoUrl;

                if (lecture.pdfUrl instanceof File) {
                    pdfUrl = await uploadToS3(lecture.pdfUrl);
                }

                if (lecture.videoUrl instanceof File) {
                    videoUrl = await uploadToS3(lecture.videoUrl);
                }

                return {
                    ...lecture,
                    pdfUrl,
                    videoUrl
                };
            }));

            return {
                ...data,
                image: imageUrl,
                curriculum: updatedLectures
            };
        } catch (error) {
            showNotification('error', 'Failed to upload files');
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (data) => {
        console.log("processedLectures>>>>>>>", data)

        dispatch(setLoading(true));
        try {
            const processedData = await prepareUploads(data);

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
            console.log("payload>>>>>>>>>>>>>", payload)
            // const response = await axios.post(`${backendUrl}/instructor/course/add`, payload, {
            //     headers: {
            //         'Content-Type': 'application/json'
            //     }
            // });
            dispatch(setLoading(false));
            // console.log("Course uploaded successfully:", response.data);
            // navigation("/educator/my-courses")
        } catch (error) {
            dispatch(setLoading(false));
            console.error("Error uploading course:", error);
        }
    };
    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch])
    // Reset form
    // const resetForm = () => {
    //     setFormData({
    //         instructorId: '',
    //         instructorName: '',
    //         title: '',
    //         category: '',
    //         level: '',
    //         primaryLanguage: '',
    //         subtitle: '',
    //         description: '',
    //         imageFile: null,
    //         imagePreview: '',
    //         welcomeMessage: '',
    //         objectives: '',
    //         isPublised: false,
    //     });
    //     setCurriculum([]);
    //     setSelectedCourse(null);
    //     setIsEditing(false);
    //     setActiveSectionTab('basic');
    // };


    console.log("values>>>", getValues("curriculum"))
    return (
        <div className="min-h-screen bg-gray-50 pb-12">

            <div className="bg-green-600 text-white py-6 shadow-md mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold">Course Management Dashboard</h1>
                    <p className="mt-1 text-green-100">Create and manage your educational content</p>
                </div>
            </div>

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

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-6">
                            <nav className="flex space-x-8">
                                <button
                                    onClick={() => setActiveSectionTab('basic')}
                                    className={`py-3 px-1 border-b-2 font-medium text-sm ${activeSectionTab === 'basic' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                >
                                    Basic Information
                                </button>
                                <button
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
                                    {/* 
                                    <ThumbnailUpload
                                        register={register}
                                        errors={errors}
                                        watch={watch}
                                        setValue={setValue}
                                    /> */}

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

                                    {/* Existing curriculum items */}
                                    {getValues().curriculum?.length > 0 ? (
                                        <div className="space-y-4 mb-8">
                                            <h4 className="font-medium text-gray-700">Current Lectures ({getValues().curriculum.length})</h4>
                                            {getValues().curriculum.map((lecture, index) => (
                                                <div key={index} className="border border-gray-200 rounded-md p-4 hover:border-green-300 transition-colors">
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center">
                                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                                                                #{index + 1}
                                                            </span>
                                                            <h4 className="font-medium">{lecture.title || `Untitled Lecture`}</h4>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveLecture(index)}
                                                            className="text-red-500 hover:text-red-700 flex items-center"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                                                        </button>
                                                    </div>
                                                    {/* <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        {lecture.videoUrl && (
                                                            <div className="flex items-center text-gray-600">
                                                                <Video className="h-4 w-4 mr-2 text-green-600" />
                                                                <span className="truncate">
                                                                    {lecture.videoUrl.split('/').pop()}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {lecture.pdfUrl && (
                                                            <div className="flex items-center text-gray-600">
                                                                <FileText className="h-4 w-4 mr-2 text-green-600" />
                                                                <span className="truncate">
                                                                    {lecture.pdfUrl.split('/').pop()}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {lecture.freePreview && (
                                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-md mt-2 border border-green-200">
                                                            Free Preview Enabled
                                                        </span>
                                                    )} */}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-md border-2 border-dashed border-gray-300">
                                            <p className="text-gray-500">No lectures added yet</p>
                                            <p className="text-sm text-gray-400 mt-1">Use the form below to add your first lecture</p>
                                        </div>
                                    )}

                                    {/* Add new lecture form */}
                                    <div className="bg-gray-50 rounded-md p-6 border border-gray-200">
                                        <h4 className="font-medium text-gray-700 mb-4">Add New Lecture</h4>
                                        <div className="space-y-4">
                                            <div>
                                                <LecturesList
                                                    lectures={lectures}
                                                    openQuizModal={openQuizModal}
                                                    handleRemoveLecture={handleRemoveLecture}
                                                    isEditCourse={false}
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
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">

                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className={`px-6 py-2 rounded-md transition-colors ${isUploading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                                        }`}
                                >


                                    :Create Course

                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <LectureModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    lectureData={lectureData}
                    handleInputChange={handleInputChange}
                    handleFileUpload={handleFileUpload}
                    videoPreview={videoPreview}
                    pdfPreview={pdfPreview}
                    handleAddLecture={handleAddLecture}
                    handleRemovePdf={() => setPdfPreview(null)}
                    setPdfPreview={setPdfPreview}
                    setVideoPreview={setVideoPreview}
                    isEditing={false}
                    handleRemoveVideo={() => setVideoPreview(null)}

                />

        

                <CourseQuizModal
                    isOpen={isCourseQuizModalOpen}
                    onClose={() => setIsCourseQuizModalOpen(false)}
                    quizData={courseQuizData}
                    saveQuiz={handleCourseQuizSave}
                />
             
            </div>
        </div>
    );
};

export default CoursesController;