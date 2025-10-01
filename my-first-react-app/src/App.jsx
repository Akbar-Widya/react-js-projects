import { useEffect, useState } from "react";
import Search from "./components/Search";
import Spinner from "./components/spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use"
import { getTrendingMovies, updateSearchCount } from "./appwrite";

// API - a set of rules that allows one software app to talk to one another
const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
   },
};

const App = () => {
   const [searchTerm, setSearchTerm] = useState("");
   const [errorMessage, setErrorMessage] = useState("");
   const [movieList, setMovieList] = useState([]);
   const [trendingMovies, setTrendingMovies] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')

   // Debounce the search to prevent making too many API requests
   // by waiting for the user to stop typing for 1000ms
   useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])

   const fetchMovies = async (query = "") => {
      setIsLoading(true);
      setErrorMessage("");

      try {
         const endpoint = query
            ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

         const response = await fetch(endpoint, API_OPTIONS);

         if (!response.ok) {
            throw new Error("Failed to fetch movies");
         }
         const data = await response.json();
         // console.log(data);
         if (data.Response === "False") {
            setErrorMessage(data.error || "Failed to fetch movies");
            setMovieList([]);
            return;
         }

         if(query && data.results.length > 0) {
            await updateSearchCount(query, data.results[0])
         }

         setMovieList(data.results || []);
      } catch (error) {
         console.error(`Error fetching movies: ${error}`);
         setErrorMessage("Error fetching movies. Please try again later.");
      } finally {
         setIsLoading(false);
      }
   };

   const loadTrendingMovies = async (query = '') => {
      try {
         const movies = await getTrendingMovies()

         setTrendingMovies(movies)
      } catch (error) {
         console.error(error)
      }
   }

   useEffect(() => {
      fetchMovies(debouncedSearchTerm);
   }, [debouncedSearchTerm]);

   useEffect(() => {
      loadTrendingMovies()
   }, [])

   return (
      <main>
         <div className="pattern" />

         <div className="wrapper">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {trendingMovies.length > 0 && (
               <section className="trending">
                  <h2>Trending Movies</h2>

                  <ul>
                     {trendingMovies.map((movie, index) => (
                        <li key={movie.$id}>
                           <p>{index + 1}</p>
                           <img src={movie.poster_url} alt={movie.title} />
                        </li>
                     ))}
                  </ul>
               </section>
            )}

            <section className="all-movies">
               <h2>All Movies</h2>

               {isLoading ? (
                  <Spinner />
               ) : errorMessage ? (
                  <p className="text-white">{errorMessage}</p>
               ) : (
                  <ul>
                     {movieList.map((movie) => (
                        <MovieCard movie={movie} />
                     ))}
                  </ul>
               )}
               <header>
                  <img src="./hero.png" alt="Hero Banner" />
                  <h1>
                     Find <span className="text-gradient">Movies</span> You'll
                     Enjoy Without the Hassle
                  </h1>
                  {/* 
                  <Search
                     searchTerm={searchTerm}
                     setSearchTerm={setSearchTerm}
                  /> */}
               </header>

               {/* {errorMessage && <p className="text-red-600">{errorMessage}</p>} */}
            </section>
         </div>
      </main>
   );
};

export default App;
