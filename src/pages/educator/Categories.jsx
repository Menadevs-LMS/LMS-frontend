import { useEffect, useState } from 'react';
import { addCategory, getAllCategories, deleteCategory } from '../../store/categories';
import { useSelector, useDispatch } from 'react-redux';

const Categories = () => {
    const state = useSelector((state) => state.categories);
    const [categoryName, setCategoryName] = useState("");
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        dispatch(addCategory(categoryName));
        dispatch(getAllCategories());
        setCategoryName("");
    };

    const handleDelete = (categoryId) => {
        dispatch(deleteCategory(categoryId));
        dispatch(getAllCategories());
    }
        return (
            <div className="flex flex-col items-start justify-between md:p-8 p-4 pt-8">
                <div className="w-full">
                    <h2 className="pb-4 text-lg font-medium">All Categories</h2>
                    <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-300 shadow-md">
                        <table className="table-auto w-full">
                            <thead className="text-gray-900 border-b bg-gray-100 text-sm text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">#</th>
                                    <th className="px-4 py-3 font-semibold">Category Name</th>
                                    <th className="px-4 py-3 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {state.categories.length > 0 ? (
                                    state.categories.map((category, index) => (
                                        <tr key={category._id} className="border-b hover:bg-gray-50 transition">
                                            <td className="px-4 py-3">{index + 1}</td>
                                            <td className="px-4 py-3">{category.categoreName}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    className="bg-red-500 text-white px-4 py-1.5 rounded-md shadow-md hover:bg-red-700 transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-3 text-center text-gray-500">
                                            No categories found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 w-full max-w-md">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-gray-600">
                        <div className="flex flex-col gap-1">
                            <label className="font-medium">Category Name</label>
                            <input
                                type="text"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Type here"
                                className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-400 focus:border-black transition"
                                required
                            />
                        </div>
                        <button type="submit" className="bg-black text-white w-max py-2.5 px-8 rounded-md shadow-md hover:bg-gray-800 transition">
                            ADD
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    export default Categories;
