const API_KEY = "Fs7CukPGMRGTo5wJsYJ0GpdrBaEok5ScV9W2HsiU6WRkYBDOY55lUyTy";
const BASE_URL = "https://api.pexels.com/v1";

/**
 * Fetch images from the Pexels API based on a search query.
 * @param {string} query - The search term for images.
 * @returns {Promise<object[]>} - A promise that resolves to an array of image objects.
 */

export const fetchImages = async (query, page = 1, perPage = 16) => {
    if (!query) throw new Error("Query is required to fetch images.");

    try {
        const response = await fetch(`${BASE_URL}/search?query=${query}&page=${page}&per_page=${perPage}`, {
            method: "GET",
            headers: {
                Authorization: API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return {
            photos: data.photos,
            totalPages: Math.ceil(data.total_results / perPage),
        };
    } catch (error) {
        console.error("Error fetching images:", error);
        throw error;
    }
};
