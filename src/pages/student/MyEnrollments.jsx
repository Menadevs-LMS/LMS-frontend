
import { Line } from 'rc-progress';
import Footer from '../../components/student/Footer';

const MyEnrollments = () => {



    return (
        <>

            <div className='md:px-36 px-8 pt-10'>

                <h1 className='text-2xl font-semibold'>My Enrollments</h1>

                <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
                    <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
                        <tr>
                            <th className="px-4 py-3 font-semibold truncate">Course</th>
                            <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Duration</th>
                            <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Completed</th>
                            <th className="px-4 py-3 font-semibold truncate">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        <tr className="border-b border-gray-500/20">
                            <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 ">
                                <img alt="" className="w-14 sm:w-24 md:w-28" />
                                <iv className='flex-1'>
                                    <p className='mb-1 max-sm:text-sm'>Title</p>
                                    <Line className='bg-gray-300 rounded-full' strokeWidth={2} percent={0} />
                                </iv>
                            </td>
                            <td className="px-4 py-3 max-sm:hidden"></td>
                            <td className="px-4 py-3 max-sm:hidden">
                                <span className='text-xs ml-2'>Lectures</span>
                            </td>
                            <td className="px-4 py-3 max-sm:text-right">
                                <button className='px-3 sm:px-5 py-1.5 sm:py-2 bg-blue-600 max-sm:text-xs text-white'>
                                    Completed
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <Footer />

        </>
    )
}

export default MyEnrollments