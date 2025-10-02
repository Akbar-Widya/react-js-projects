import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/spinner";
import MovieInfo from "../components/MovieInfo";
import { cn } from "../lib/utils";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
   },
};

const MovieOverview = () => {
   const { id } = useParams();
   const [movie, setMovie] = useState("");
   const [isLoading, setIsLoading] = useState(true);

   console.log(id);

   useEffect(() => {
      const fetchMovieDetails = async () => {
         setIsLoading(true);

         try {
            const response = await fetch(
               `${API_BASE_URL}/movie/${id}`,
               API_OPTIONS
            );

            if (!response.ok) {
               throw new Error("Failed to fetch movie details.");
            }

            const data = await response.json();
            setMovie(data);
         } catch (error) {
            console.error(error);
         } finally {
            setIsLoading(false);
         }
      };

      if (id) {
         fetchMovieDetails();
      }
      console.log("use effect activated");
   }, [id]);

   if (isLoading) {
      return <Spinner />;
   }

   const formatCurrency = (num) => {
      if (num >= 1000000000) {
         return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + ' Billion'
      } else if (num >= 1000000) {
         return (num / 1000000).toFixed(1).replace(/\.0$/, '') + ' Million'
      } else if (num >= 1000) {
         return (num / 1000).toFixed(1).replace(/\.0$/, '') + ' Thousand'
      } else {
         return num
      }
   }

   console.log(movie);
   return (
      <main>
         <div className="wrapper">
            <section className="flex flex-col w-full text-white mb-5">
               <div className="flex justify-end items-center">
                  <h1 className="!text-left ms-0 me-auto text-3xl font-bold text-white sm:text-4xl">
                     {movie.title}
                  </h1>

                  <p>
                     {movie.vote_average.toFixed(1)}
                     <span className="text-white/75">/10</span>
                  </p>
                  <p className="ms-3 text-white/75">({movie.vote_count})</p>
               </div>

               <div className="flex gap-2">
                  <p>{movie.release_date.split("-")[0]}</p>

                  <span>●</span>
                  <p>{movie.adult ? "18+" : "PG-13"}</p>

                  <span>●</span>
                  <p>{movie.runtime}min</p>
               </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-white">
               <div className="md:col-span-1">
                  <img
                     src={
                        movie.poster_path
                           ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                           : "/no-movie.png"
                     }
                     alt={movie.title}
                     className="poster rounded-lg shadow-lg w-full"
                  />
               </div>

               <div className="md:col-span-2 relative rounded-lg overflow-hidden group">
                  {/* Backdrop Image */}
                  <img
                     className="backdrop w-full h-full object-cover"
                     src={`https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`}
                     alt={`${movie.title} Backdrop`}
                  />

                  {/* Overlay with Play Icon */}
                  <div className="absolute inset-0 bg-black/40 flex justify-center items-center cursor-pointer transition-colors group-hover:bg-black/60">
                     <div className="w-20 h-20 rounded-full border-2 border-white/50 flex justify-center items-center bg-white/10 backdrop-blur-sm group-hover:border-white transition-colors">
                        {/* SVG Play Icon */}
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 24 24"
                           fill="currentColor"
                           className="w-10 h-10 text-white/80 group-hover:text-white transition-colors"
                        >
                           <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.536 0 3.284L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653z"
                              clipRule="evenodd"
                           />
                        </svg>
                     </div>
                  </div>
               </div>
            </section>

            <section className="bg-gray-800/50 p-6 rounded-lg text-white">
               <div className="flex flex-col lg:flex-row items-start gap-6">
                  <div className="flex-1">
                     <MovieInfo label="Genres" value={movie.overview} />
                     
                     <MovieInfo
                        label="Release Date"
                        value={movie.release_date}
                     />

                     <MovieInfo
                        label="Countries"
                        value={movie.production_countries.map((country) => (
                           <>
                              <span className="first:hidden">●</span>
                              <li className="list-none">{country.name}</li>
                           </>
                        ))}
                     />

                     <MovieInfo label="Status" value={movie.status} />

                     <MovieInfo
                        label="Languages"
                        value={movie.spoken_languages.map((language) => (
                           <>
                              <span className="first:hidden">●</span>
                              <li className="list-none">{language.english_name}</li>
                           </>
                        ))}
                     />

                     <MovieInfo label="Budget" value={`$${formatCurrency(movie.budget)}`} />

                     <MovieInfo label="Revenue" value={`$${formatCurrency(movie.revenue)}`} />

                     <MovieInfo label="Tagline" value={movie.tagline} />

                     <MovieInfo
                        label="Production Companies"
                        value={movie.production_companies.map((company) => (
                           <>
                              <span className="first:hidden">●</span>
                              <li className="list-none">{company.name}</li>
                           </>
                        ))}
                     />

                  </div>

                  <Link to="/" className="bg-purple-600 px-4 py-3 rounded-md">
                     Visit Homepage
                  </Link>
               </div>
            </section>
         </div>
      </main>
   );
};

export default MovieOverview;
