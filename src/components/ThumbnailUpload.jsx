import { assets } from '../assets/assets';

 const ThumbnailUpload = ({ thumbnailPreview, handleFileChange }) => {
  return (
    <div className='flex flex-col justify-between flex-wrap mt-4'>
      <div className='flex md:flex-row flex-col items-center gap-3'>
        <p>Course Thumbnail</p>
        <label htmlFor='image' className='flex items-center gap-3'>
          <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
          <input
            type="file"
            id='image'
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
          {thumbnailPreview && (
            <img className='max-h-10' src={thumbnailPreview} alt="Thumbnail preview" />
          )}
          {!thumbnailPreview && <p className="text-sm text-gray-400">(No file selected)</p>}
        </label>
      </div>
    </div>
  );
};

export default ThumbnailUpload