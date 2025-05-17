import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from '../../components/educator/SideBar'
import Navbar from '../../components/educator/Navbar'
import Footer from '../../components/educator/Footer'

const Educator = ({ userData }) => {
    return (
        <div className="text-default min-h-screen bg-white">
            <Navbar userData={userData} />
            <div className='flex'>
                <SideBar />
                <div className='flex-1'>
                    {<Outlet />}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Educator