import React, { useEffect, useState } from 'react';

const ThumbnailUpload = ({ register, errors, watch, setValue }) => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const image = watch('image');
  
  // Improved useEffect to handle image changes and preview generation
  useEffect(() => {
    console.log("Image value changed:", image);
    console.log("Image type:", image ? typeof image : 'null/undefined');
    
    // Clear previous preview if image is null
    if (!image) {
      setThumbnailPreview(null);
      return;
    }
    
    let objectUrl = null;
    let fileToUse = null;
    
    if (typeof image === 'string') {
      console.log("Using string URL directly:", image);
      setThumbnailPreview(image);
    } else if (image instanceof File) {
      console.log("Creating object URL from File object");
      fileToUse = image;
    } else if (image instanceof FileList && image.length > 0) {
      // Handle FileList object (which is what we're getting from the file input)
      console.log("Extracting File from FileList");
      fileToUse = image[0];
    } else if (typeof image === 'object' && image.type) {
      // Handle other File-like objects
      console.log("Creating object URL from File-like object");
      fileToUse = image;
    } else {
      console.log("Unknown image type, cannot create preview:", image);
      setThumbnailPreview(null);
    }
    
    // Create object URL if we have a valid file
    if (fileToUse) {
      console.log("Creating object URL from:", fileToUse);
      objectUrl = URL.createObjectURL(fileToUse);
      setThumbnailPreview(objectUrl);
    }
    
    // Proper cleanup function that always returns and handles the objectUrl scope correctly
    return () => {
      if (objectUrl) {
        console.log("Revoking object URL:", objectUrl);
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [image]);
  
  const handleFileChange = (e) => {
    console.log("File input change detected");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("File selected:", file);
      console.log("File type:", file.type);
      console.log("File size:", file.size);
      
      // Check if file is a valid image type
      const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!acceptedTypes.includes(file.type)) {
        console.error("Invalid file type:", file.type);
        return;
      }
      
      // Make sure we're setting a proper File object, not the FileList
      setValue('image', file, { shouldValidate: true });
      
      // This direct setting might also help in some cases where react-hook-form behaves unexpectedly
      const objectUrl = URL.createObjectURL(file);
      setThumbnailPreview(objectUrl);
    }
  };

  return (
    <div className='flex flex-col gap-1 mb-4'>
      <p className="flex">
        Course Thumbnail
        <span className="text-red-500 ml-1">*</span>
      </p>
      
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {thumbnailPreview ? (
            <div className="mb-4">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview" 
                className="mx-auto h-32 object-cover rounded"
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  console.error("Image source:", e.target.src);
                  console.error("Preview state:", thumbnailPreview);
                  e.target.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2NjY2NjYyIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDMgMTUgMyAxNSI+PC9wb2x5bGluZT48L3N2Zz4=";
                }}
              />
              <p className="text-sm text-green-600 mt-1">Preview loaded</p>
            </div>
          ) : (
            <>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-gray-500 mt-1">No image selected</p>
            </>
          )}
          
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="image-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
            >
              <span>Upload a file</span>
              <input
                id="image-upload"
                name="image"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="sr-only"
                onChange={handleFileChange}
                {...register('image', {
                  validate: (value) => {
                    console.log("Validating image:", value);
                    if (!value && !image) return "Thumbnail image is required";
                    if (value && value instanceof File) {
                      const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                      return acceptedTypes.includes(value.type) || 'Only PNG, JPEG and JPG files are accepted';
                    }
                    return true;
                  }
                })}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
        </div>
      </div>
      
      {errors.image && (
        <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
      )}
    </div>
  );
};

export default ThumbnailUpload;