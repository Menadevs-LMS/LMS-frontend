import  { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch } from 'react-redux';
import { updateLectuerProgress } from '../../store/courseProgress';

const VideoLesson = ({ 
  videoUrl, 
  lectureId, 
  courseId, 
  onComplete, 
  isCompleted = false 
}) => {
  const dispatch = useDispatch();
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isVideoCompleted, setIsVideoCompleted] = useState(isCompleted);
  const playerRef = useRef(null);
  const [completionSent, setCompletionSent] = useState(isCompleted);

  const handleProgress = (progress) => {
    setPlayed(progress.played);
    
    if (progress.played > 0.05 && !hasStarted) {
      setHasStarted(true);
    }

    if (progress.played >= 0.95 && !completionSent && !isVideoCompleted) {
      handleVideoCompletion();
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleVideoCompletion = async () => {
    if (completionSent || isVideoCompleted) return;

    try {
      setCompletionSent(true);
      setIsVideoCompleted(true);

      const payload = {
        viewed: true,
        dateViewed: new Date().toISOString(),
      };

      await dispatch(updateLectuerProgress({
        courseId,
        lectureId,
        payload
      })).unwrap();

      if (onComplete) {
        onComplete(lectureId);
      }

    } catch (error) {
      console.error('Error updating video completion:', error);
      setCompletionSent(false);
      setIsVideoCompleted(false);
    }
  };

  const handleEnded = () => {
    if (!completionSent && !isVideoCompleted) {
      handleVideoCompletion();
    }
  };

  useEffect(() => {
    setIsVideoCompleted(isCompleted);
    setCompletionSent(isCompleted);
  }, [isCompleted]);

  const getProgressPercentage = () => {
    return Math.round(played * 100);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-player-container">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isVideoCompleted && (
            <span className="text-green-600 text-sm font-medium flex items-center gap-1">
              ✓ Completed
            </span>
          )}
          {hasStarted && !isVideoCompleted && (
            <span className="text-blue-600 text-sm font-medium">
              In Progress ({getProgressPercentage()}%)
            </span>
          )}
        </div>
        {duration > 0 && (
          <span className="text-gray-500 text-sm">
            Duration: {formatTime(duration)}
          </span>
        )}
      </div>

      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        controls
        width="100%"
        height="auto"
        progressInterval={1000}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
      />

      {hasStarted && !isVideoCompleted && (
        <div className="mt-3">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{getProgressPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
        </div>
      )}

      {isVideoCompleted && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            🎉 Great job! You've completed this video lesson.
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoLesson;