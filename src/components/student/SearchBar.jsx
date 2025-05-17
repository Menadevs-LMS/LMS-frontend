import { assets } from '../../assets/assets'

const SearchBar = () => {



  return (
    <form  className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border border-gray-500/20 rounded">
      <img className="md:w-auto w-10 px-3" src={assets.search_icon} alt="search_icon" />
      <input  type="text" className="w-full h-full outline-none text-gray-500/80" placeholder="Search for courses" />
      <button type='submit' className="bg-green-600 rounded text-white md:px-10 px-7 md:py-3 py-2 mx-1">Search</button>
    </form>
  )
}

export default SearchBar