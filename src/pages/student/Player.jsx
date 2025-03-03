
import Rating from '../../components/student/Rating';
import Footer from '../../components/student/Footer';

const Player = () => {
  return (
    <>

      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36' >
        <div className=" text-gray-800" >
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">

          </div>

          <div className=" flex items-center gap-2 py-3 mt-10">
            <h1 className="text-xl font-bold">Rate this Course:</h1>
            <Rating />
          </div>

        </div>

        <div className='md:mt-10'>

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Player