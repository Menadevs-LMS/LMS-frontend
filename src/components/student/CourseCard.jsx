import { Link } from 'react-router-dom'

const CourseCard = ({ id, image, title, category, description, key }) => {
  return (
    <Link
      to={`/coursedetails/${id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-200"
      key={key}
    >
      <div className="relative h-48 w-full overflow-hidden sm:h-56 md:h-64">
        <img
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          alt={title || 'Course image'}
          src={image}
        />
        <span className="absolute left-3 top-3 rounded-full bg-blue-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-2">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 md:line-clamp-4 h-auto min-h-[2.5rem] sm:min-h-[3.75rem] md:min-h-[5rem]">{description}</p>
        </div>

        <div className="mt-4 flex items-center">
          <span className="text-xs font-medium text-blue-600">View course details →</span>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard