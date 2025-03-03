import React from 'react';
import { assets } from '../../assets/assets';

const AddCourse = () => {

 
  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <form  className='flex flex-col gap-4 max-w-md w-full text-gray-500'>
        <div className='flex flex-col gap-1'>
          <p>Course Title</p>
          <input   type="text" placeholder='Type here' className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500' required />
        </div>

        <div className='flex flex-col gap-1'>
          <p>Course Description</p>
          <div ></div>
        </div>

        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex flex-col gap-1'>
            <p>Course Price</p>
            <input  type="number" placeholder='0' className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' required />
          </ div>

          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Course Thumbnail</p>
            <label htmlFor='thumbnailImage' className='flex items-center gap-3'>
              <img src={assets.file_upload_icon} alt="" className='p-3 bg-blue-500 rounded' />
              <input type="file" id='thumbnailImage'  accept="image/*" hidden />
              <img className='max-h-10' src={''} alt="" />
            </label>
          </div>
        </div>

        <div className='flex flex-col gap-1'>
          <p>Discount %</p>
          <input  type="number" placeholder='0' min={0} max={100} className='outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500' required />
        </div>

        {/* Adding Chapters & Lectures */}
        <div>
      
            <div  className="bg-white border rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b">
                <div className="flex items-center">
                  <img className={`mr-2 cursor-pointer transition-all  "-rotate-90"} `}  width={14} alt="" />
                  <span className="font-semibold">chapter title</span>
                </div>
                <span className="text-gray-500"> Lectures</span>
                <img  src={assets.cross_icon} alt="" className='cursor-pointer' />
              </div>
            
                <div className="p-4">
                    <div  className="flex justify-between items-center mb-2">
                      <span> mins </span>
                      <img src={assets.cross_icon} alt="" className='cursor-pointer' />
                    </div>
                
                  <div className="inline-flex bg-gray-100 p-2 rounded cursor-pointer mt-2" >
                    + Add Lecture
                  </div>
                </div>
         
            </div>
         
          <div className="flex justify-center items-center bg-blue-100 p-2 rounded-lg cursor-pointer" >
            + Add Chapter
          </div>
{/* 
        
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
                <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>
                <div className="mb-2">
                  <p>Lecture Title</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
         
                  />
                </div>
                <div className="mb-2">
                  <p>Duration (minutes)</p>
                  <input
                    type="number"
                    className="mt-1 block w-full border rounded py-1 px-2"
                
                  />
                </div>
                <div className="mb-2">
                  <p>Lecture URL</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border rounded py-1 px-2"
          
                  />
                </div>
                <div className="flex gap-2 my-4">
                  <p>Is Preview Free?</p>
                  <input
                    type="checkbox" className='mt-1 scale-125'
                   
                  />
                </div>
                <button type='button' className="w-full bg-blue-400 text-white px-4 py-2 rounded" >Add</button>
                <img  src={assets.cross_icon} className='absolute top-4 right-4 w-4 cursor-pointer' alt="" />
              </div>
            </div> */}
          
        </div>

        <button type="submit" className='bg-black text-white w-max py-2.5 px-8 rounded my-4'>
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddCourse;