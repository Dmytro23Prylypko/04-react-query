import { useEffect, useState } from "react";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import toast from "react-hot-toast";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

function App() {
  const [movieName, setMovieName] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);

  const [page, setPage] = useState(1);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isModalShown, setIsModalShown] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", movieName, page],
    queryFn: () => fetchMovies(movieName, page),
    enabled: movieName !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data && data.results.length > 0) {
      setMovies(data.results);
    } else if (data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  function onSubmit(query: string) {
    setMovies([]);
    setMovieName(query);
    setPage(1); 
  }

  const handleMovieSelection = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalShown(true);
  };

  const handleModalClose = () => {
    setIsModalShown(false);
    setSelectedMovie(null);
  };

  return (
    <>
      <SearchBar onSubmit={onSubmit} />
      {data && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleMovieSelection} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isModalShown && selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleModalClose} />
      )}
    </>
  );
}

export default App;
