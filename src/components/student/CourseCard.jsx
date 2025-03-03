import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'

const CourseCard = () => {


    return (
        <Link to="/coursedetails"  className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg">
            <img className="w-full"  alt='' src='data:image/jpeg;base64,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'/>
            <div className="p-3 text-left">
                <h3 className="text-base font-semibold">Title</h3>
                <p className="text-gray-500">Andrw</p>
                <div className="flex items-center space-x-2">
                    <p>5</p>
                    <div className="flex">
                       
                            <img
                                
                                className="w-3.5 h-3.5"
                                src={ assets.star }
                                alt=""
                            />
                      
                    </div>
                    <p className="text-gray-500">6</p>
                </div>
                <p className="text-base font-semibold text-gray-800">77</p>
            </div>
        </Link>
    )
}

export default CourseCard