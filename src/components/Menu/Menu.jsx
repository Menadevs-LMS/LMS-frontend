
function Menu({ logout, role }) {
    return (
        <div className="absolute right-0 top-10 mr-8 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
            <div className="py-2 px-4 border-b border-gray-200 bg-gray-50">
                <p className="text-sm font-medium text-gray-700"> {role || 'Student'}</p>
            </div>
            <div className="py-1">
                <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Menu