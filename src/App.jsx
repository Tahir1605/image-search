import { useEffect, useState } from "react";

const ACCESS_KEY = "pTBFlC7vR3kNPDde4CENLVR6S8c688DUGnUhauDQoz8";

function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchImages = async () => {
    setLoading(true);
    const url = `https://api.unsplash.com/search/photos?page=${page}&query=${currentSearch}&client_id=${ACCESS_KEY}&per_page=12`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      const newImages = data.results;
      setImages(prev => (page === 1 ? newImages : [...prev, ...newImages]));
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setImages([]);
    setPage(1);
    setCurrentSearch(trimmed);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  const addToFavorites = (image) => {
    const updated = [...favorites, image];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const isFavorited = (id) => {
    return favorites.some(img => img.id === id);
  };

  useEffect(() => {
    if (currentSearch) fetchImages();
  }, [page, currentSearch]);

  return (
    <div className={`${theme === "dark" ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white" : "bg-white text-gray-900"} min-h-screen px-4 flex flex-col transition-colors duration-300`}>
      <header className="flex justify-between items-center px-2 sm:px-6 py-4">
        <h1 className="text-2xl font-bold text-center flex-1 ml-12">Image Search Engine</h1>
        <div className="flex items-center">
          <span className="text-sm font-semibold"></span>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="hidden"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div className={`dot absolute top-1 left-1 bg-white w-6 h-6 rounded-full transition-all duration-300 ${theme === "dark" ? "translate-x-6" : ""}`}></div>
            </div>
          </label>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-indigo-700 rounded-lg flex overflow-hidden shadow-lg">
        <input
          type="text"
          placeholder="Search anything here..."
          className="flex-1 px-5 py-4 bg-transparent text-white placeholder-white text-lg focus:outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="bg-red-500 px-6 text-lg font-semibold hover:bg-red-600 transition-all">Search</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto px-2">
        {images.map((image) => (
          <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-md">
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="w-full h-[230px] object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <p className="text-sm font-semibold text-white mb-2">{image.user.name}</p>
              <p className="text-xs text-gray-300 truncate mb-3">{image.alt_description || "No description"}</p>
              <div className="flex gap-3">
                <a
                  href={image.links.download + "?force=true"}
                  download
                  className="text-white font-semibold text-sm px-3 py-1 rounded-md border-none bg-green-500 shadow-md hover:bg-green-700 transition-all"
                >
                  Download
                </a>
                <button
                  onClick={() => addToFavorites(image)}
                  className={`text-sm px-3 py-1 rounded-md shadow-md ${isFavorited(image.id) ? "bg-red-600 text-white font-semibold border-none" : "bg-blue-500 text-white font-semibold border-none hover:bg-blue-700"}`}
                >
                  {isFavorited(image.id) ? "Favorited" : "Favorite"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && currentSearch && images.length === 0 && (
        <div className="text-center mt-10 text-gray-400 text-xl">
          No results found for <strong>"{currentSearch}"</strong>
        </div>
      )}

      {loading && (
        <div className="text-center mt-10 text-gray-400 text-lg">Loading...</div>
      )}

      {images.length > 0 && !loading && (
        <div className="text-center mt-10 mb-24">
          <button
            onClick={loadMore}
            className="bg-red-500 hover:bg-red-600 transition text-white px-6 py-2 rounded-md text-lg shadow-md"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
