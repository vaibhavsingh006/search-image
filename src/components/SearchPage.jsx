import React, { useState } from "react";
import { fetchImages } from "../utils/api";
import CanvasEditor from "./CanvasEditor";

const SearchPage = () => {
    const [query, setQuery] = useState("");
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(16);
    const [loading, setLoading] = useState(false);
    const [previousQuery, setPreviousQuery] = useState("");

    const handleSearch = async (page = 1) => {
        if (!query) {
            alert("Please enter a search term!");
            return;
        }

        if (page === 1 && query === previousQuery) {
            alert("You already searched for this term!");
            return;
        }

        setLoading(true);
        try {

            const photos = await fetchImages(query, page, perPage);

            if (photos.photos.length === 0) {
                alert("No images found for this search. Please try a different query.");
            } else {
                setImages(photos.photos);
                setTotalPages(photos.totalPages);
                setCurrentPage(page);
            }

            if (page === 1) {
                setPreviousQuery(query);
            }
        } catch (error) {
            alert("Failed to fetch images. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch(1);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        handleSearch(newPage);
    };

    return (
        <div className="min-h-screen bg-gray-100 relative">
            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 bg-gray-300 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent border-solid rounded-full animate-spin"></div>
                </div>
            )}

            {/* Header Section */}
            <header className="flex items-center justify-between px-6 py-4 bg-blue-600 text-white">
                <div className="flex items-center">
                    <div className="h-10 w-10 mr-3 bg-white text-blue-600 font-bold flex items-center justify-center rounded-full">
                        VS
                    </div>
                    <h1 className="text-xl font-bold">Image Search App</h1>
                </div>
            </header>

            {/* Main Content */}
            {!selectedImage ? (
                <div className="p-6">
                    {/* Search Bar */}
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                        <input
                            type="text"
                            placeholder="Search for images..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="w-full sm:w-auto flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => handleSearch(1)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                        >
                            Search
                        </button>
                    </div>

                    {/* Image Grid */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${loading ? 'opacity-50' : ''}`}>
                        {images.map((image) => (
                            <div key={image.id} className="relative group">
                                <img
                                    src={image.src.medium}
                                    alt={image.alt}
                                    onClick={() => setSelectedImage(image.src.large)}
                                    className="w-full h-48 object-cover rounded-lg shadow-md cursor-pointer transform group-hover:scale-105 transition-transform duration-200"
                                />
                                <button
                                    onClick={() => setSelectedImage(image.src.large)}
                                    className="absolute bottom-2 left-2 px-3 py-1 bg-black bg-opacity-60 text-white text-sm rounded-md focus:outline-none hover:bg-opacity-80"
                                >
                                    Add Captions
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || loading}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                </div>
            ) : (
                // Canvas Editor Component to edit the selected image
                <CanvasEditor
                    imageUrl={selectedImage}
                    onBack={() => setSelectedImage(null)} // Go back to the search results
                />
            )}
        </div>
    );
};

export default SearchPage;
